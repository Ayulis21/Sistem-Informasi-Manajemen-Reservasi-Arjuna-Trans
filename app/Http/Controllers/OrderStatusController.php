<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderStatusController extends Controller
{
    // A. FUNGSI CARI PESANAN (Via ID atau WhatsApp)
    public function search(Request $request)
    {
        $type = $request->type; // 'ID' atau 'WA'
        $val = trim($request->value);

        if ($type === 'ID') {
            // Cari 1 data spesifik
            $order = DB::table('pesanan')->where('id_pesanan', $val)->first();
            if (!$order) return response()->json(['data' => null], 404);

            return response()->json(['data' => $this->formatOrderData($order)]);
        } else {
            // Cari daftar pesanan berdasarkan nomor WA
            $list = DB::table('pesanan')
                ->where('no_telp', 'like', "%$val%")
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json(['data' => $list]);
        }
    }

    // B. FORMAT DATA (Agar sinkron dengan React)
    private function formatOrderData(object $order)
    {
        // 1. Hitung Duit yang sudah di-ACC (Disetujui)
        $paid = DB::table('riwayat_pembayaran')
            ->where('id_pesanan', $order->id_pesanan)
            ->where('status_pembayaran', 'Disetujui')
            ->sum('nominal');

        // 2. Ambil Riwayat Pembayaran (Semua: Pending/ACC/Tolak)
        $history = DB::table('riwayat_pembayaran')
            ->where('id_pesanan', $order->id_pesanan)
            ->orderBy('created_at', 'desc')
            ->get();

        // 3. Ambil Armada yang ditugaskan (Jika status sudah Terjadwal/Jalan)
        $fleets = DB::table('penugasan')
            ->leftJoin('armada', 'penugasan.id_armada', '=', 'armada.id_armada')
            ->where('penugasan.id_pesanan', $order->id_pesanan)
            ->select('armada.nama_armada as name', 'armada.nopol as plate', 'penugasan.plat_mitra', 'penugasan.nama_po_mitra')
            ->get()
            ->map(function ($f) {
                return [
                    'name' => $f->name ?: $f->nama_po_mitra,
                    'plate' => $f->plate ?: $f->plat_mitra
                ];
            });

        return [
            'id' => $order->id_pesanan,
            'id_pesanan' => $order->id_pesanan,
            'customerName' => $order->nama_pemesan,
            'destination' => $order->tujuan_main,
            'departureTime' => $order->tgl_berangkat,
            'whatsapp' => $order->no_telp,
            'totalPrice' => (int)$order->harga_sewa,
            'downPayment' => (int)$paid,
            'remainingBalance' => (int)$order->harga_sewa - $paid,
            'status' => $order->status_pesanan,
            'fleets' => $fleets,
            'paymentHistory' => $history
        ];
    }

    // C. FUNGSI UPLOAD BUKTI (Sisi Pelanggan)
    public function uploadBuktiBayar(Request $request)
    {
        $request->validate([
            'id_pesanan' => 'required',
            'nominal' => 'required|numeric|min:1000',
            'bukti_transfer' => 'required|image|max:2048', // Maks 2MB
        ]);

        if ($request->hasFile('bukti_transfer')) {
            $file = $request->file('bukti_transfer');
            $namaFile = 'BUKTI-USER-' . time() . '-' . Str::random(5) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/bukti_transfer'), $namaFile);

            DB::table('riwayat_pembayaran')->insert([
                'id_pesanan' => $request->id_pesanan,
                'nominal' => $request->nominal,
                'tgl_bayar' => $request->tgl_bayar ?: now(),
                'tipe_keterangan' => $request->tipe_keterangan ?: 'Cicil',
                'bukti_transfer' => $namaFile,
                'status_pembayaran' => 'Pending', // <--- Penting: Harus Pending agar Admin ACC
                'catatan_pembayaran' => 'Input mandiri oleh pelanggan.',
                'created_at' => now(),
                'updated_at' => now()
            ]);

            return response()->json(['message' => 'Sukses!']);
        }
    }
}
