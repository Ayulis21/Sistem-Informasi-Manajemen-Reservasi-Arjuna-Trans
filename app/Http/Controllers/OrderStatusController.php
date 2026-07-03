<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pesanan;
use App\Models\RiwayatPembayaran;
use App\Models\Penugasan;

class OrderStatusController extends Controller
{
    // 1. Menampilkan halaman awal React via Inertia
    public function index()
    {
        return inertia('OrderStatus');
    }

    // 2. Fungsi Otak: Mencari Data Pesanan Berdasarkan ID atau Nomor WA
    public function search(Request $request)
    {
        $request->validate([
            'type' => 'required|in:ID,WA',
            'value' => 'required|string'
        ]);

        if ($request->type === 'ID') {
            // Cari 1 data spesifik berdasarkan ID Pesanan beserta relasi plotting bus & riwayat bayar
            $pesanan = Pesanan::with(['riwayatPembayaran', 'penugasan.armada'])
                ->where('id_pesanan', $request->value)
                ->first();

            return response()->json(['data' => $pesanan]);
        } else {
            // Cari daftar koleksi pesanan jika dicari menggunakan nomor WhatsApp terdaftar
            $pesananList = Pesanan::where('no_telp', $request->value)
                ->select('id_pesanan', 'nama_pemesan', 'tujuan_main')
                ->get();

            return response()->json(['data' => $pesananList]);
        }
    }

    // 3. Fungsi Otak: Menyimpan File Bukti Transfer Pelanggan
    public function uploadBuktiBayar(Request $request)
    {
        $request->validate([
            'id_pesanan' => 'required|exists:pesanan,id_pesanan',
            'nominal' => 'required|numeric',
            'tgl_bayar' => 'required|date',
            'tipe_keterangan' => 'required|in:DP,Cicil,Lunas',
            'bukti_transfer' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'catatan_pembayaran' => 'nullable|string|max:255'
        ]);

        $filePath = null;
        if ($request->hasFile('bukti_transfer')) {
            // File otomatis masuk ke boks folder storage/app/public/bukti-transfer
            $filePath = $request->file('bukti_transfer')->store('bukti-transfer', 'public');
        }

        RiwayatPembayaran::create([
            'id_pesanan' => $request->id_pesanan,
            'nominal' => $request->nominal,
            'tgl_bayar' => $request->tgl_bayar,
            'tipe_keterangan' => $request->tipe_keterangan,
            'bukti_transfer' => $filePath,
            'status_pembayaran' => 'Pending',
            'catatan_pembayaran' => $request->catatan_pembayaran,
        ]);

        return response()->json(['message' => 'Bukti pembayaran berhasil dikirim ke admin!']);
    }
}
