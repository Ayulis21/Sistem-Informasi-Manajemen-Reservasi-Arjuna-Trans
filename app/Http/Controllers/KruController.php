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

    // =========================================================================
    // REVISI BACKEND FINAL: SINKRON 100% SESUAI FILE MIGRASI ASLI ANDA (0 ERROR)
    // =========================================================================
    public function store(Request $request)
    {
        // 1. Jalur Validasi Internal Server Laravel Anda
        $request->validate([
            'nama_kru' => 'required|string|max:255',
            'no_telp'  => 'required|string|max:15',
            'peran'    => 'required|in:Driver,Helper', // Memastikan isi hanya Driver atau Helper sesuai enum Anda
        ]);

        // 2. Eksekusi Tembak Data Lurus Masuk ke Kamar MySQL yang Tepat
        Kru::create([
            'nama_kru'            => $request->nama_kru,
            'no_telp'             => $request->no_telp,
            'peran'               => $request->peran, // Mengirimkan kata 'Driver' / 'Helper' apa adanya secara pas
            'status_ketersediaan' => 'Ready',         // Mengunci nilai default awal operasional jalan Anda
            'status'              => 'Aktif',         // Mengunci status akun karyawan baru PO Arjuna Trans
        ]);

        return response()->json(['message' => 'Data kru baru berhasil didaftarkan ke sistem Arjuna Trans!']);
    }

    // Fungsi memperbarui data kru yang sudah ada di database
    public function update(Request $request, int $id)
    {
        $kru = Kru::findOrFail($id);

        $request->validate([
            'nama_kru' => 'required|string|max:255',
            'no_telp'  => 'required|string|max:15',
            'peran'    => 'required|in:Driver,Helper',
        ]);

        $kru->update([
            'nama_kru' => $request->nama_kru,
            'no_telp'  => $request->no_telp,
            'peran'    => $request->peran,
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
