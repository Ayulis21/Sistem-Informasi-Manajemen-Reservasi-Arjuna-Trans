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
        try {
            $idPesanan = $request->id_pesanan;
            $nominalBaru = floatval($request->nominal);

            // 1. Cari baris pembayaran milik pesanan ini (ID 32)
            $row = DB::table('riwayat_pembayaran')->where('id_pesanan', $idPesanan)->first();

            // 2. Olah File Bukti Transfer
            if (!$request->hasFile('bukti_transfer')) {
                return response()->json(['message' => 'File bukti transfer tidak ditemukan.'], 400);
            }

            $file = $request->file('bukti_transfer');
            $namaFile = 'BUKTI-CLIENT-' . time() . '-' . \Illuminate\Support\Str::random(5) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/bukti_transfer'), $namaFile);

            // 3. LOGIKA MERGER (Gabungkan ke baris yang sudah ada)
            if ($row) {
                // Bongkar riwayat lama dari JSON
                $history = json_decode($row->catatan_pembayaran, true) ?: [];

                // Tambahkan baris cicilan baru dari pelanggan
                $history[] = [
                    'type'           => $request->tipe_keterangan ?: 'Cicil',
                    'amount'         => $nominalBaru,
                    'date'           => $request->tgl_bayar ?: date('Y-m-d'),
                    'notes'          => 'Input mandiri oleh pelanggan via Portal.',
                    'paymentStatus'  => 'Pending', // Agar Admin harus Verifikasi lagi
                    'bukti_transfer' => $namaFile
                ];

                // Update baris yang sama
                DB::table('riwayat_pembayaran')->where('id_pesanan', $idPesanan)->update([
                    'nominal'            => $row->nominal + $nominalBaru, // Akumulasi nominal
                    'catatan_pembayaran' => json_encode($history),
                    'status_pembayaran'  => 'Pending', // Nyalakan notif "PERLU ACC" di Admin
                    'updated_at'         => now()
                ]);
            } else {
                // Jika benar-benar belum ada data pembayaran sama sekali (Baris baru)
                $newHistory = [[
                    'type' => 'DP',
                    'amount' => $nominalBaru,
                    'date' => $request->tgl_bayar ?: date('Y-m-d'),
                    'notes' => 'Input mandiri pelanggan',
                    'paymentStatus' => 'Pending',
                    'bukti_transfer' => $namaFile
                ]];

                DB::table('riwayat_pembayaran')->insert([
                    'id_pesanan'         => $idPesanan,
                    'nominal'            => $nominalBaru,
                    'tgl_bayar'          => now(),
                    'tipe_keterangan'    => 'DP',
                    'bukti_transfer'     => $namaFile,
                    'status_pembayaran'  => 'Pending',
                    'catatan_pembayaran' => json_encode($newHistory),
                    'created_at'         => now(),
                    'updated_at'         => now()
                ]);
            }

            return response()->json(['message' => 'Bukti pembayaran berhasil diunggah!'], 200);
        } catch (\Exception $e) {
            // Jika ada error (DB mati, file error, dll) kirim pesan ke React
            return response()->json(['message' => 'Gagal sistem: ' . $e->getMessage()], 500);
        }
    }
}
