<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PesananController extends Controller
{
    /**
     * Menarik data pesanan untuk disajikan ke dalam tabel visual Orders.tsx
     */
    public function index()
    {
        $pesanan = DB::table('pesanan')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($pesanan);
    }

    /**
     * =========================================================================
     * REVISI BACKEND FINAL: SINKRON 100% SESUAI FILE MIGRASI ASLI (0 ERROR)
     * =========================================================================
     */
    public function store(Request $request)
    {
        // 1. Jalur Validasi Internal Server Laravel Mengikuti Skema Kolom Anda
        $request->validate([
            'customerName'  => 'required|string|max:255',
            'destination'   => 'required|string|max:255',
            'departureDate' => 'required',
            'totalPrice'    => 'required|numeric|min:0',
            'whatsapp'      => 'required|string|max:15',
        ]);

        // 2. OTOMATISASI GENERATOR ID PESANAN UNIK (Contoh: ORD-20260705-XXXXX)
        $idPesananUnik = 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(5));

        // 3. Eksekusi Tembak Data Lurus Masuk ke Kamar MySQL yang Tepat
        // Eksekusi Tembak Data Lurus Masuk ke Kamar MySQL yang Tepat
        DB::table('pesanan')->insert([
            'id_pesanan'          => $idPesananUnik,
            'nama_pemesan'        => $request->customerName,
            'alamat'              => $request->alamat ?? 'Garasi PO Arjuna Trans',
            'no_telp'             => $request->whatsapp,
            'tgl_berangkat'       => date('Y-m-d H:i:s', strtotime($request->departureDate)),
            'tgl_selesai'         => $request->returnDate ? date('Y-m-d H:i:s', strtotime($request->returnDate)) : now()->addDays(1),
            'alamat_penjemputan'  => $request->pickup ?? '-',
            'tujuan_main'         => $request->destination,
            'rute'                => $request->routeNotes ?? '-',
            'estimasi_jarak'      => intval($request->distance ?? 0),
            'tipe_unit_diminta'   => $request->fleetRequirements['type'] ?? 'Bus',
            'jumlah_unit_diminta' => intval($request->fleetRequirements['qty'] ?? 1),
            'harga_sewa'          => $request->totalPrice, // Menyimpan total sewa penuh (Misal: Rp 3.500.000)

            // KUNCI PINTAR KEUANGAN: Memanfaatkan kolom teks lain_lain untuk mengunci info DP dan Jatuh Tempo Anda sekaligus!
            'lain_lain'           => json_encode([
                'notes'      => $request->routeNotes ?? '-',
                'paidAmount' => floatval($request->paidAmount ?? 0), // Mengunci nominal DP Anda (Misal: Rp 1.000.000)
                'dueDate'    => $request->dueDate ?? '-'
            ]),

            'status_pesanan'      => 'Pending',
            'token_akses'         => Str::random(32),
            'created_at'          => now(),
            'updated_at'          => now(),
        ]);

        return response()->json(['message' => 'Reservasi pesanan baru berhasil didaftarkan ke sistem Arjuna Trans!']);
    }

    /**
     * Memperbarui detail data pesanan lama secara penuh di database
     */
    public function updateFull(Request $request, string $id)
    {
        $request->validate([
            'customerName'  => 'required|string|max:255',
            'destination'   => 'required|string|max:255',
            'departureDate' => 'required',
            'totalPrice'    => 'required|numeric|min:0',
        ]);

        DB::table('pesanan')
            ->where('id_pesanan', $id)
            ->update([
                'nama_pemesan'        => $request->customerName,
                'no_telp'             => $request->whatsapp,
                'tgl_berangkat'       => date('Y-m-d H:i:s', strtotime($request->departureDate)),
                'tgl_selesai'         => $request->returnDate ? date('Y-m-d H:i:s', strtotime($request->returnDate)) : now()->addDays(1),
                'alamat_penjemputan'  => $request->pickup ?? '-',
                'tujuan_main'         => $request->destination,
                'estimasi_jarak'      => intval($request->distance ?? 0),
                'harga_sewa'          => $request->totalPrice,
                'lain_lain'           => $request->routeNotes ?? '-',
                'updated_at'          => now(),
            ]);

        return response()->json(['message' => 'Detail data pesanan berhasil diperbarui secara permanen!']);
    }

    /**
     * Mengubah status pesanan operasional (Setujui / Tolak / Jalan)
     */
    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status_pesanan' => 'required|string',
        ]);

        // Menyelaraskan teks status masukan agar patuh dengan Enum kapital awal Anda
        $statusDb = 'Pending';
        if (strtoupper($request->status_pesanan) === 'DISETUJUI') $statusDb = 'Disetujui';
        if (strtoupper($request->status_pesanan) === 'DIBATALKAN' || strtoupper($request->status_pesanan) === 'BATAL') $statusDb = 'Batal';
        if (strtoupper($request->status_pesanan) === 'SELESAI') $statusDb = 'Selesai';

        $affected = DB::table('pesanan')
            ->where('id_pesanan', $id)
            ->update([
                'status_pesanan' => $statusDb,
                'updated_at'     => now(),
            ]);

        if ($affected) {
            return response()->json(['message' => 'Status transaksi pesanan berhasil diperbarui secara real-time!']);
        }

        return response()->json(['message' => 'Gagal memperbarui status.'], 404);
    }
}
