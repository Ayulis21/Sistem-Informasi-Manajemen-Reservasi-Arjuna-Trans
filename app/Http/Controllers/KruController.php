<?php

namespace App\Http\Controllers;

use App\Models\Kru;
use Illuminate\Http\Request;

class KruController extends Controller
{
    // Fungsi menarik seluruh data kru dari database MySQL untuk di-render oleh CrewGrid.tsx
    public function index()
    {
        $kru = Kru::orderBy('created_at', 'desc')->get();
        return response()->json($kru);
    }
    public function store(Request $request)
    {
        // 1. Jalur Validasi Internal Server Laravel Anda
        $request->validate([
            'nama_kru' => 'required|string|max:255',
            'no_telp'  => 'required|string|max:15',
            'peran'    => 'required|in:Driver,Helper',
            'status_ketersediaan' => 'required|in:Ready,Bertugas,Cuti',
            'status'   => 'required|in:Aktif,Tidak Aktif',
        ]);

        // 2. Eksekusi Tembak Data Lurus Masuk ke Kamar MySQL yang Tepat
        Kru::create([
            'nama_kru'            => $request->nama_kru,
            'no_telp'             => $request->no_telp,
            'peran'               => $request->peran,
            'status_ketersediaan' => 'Ready',
            'status'              => 'Aktif',
        ]);

        return response()->json(['message' => 'Data kru baru berhasil didaftarkan ke sistem Arjuna Trans!']);
    }

    // Fungsi memperbarui data kru yang sudah ada di database
    public function update(Request $request, int $id)
    {
        // 1. Cari data krunya
        $kru = \App\Models\Kru::findOrFail($id);

        // 2. Jalankan validasi (Pastikan data dari React benar)
        $request->validate([
            'nama_kru' => 'required|string|max:255',
            'no_telp'  => 'required|string|max:15',
            'peran'    => 'required|in:Driver,Helper',
            'status_ketersediaan' => 'required|in:Ready,Bertugas,Cuti',
            'status'   => 'required|in:Aktif,Tidak Aktif',
        ]);

        // 3. 🎯 SIMPAN DATA ASLINYA (Ambil dari $request, bukan tulis aturannya)
        $kru->update([
            'nama_kru'           => $request->nama_kru,
            'no_telp'            => $request->no_telp,
            'peran'              => $request->peran,
            'status_ketersediaan' => $request->status_ketersediaan,
            'status'             => $request->status,
        ]);

        return response()->json(['message' => 'Data profil kru berhasil diperbarui!']);
    }

    // Fungsi menghapus data kru secara permanen dari database
    public function destroy(int $id)
    {
        $kru = Kru::findOrFail($id);
        $kru->delete();

        return response()->json(['message' => 'Data kru berhasil dihapus dari sistem!']);
    }
}
