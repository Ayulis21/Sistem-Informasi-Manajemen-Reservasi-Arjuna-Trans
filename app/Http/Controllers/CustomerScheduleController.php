<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pesanan;

class CustomerScheduleController extends Controller
{
    public function getSchedule()
    {
        // Menarik data tanggal pakai bus yang statusnya sudah disetujui/terjadwal untuk kalender
        $jadwalBus = Pesanan::whereIn('status_pesanan', ['Disetujui', 'Terjadwal'])
            ->select('id_pesanan', 'tgl_berangkat', 'tgl_selesai', 'tujuan_main', 'tipe_unit_diminta')
            ->get();

        return response()->json(['schedule' => $jadwalBus]);
    }
}
