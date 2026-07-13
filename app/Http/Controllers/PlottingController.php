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
                ->whereIn('pesanan.status_pesanan', ['Terjadwal', 'Selesai'])
                ->sum('pesanan.estimasi_jarak');

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
        $assignments = $request->assignments; // Array berisi data bus, sopir, helper

        try {
            DB::transaction(function () use ($id_pesanan, $assignments) {
                // 1. Hapus plotting lama (jika ada) untuk pesanan ini agar tidak dobel
                DB::table('penugasan')->where('id_pesanan', $id_pesanan)->delete();

                // 2. Masukkan plotting baru ke tabel penugasan
                foreach ($assignments as $a) {
                    DB::table('penugasan')->insert([
                        'id_pesanan'   => $id_pesanan,
                        'jenis_aset'   => strtolower($a['mode']), // internal atau rekanan
                        'id_armada'    => $a['armadaId'],
                        'id_driver'    => $a['driverId'],
                        'id_helper'    => $a['helperId'],
                        'created_at'   => now(),
                        'updated_at'   => now(),
                    ]);
                }

                // 3. Update status pesanan di tabel pesanan menjadi 'Terjadwal' 
                // Agar status di list kiri otomatis berubah warna/label
                DB::table('pesanan')
                    ->where('id_pesanan', $id_pesanan)
                    ->update(['status_pesanan' => 'Terjadwal']);
            });

            return response()->json(['status' => 'success', 'message' => 'Plotting berhasil disimpan!']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
