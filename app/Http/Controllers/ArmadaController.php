<?php

namespace App\Http\Controllers;

use App\Models\Armada;
use Illuminate\Http\Request;

class ArmadaController extends Controller
{
    // Fungsi menarik seluruh armada untuk ditampilkan di ArmadaGrid.tsx React
    public function index()
    {
        $armada = Armada::orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $armada]);
    }

    // Fungsi menyimpan inputan bus baru dari ModalArmada.tsx React
    public function store(Request $request)
    {
        $request->validate([
            'nama_armada' => 'required|string|max:50',
            'tipe_armada' => 'required|in:Bus,Elf,Mobil',
            'nopol' => 'required|string|max:15|unique:armada,nopol',
            'kapasitas' => 'required|integer|min:1',
            'fasilitas' => 'nullable|string',
        ]);

        $armada = Armada::create([
            'nama_armada' => $request->nama_armada,
            'tipe_armada' => $request->tipe_armada,
            'nopol' => $request->nopol,
            'kapasitas' => $request->kapasitas,
            'fasilitas' => $request->fasilitas,
            'status_ketersediaan' => 'Tersedia', // Otomatis ready saat pertama didaftarkan
        ]);

        return response()->json(['message' => 'Unit armada baru berhasil didaftarkan!', 'data' => $armada]);
    }
}
