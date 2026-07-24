<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // 🎯 TAMBAHKAN INI: Gerbang Database
use Inertia\Inertia;

class ScheduleController extends Controller
{
    // App\Http\Controllers\ScheduleController.php

    // app/Http/Controllers/ScheduleController.php

    public function index()
    {
        $orders = DB::table('pesanan')
            ->whereIn('status_pesanan', ['Disetujui', 'Terjadwal', 'Selesai'])
            ->get()
            ->map(function ($order) {
                // 🎯 KUNCI: Ambil data penugasan sebagai objek lengkap, bukan cuma nama
                $order->assignments = DB::table('penugasan')
                    ->leftJoin('armada', 'penugasan.id_armada', '=', 'armada.id_armada')
                    ->where('id_pesanan', $order->id_pesanan)
                    ->select(
                        'penugasan.jenis_aset as assetType',
                        'penugasan.id_armada as armadaId',
                        'penugasan.plat_mitra as platLuar',
                        'penugasan.nama_po_mitra as namaMitra',
                        'armada.nama_armada as namaInternal'
                    )
                    ->get()
                    ->map(function ($a) {
                        // Berikan nama unit yang seragam untuk ditampilkan di UI
                        $a->nama_tampilan = ($a->assetType === 'internal')
                            ? $a->namaInternal
                            : ($a->namaMitra . " (" . $a->platLuar . ")");
                        return $a;
                    });
                return $order;
            });

        $totalFleet = DB::table('armada')->count();

        return Inertia::render('Schedule', [
            'dbOrders'   => $orders,
            'totalFleet' => $totalFleet
        ]);
    }
    public function getPublicSchedule()
    {
        // 1. Ambil data pesanan yang SAH (bukan batal/pending baru)
        $orders = DB::table('pesanan')
            ->whereIn('status_pesanan', ['Disetujui', 'Terjadwal', 'Selesai'])
            ->get()
            ->map(function ($o) {
                // Tarik armada yang dipasang untuk pesanan ini
                $o->assignments = DB::table('penugasan')
                    ->leftJoin('armada', 'penugasan.id_armada', '=', 'armada.id_armada')
                    ->where('id_pesanan', $o->id_pesanan)
                    ->select('armada.nama_armada as name', 'armada.tipe_armada as type', 'armada.id_armada as armadaId')
                    ->get();
                return $o;
            });

        // 2. Ambil total jumlah armada internal (untuk hitung kapasitas garasi)
        $totalArmada = DB::table('armada')->count();

        return response()->json([
            'orders' => $orders,
            'totalArmadaCount' => $totalArmada
        ]);
    }
}
