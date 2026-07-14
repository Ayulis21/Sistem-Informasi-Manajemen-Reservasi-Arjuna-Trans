<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // 🚀 FIX: Impor gerbang database SQL
use Inertia\Inertia;                // 🚀 FIX: Impor gerbang transmisi React Inertia

class PlottingController extends Controller
{
    // Di dalam Controller yang merender halaman Plotting
    // Di dalam Controller yang merender halaman Plotting
    public function index()
    {
        // 1. Ambil data Pesanan + Detail + Penugasan
        $orders = DB::table('pesanan')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                // Ambil Kebutuhan Armada
                $order->fleetRequirements = DB::table('pesanan_detail_armada')
                    ->where('id_pesanan', $order->id_pesanan)
                    ->get();

                // Ambil Penugasan yang sudah ada
                $order->assignments = DB::table('penugasan')
                    ->where('id_pesanan', $order->id_pesanan)
                    ->get();

                return $order;
            });

        // 2. 🎯 HITUNG JARAK KRU (VERSI AMAN)
        $crew = DB::table('kru')->get()->map(function ($c) {
            // Hitung Total KM
            $totalKm = DB::table('penugasan')
                ->join('pesanan', 'penugasan.id_pesanan', '=', 'pesanan.id_pesanan')
                ->where(function ($q) use ($c) {
                    $q->where('penugasan.id_driver', $c->id_kru)
                        ->orWhere('penugasan.id_helper', $c->id_kru);
                })
                ->where('pesanan.status_pesanan', 'Selesai')
                ->whereMonth('pesanan.tgl_selesai', now()->month)
                ->whereYear('pesanan.tgl_selesai', now()->year)
                ->sum('pesanan.estimasi_jarak');

            $c->total_km = (int)$totalKm;

            // Ambil Tanggal Terakhir Selesai
            $lastTrip = DB::table('penugasan')
                ->join('pesanan', 'penugasan.id_pesanan', '=', 'pesanan.id_pesanan')
                ->where(function ($q) use ($c) {
                    $q->where('penugasan.id_driver', $c->id_kru)
                        ->orWhere('penugasan.id_helper', $c->id_kru);
                })
                ->max('pesanan.tgl_selesai');

            $c->total_km = (int)$totalKm;
            $c->last_trip_date = $lastTrip;
            return $c;
        });

        return Inertia::render('Plotting', [
            'orders' => $orders,
            'armada' => DB::table('armada')->get(),
            'crew'   => $crew,
        ]);
    }

    public function savePlotting(Request $request)
    {
        $id_pesanan = $request->id_pesanan;
        $assignments = $request->input('assignments', []);

        try {
            DB::transaction(function () use ($id_pesanan, $assignments) {
                // 1. Hapus plotting lama
                DB::table('penugasan')->where('id_pesanan', $id_pesanan)->delete();

                // 2. Simpan hanya yang VALID
                foreach ($assignments as $a) {
                    $mode = strtolower($a['mode'] ?? '');
                    $armadaId = $a['armadaId'] ?? null;
                    $poLuar = $a['poLuar'] ?? null;

                    // 🎯 KUNCI: Hanya insert jika ada isinya
                    if (($mode === 'internal' && $armadaId) || ($mode === 'rekanan' && $poLuar)) {
                        DB::table('penugasan')->insert([
                            'id_pesanan' => $id_pesanan,
                            'jenis_aset' => $mode,
                            'id_armada'  => $armadaId,
                            'id_driver'  => $a['driverId'] ?? null,
                            'id_helper'  => $a['helperId'] ?? null,
                            'nama_po_mitra' => $poLuar,
                            'plat_mitra'    => $a['platLuar'] ?? null,
                            'kapasitas_mitra'   => $a['kapasitasLuar'] ?? null,
                            'harga_modal_mitra' => $a['biayaLuar'] ?? null,
                        ]);
                    }
                }

                // 3. 🎯 LOGIKA POIN 1: Cek kecukupan berdasarkan data riil di DB
                $totalDiminta = DB::table('pesanan_detail_armada')
                    ->where('id_pesanan', $id_pesanan)
                    ->sum('qty');

                // Hitung yang sudah benar-benar terisi di tabel penugasan
                $jumlahTerplot = DB::table('penugasan')
                    ->where('id_pesanan', $id_pesanan)
                    ->where(function ($q) {
                        $q->whereNotNull('id_armada')->orWhereNotNull('nama_po_mitra');
                    })
                    ->count();

                // Update status pesanan: Terjadwal jika PENUH, tetap Disetujui jika belum
                $statusBaru = ($jumlahTerplot >= $totalDiminta && $totalDiminta > 0) ? 'Terjadwal' : 'Disetujui';

                DB::table('pesanan')
                    ->where('id_pesanan', $id_pesanan)
                    ->update(['status_pesanan' => $statusBaru]);
            });

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
