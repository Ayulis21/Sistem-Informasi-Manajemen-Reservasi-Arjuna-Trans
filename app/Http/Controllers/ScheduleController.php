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
                // Ambil armada (Internal/Mitra)
                $order->buses = DB::table('penugasan')
                    ->leftJoin('armada', 'penugasan.id_armada', '=', 'armada.id_armada')
                    ->where('id_pesanan', $order->id_pesanan)
                    ->select(DB::raw("IF(jenis_aset = 'internal', armada.nama_armada, nama_po_mitra) as nama_unit"))
                    ->pluck('nama_unit');
                return $order;
            });

        $totalFleet = DB::table('armada')->count();

        return Inertia::render('Schedule', [
            'dbOrders' => $orders,    // 🎯 Sesuai props di Schedule.tsx
            'totalFleet' => $totalFleet
        ]);
    }

    // app/Http/Controllers/ScheduleController.php

    // app/Http/Controllers/ScheduleController.php

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
