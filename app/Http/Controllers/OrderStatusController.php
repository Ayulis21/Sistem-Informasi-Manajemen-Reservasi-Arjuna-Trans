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
        // 1. Ambil semua baris dari tabel riwayat_pembayaran
        $rows = DB::table('riwayat_pembayaran')
            ->where('id_pesanan', $order->id_pesanan)
            ->get();

        $allPayments = [];

        // 2. 🎯 KUNCI SAKRAL: Bongkar isi JSON di setiap baris
        foreach ($rows as $row) {
            $isiCatatan = $row->catatan_pembayaran;

            // Cek apakah kolom catatan isinya JSON Array (Data lama yang menumpuk)
            if (str_starts_with($isiCatatan, '[')) {
                $decoded = json_decode($isiCatatan, true);
                if (is_array($decoded)) {
                    foreach ($decoded as $item) {
                        $allPayments[] = [
                            'tipe_keterangan'   => $item['type'] ?? 'Cicil',
                            'nominal'           => (float)($item['amount'] ?? 0),
                            'tgl_bayar'         => $item['date'] ?? $row->tgl_bayar,
                            'status_pembayaran' => $item['paymentStatus'] ?? 'Pending',
                            'catatan_pembayaran' => $item['notes'] ?? ''
                        ];
                    }
                }
            } else {
                // Jika data baru (bukan JSON), masukkan sebagai 1 baris biasa
                $allPayments[] = [
                    'tipe_keterangan'   => $row->tipe_keterangan,
                    'nominal'           => (float)$row->nominal,
                    'tgl_bayar'         => $row->tgl_bayar,
                    'status_pembayaran' => $row->status_pembayaran,
                    'catatan_pembayaran' => $row->catatan_pembayaran
                ];
            }
        }

        // 3. Hitung total yang sudah ACC (Hanya untuk sisa piutang)
        $totalPaidValid = collect($allPayments)
            ->where('status_pembayaran', 'Disetujui')
            ->sum('nominal');

        return [
            'id'               => $order->id_pesanan,
            'customerName'     => $order->nama_pemesan,
            'totalPrice'       => (int)$order->harga_sewa,
            'downPayment'      => (int)$totalPaidValid,
            'remainingBalance' => (int)$order->harga_sewa - $totalPaidValid,
            'departureTime'    => $order->tgl_berangkat,
            'whatsapp'         => $order->no_telp,
            'destination'      => $order->tujuan_main,
            // 🎯 INI YANG BIKIN REACT MUNCUL BANYAK KOTAK:
            'paymentHistory'   => $allPayments,
            'fleets'           => $this->getAssignedFleets($order->id_pesanan)
        ];
    }

    // Fungsi tambahan untuk ambil armada (biar rapi)
    private function getAssignedFleets(string $idPesanan)
    {
        return DB::table('penugasan')
            ->leftJoin('armada', 'penugasan.id_armada', '=', 'armada.id_armada')
            ->where('penugasan.id_pesanan', $idPesanan)
            ->select('armada.nama_armada as name', 'armada.nopol as plate', 'penugasan.plat_mitra', 'penugasan.nama_po_mitra')
            ->get()
            ->map(function ($f) {
                return [
                    'name'  => $f->name ?: $f->nama_po_mitra,
                    'plate' => $f->plate ?: $f->plat_mitra
                ];
            });
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
