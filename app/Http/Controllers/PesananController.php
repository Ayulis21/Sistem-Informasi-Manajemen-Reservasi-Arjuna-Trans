<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PesananController extends Controller
{
    /**
     * Menarik data pesanan lengkap beserta penjumlahan total uang yang sudah masuk dari database
     */
    public function index()
    {
        // REVISI SAKRAL INDEX: Menarik kolom bukti_transfer dan status_pembayaran secara riil dari tabel sebelah!
        $pesanan = DB::table('pesanan')
            ->select(
                'pesanan.*',
                DB::raw('(SELECT SUM(nominal) FROM riwayat_pembayaran WHERE riwayat_pembayaran.id_pesanan = pesanan.id_pesanan) as total_terbayar'),
                DB::raw('(SELECT bukti_transfer FROM riwayat_pembayaran WHERE riwayat_pembayaran.id_pesanan = pesanan.id_pesanan LIMIT 1) as bukti_transfer'),
                DB::raw('(SELECT status_pembayaran FROM riwayat_pembayaran WHERE riwayat_pembayaran.id_pesanan = pesanan.id_pesanan LIMIT 1) as status_pembayaran'),
                DB::raw('(SELECT catatan_pembayaran FROM riwayat_pembayaran WHERE riwayat_pembayaran.id_pesanan = pesanan.id_pesanan LIMIT 1) as catatan_pembayaran'),
                DB::raw('(SELECT tipe_keterangan FROM riwayat_pembayaran WHERE riwayat_pembayaran.id_pesanan = pesanan.id_pesanan LIMIT 1) as tipe_keterangan'),
                DB::raw('(SELECT tgl_bayar FROM riwayat_pembayaran WHERE riwayat_pembayaran.id_pesanan = pesanan.id_pesanan LIMIT 1) as tgl_bayar')
            )
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($pesanan);
    }


    /**
     * =========================================================================
     * SIMPAN DATA BARU: MAINKAN RELASI DUA TABEL + FITUR UPLOAD FILE BUKTI TRANSAKSI
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
            'whatsapp'      => 'nullable|string|max:15',
        ]);

        // 2. OTOMATISASI GENERATOR ID PESANAN UNIK
        $idPesananUnik = 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(5));

        // Memulai sistem transaksi database agar jika salah satu tabel macet, data otomatis dibatalkan keseluruhan (Aman)
        DB::transaction(function () use ($request, $idPesananUnik) {

            // Mengubah string kiriman armada JSON dari frontend React menjadi array php
            $fleetInput = $request->fleetRequirements;
            $fleet = [];

            if (is_string($fleetInput)) {
                // Jika kiriman dari React berbentuk teks string JSON (Saat Tambah Baru)
                $decoded = json_decode($fleetInput, true);
                $fleet = is_array($decoded) ? ($decoded[0] ?? $decoded) : [];
            } else if (is_array($fleetInput)) {
                // Jika kiriman dari React sudah berwujud objek array asli (Saat Edit Data)
                $fleet = $fleetInput[0] ?? $fleetInput;
            }

            // 1. INJEKSI PERTAMA: MASUKKAN DATA UTAMA KE TABEL PESANAN
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
                'tipe_unit_diminta'   => $fleet['type'] ?? 'Bus',
                'jumlah_unit_diminta' => intval($fleet['qty'] ?? 1),
                'harga_sewa'          => $request->totalPrice,
                'status_pesanan'      => 'Pending', // Patuh kaku menggunakan 'Pending' sesuai enum migrasi Anda
                'lain_lain'           => $request->routeNotes ?? '-', // Mengosongkan sisa json lama dari kolom lain_lain
                'token_akses'         => Str::random(32),
                'created_at'          => now(),
                'updated_at'          => now(),
            ]);

            // 2. INJEKSI KEDUA: JIKA ADMIN MENGISI NOMINAL DP, MASUKKAN KE TABEL RIWAYAT_PEMBAYARAN
            if (floatval($request->paidAmount) > 0) {

                // Sistem pemroses file gambar struk bukti transfer fisik dari tombol ungu Anda
                $namaFotoKunci = 'bukti_default.jpg';
                if ($request->hasFile('evidenceFile')) {
                    $fileFile = $request->file('evidenceFile');
                    $namaFotoKunci = 'BUKTI-' . time() . '-' . Str::random(5) . '.' . $fileFile->getClientOriginalExtension();
                    $fileFile->move(public_path('uploads/bukti_transfer'), $namaFotoKunci); // Foto disimpan rapi di folder publik Anda
                }

                DB::table('riwayat_pembayaran')->insert([
                    'id_pesanan'         => $idPesananUnik,
                    'nominal'            => floatval($request->paidAmount),
                    'tgl_bayar'          => $request->paymentDate ? date('Y-m-d H:i:s', strtotime($request->paymentDate)) : now(),
                    'tipe_keterangan'    => $request->paymentType ?? 'DP', // DP / Cicil / Lunas sesuai enum Anda
                    'bukti_transfer'     => $namaFotoKunci,
                    'status_pembayaran'  => 'Pending',
                    'catatan_pembayaran' => $request->paymentNotes ?? 'Pembayaran Awal Sewa Bus',
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ]);
            }
        });

        return response()->json(['message' => 'Reservasi pesanan dan berkas pembayaran awal berhasil disimpan ke sistem Arjuna Trans!']);
    }

    /**
     * Memperbarui detail data transaksi di kedua tabel sekaligus (FIX EDIT GAMBAR)
     */
    public function updateFull(Request $request, string $id)
    {
        $request->validate([
            'customerName'  => 'required|string|max:255',
            'destination'   => 'required|string|max:255',
            'departureDate' => 'required',
            'totalPrice'    => 'required|numeric|min:0',
            'whatsapp'      => 'nullable|string|max:15',
        ]);

        DB::transaction(function () use ($request, $id) {

            // 1. PROSES UPLOAD FILE GAMBAR STRUK BARU JIKA ADMIN MELAKUKAN UPLOAD ULANG
            $namaFotoKunci = null;
            if ($request->hasFile('evidenceFile')) {
                $fileFile = $request->file('evidenceFile');
                $namaFotoKunci = 'BUKTI-' . time() . '-' . Str::random(5) . '.' . $fileFile->getClientOriginalExtension();
                $fileFile->move(public_path('uploads/bukti_transfer'), $namaFotoKunci);
            }

            // MENGUBAH STRING KIRIMAN ARMADA JSON KEMBALI MENJADI ARRAY PHP
            $fleetInput = $request->fleetRequirements;
            $fleetData = [];
            if (is_string($fleetInput)) {
                $fleetData = json_decode($fleetInput, true) ?? [];
            } else if (is_array($fleetInput)) {
                $fleetData = $fleetInput;
            }
            $fleet = isset($fleetData[0]) ? $fleetData[0] : $fleetData;

            // 2. KUNCI EMAS BACKEND: UPDATE BARIS DATA DI TABEL PESANAN UTAMA (TANPA BUKTI_TRANSFER!)
            DB::table('pesanan')
                ->where('id_pesanan', $id)
                ->update([
                    'nama_pemesan'        => $request->customerName,
                    'no_telp'             => $request->whatsapp,
                    'tgl_berangkat'       => date('Y-m-d H:i:s', strtotime($request->departureDate)),
                    'tgl_selesai'         => $request->returnDate ? date('Y-m-d H:i:s', strtotime($request->returnDate)) : now()->addDays(1),
                    'alamat_penjemputan'  => $request->pickup ?? '-',
                    'tujuan_main'         => $request->destination,
                    'rute'                => $request->routeNotes ?? '-',
                    'estimasi_jarak'      => intval($request->distance ?? 0),
                    'tipe_unit_diminta'   => $fleet['type'] ?? 'Bus',
                    'jumlah_unit_diminta' => intval($fleet['qty'] ?? 1),
                    'harga_sewa'          => $request->totalPrice,
                    'updated_at'          => now(),
                ]);

            // 3. MEMPERBARUI ATAU MENYUNTIKKAN DATA BARU DI TABEL RIWAYAT_PEMBAYARAN (RUMAH ASLI BUKTI_TRANSFER)
            $pembayaranAda = DB::table('riwayat_pembayaran')->where('id_pesanan', $id)->exists();

            if ($pembayaranAda) {
                $updateData = [
                    'nominal'            => floatval($request->paidAmount ?? 0),
                    'tipe_keterangan'    => $request->paymentType ?? 'DP',
                    'catatan_pembayaran' => $request->catatan_pembayaran ?? 'Pembaruan Data Keuangan',
                    'updated_at'         => now(),
                ];

                // SINKRONISASI: Nama foto baru hanya boleh dimasukkan ke dalam tabel riwayat_pembayaran!
                if ($namaFotoKunci) {
                    $updateData['bukti_transfer'] = $namaFotoKunci;
                }

                DB::table('riwayat_pembayaran')->where('id_pesanan', $id)->update($updateData);
            } else if (floatval($request->paidAmount) > 0) {
                DB::table('riwayat_pembayaran')->insert([
                    'id_pesanan'         => $id,
                    'nominal'            => floatval($request->paidAmount),
                    'tgl_bayar'          => $request->paymentDate ? date('Y-m-d H:i:s', strtotime($request->paymentDate)) : now(),
                    'tipe_keterangan'    => $request->paymentType ?? 'DP',
                    'bukti_transfer'     => $namaFotoKunci ?? 'bukti_default.jpg', // Berdiri di sini secara sah
                    'status_pembayaran'  => 'Pending',
                    'catatan_pembayaran' => $request->catatan_pembayaran ?? 'Pembayaran Awal Sewa Bus',
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ]);
            }
        });

        return response()->json(['message' => 'Detail data pesanan dan riwayat pembayaran berhasil diperbarui secara permanen!']);
    }


    /**
     * Mengubah status pesanan operasional
     */
    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status_pesanan' => 'required|string',
        ]);

        $statusDb = 'Pending';
        if (strtoupper($request->status_pesanan) === 'DISETUJUI') $statusDb = 'Disetujui';
        if (strtoupper($request->status_pesanan) === 'DIBATALKAN' || strtoupper($request->status_pesanan) === 'BATAL') $statusDb = 'Batal';
        if (strtoupper($request->status_pesanan) === 'SELESAI') $statusDb = 'Selesai';

        DB::table('pesanan')
            ->where('id_pesanan', $id)
            ->update([
                'status_pesanan' => $statusDb,
                'updated_at'     => now(),
            ]);

        return response()->json(['message' => 'Gagal memperbarui status.'], 404);
    }

    /**
     * Memproses tombol verifikasi "SESUAI" atau "TOLAK" dari admin
     */
    /**
     * Memproses tombol verifikasi "SESUAI" atau "TOLAK" dari admin
     */
    // REVISI FIX BACKEND: Menegaskan tipe data 'string $id' agar serasi dengan kode ORD-... Anda
    public function verifikasiPembayaran(Request $request, string $id)
    {
        $request->validate([
            'status_pembayaran' => 'required|in:Disetujui,Ditolak'
        ]);

        $affected = DB::table('riwayat_pembayaran')
            ->where('id_pesanan', $id)
            ->update([
                'status_pembayaran' => $request->status_pembayaran,
                'updated_at'        => now()
            ]);

        return response()->json([
            'message' => 'Validasi bukti pembayaran berhasil diperbarui menjadi ' . $request->status_pembayaran
        ]);
    }
}
