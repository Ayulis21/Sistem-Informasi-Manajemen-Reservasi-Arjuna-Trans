<?php

namespace App\Http\Controllers;

use App\Models\Kru;
use Illuminate\Http\Request;

class KruController extends Controller
{
    // Fungsi menarik seluruh kru untuk ditampilkan di CrewGrid.tsx React
    public function index()
    {
        $kru = Kru::orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $kru]);
    }

    // Fungsi menyimpan inputan kru baru dari ModalCrew.tsx React
    public function store(Request $request)
    {
        $request->validate([
            'nama_kru' => 'required|string|max:255',
            'no_telp' => 'required|string|max:15',
            'peran' => 'required|in:Driver,Helper',
        ]);

        $kru = Kru::create([
            'nama_kru' => $request->nama_kru,
            'no_telp' => $request->no_telp,
            'peran' => $request->peran,
            'status_ketersediaan' => 'Ready',
            'status' => 'Aktif',
        ]);

        return response()->json(['message' => 'Kru baru berhasil didaftarkan!', 'data' => $kru]);
    }
}
