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
        $orders = DB::table('pesanan')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                // 1. Ambil data KEBUTUHAN (Ini untuk angka penyebut, misal: /4)
                $order->fleetRequirements = DB::table('pesanan_detail_armada')
                    ->where('id_pesanan', $order->id_pesanan)
                    ->get()
                    ->map(function ($item) {
                        $armada = DB::table('armada')->where('tipe_armada', $item->tipe_armada)->first();
                        return [
                            'armada_id'   => $armada ? $armada->id_armada : "",
                            'tipe_armada' => $item->tipe_armada,
                            'qty'         => (int)$item->qty
                        ];
                    });

                // 2. 🎯 KUNCI PERBAIKAN: Ambil data REALISASI PLOTTING (Ini untuk angka pembilang, misal: 4/)
                // Kita tarik dari tabel penugasan
                $order->assignments = DB::table('penugasan')
                    ->where('id_pesanan', $order->id_pesanan)
                    ->get();

                return $order;
            });

        return Inertia::render('Plotting', [
            'orders' => $orders,
            'armada' => DB::table('armada')->get(),
            'crew'   => DB::table('kru')->get(),
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
