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

        // OTOMATISASI GENERATOR ID PESANAN UNIK
        $idPesananUnik = 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(5));

        // Memulai sistem transaksi database agar jika salah satu tabel macet, data otomatis dibatalkan keseluruhan (Aman)
        DB::transaction(function () use ($request, $idPesananUnik) {

            // Mengubah string kiriman armada JSON dari frontend React menjadi array php
            $fleetInput = $request->fleetRequirements;
            $fleet = [];

            if (is_string($fleetInput)) {
                $decoded = json_decode($fleetInput, true);
                $fleet = is_array($decoded) ? ($decoded[0] ?? $decoded) : [];
            } else if (is_array($fleetInput)) {
                $fleet = $fleetInput[0] ?? $fleetInput;
            }

            // INJEKSI PERTAMA: MASUKKAN DATA UTAMA KE TABEL PESANAN
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
                'status_pesanan'      => 'Pending',
                'lain_lain'           => $request->routeNotes ?? '-',
                'token_akses'         => Str::random(32),
                'created_at'          => now(),
                'updated_at'          => now(),
            ]);

            // =========================================================================
            // 2. REVISI SAKRAL SINKRONISASI BUNGKUSAN MULTI-CICILAN BARU TAMBAH (0 ERR)
            // =========================================================================
            $paymentsInput = $request->paymentsData;
            $paymentsArray = is_string($paymentsInput) ? json_decode($paymentsInput, true) : ($paymentsInput ?? []);

            // Hitung total akumulasi uang dari seluruh kolom cicilan yang ditambah admin
            $totalPaidCalculated = 0;
            foreach ($paymentsArray as $index => $p) {
                $totalPaidCalculated += floatval($p['amount'] ?? 0);
            }

            // Jika ada pengisian nominal uang, jebolkannya masuk ke riwayat_pembayaran
            if ($totalPaidCalculated > 0) {

                // Cek unggahan file fisik gambar struk pertama sebagai berkas utama jika ada
                $namaFotoKunci = 'bukti_default.jpg';
                if ($request->hasFile('evidenceFile_0')) {
                    $fileFile = $request->file('evidenceFile_0');
                    $namaFotoKunci = 'BUKTI-' . time() . '-' . Str::random(5) . '.' . $fileFile->getClientOriginalExtension();
                    $fileFile->move(public_path('uploads/bukti_transfer'), $namaFotoKunci);
                }

                // Ikat barisan objek kolom cicilan menjadi string teks JSON murni Terikat DB
                $stringPembayaranJson = json_encode($paymentsArray);

                DB::table('riwayat_pembayaran')->insert([
                    'id_pesanan'         => $idPesananUnik,
                    'nominal'            => $totalPaidCalculated, // Berisi total gabungan uang masuk
                    'tgl_bayar'          => now(),
                    'tipe_keterangan'    => $paymentsArray[0]['type'] ?? 'DP',
                    'bukti_transfer'     => $namaFotoKunci,
                    'status_pembayaran'  => 'Pending',
                    'catatan_pembayaran' => $stringPembayaranJson, // Mengunci riwayat baris cicilan secara abadi
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ]);
            }
        });

        return response()->json(['message' => 'Reservasi pesanan baru dan seluruh baris riwayat keuangan berhasil disimpan ke sistem Arjuna Trans!']);
    }

    //  Memperbarui detail data transaksi di kedua tabel sekaligus (FIX EDIT GAMBAR)
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

            // PROSES UPLOAD FOTO STRUK TRANSFER UTAMA JIKA ADA (FALBACK)
            $namaFotoKunci = null;
            if ($request->hasFile('evidenceFile')) {
                $fileFile = $request->file('evidenceFile');
                $namaFotoKunci = 'BUKTI-' . time() . '-' . Str::random(5) . '.' . $fileFile->getClientOriginalExtension();
                $fileFile->move(public_path('uploads/bukti_transfer'), $namaFotoKunci);
            }

            // DETEKSI FORMAT ARMADA FLEET REQUIREMENTS
            $fleetInput = $request->fleetRequirements;
            $fleetData = [];
            if (is_string($fleetInput)) {
                $fleetData = json_decode($fleetInput, true) ?? [];
            } else if (is_array($fleetInput)) {
                $fleetData = $fleetInput;
            }
            $fleet = isset($fleetData[0]) ? $fleetData[0] : ($fleetData ?? []);

            // UPDATE DATA UTAMA DI TABEL PESANAN
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

            // =========================================================================
            // REVISI SAKRAL UPDATEFULL: MENERIMA & MENGUNCI ARRAY GANDA MULTI-CICILAN
            // =========================================================================
            $paymentsInput = $request->paymentsData;
            $paymentsArray = is_string($paymentsInput) ? json_decode($paymentsInput, true) : ($paymentsInput ?? []);

            // Loop kalkulator pintar untuk mengakumulasikan total nominal uang masuk dari semua baris
            $totalPaidCalculated = 0;
            foreach ($paymentsArray as $index => $p) {
                $totalPaidCalculated += floatval($p['amount'] ?? 0);

                // Proses penyimpanan gambar biner untuk masing-masing baris cicilan yang di-upload baru
                if ($request->hasFile("evidenceFile_{$index}")) {
                    $fileCicilan = $request->file("evidenceFile_{$index}");
                    $namaFotoCicilan = 'BUKTI-' . time() . '-' . Str::random(5) . '.' . $fileCicilan->getClientOriginalExtension();
                    $fileCicilan->move(public_path('uploads/bukti_transfer'), $namaFotoCicilan);
                    $paymentsArray[$index]['bukti_transfer'] = $namaFotoCicilan;
                }
            }

            // Menyisipkan juga data boks jatuh tempo luar ke dalam kantong JSON terikat DB agar sinkron
            $stringPembayaranJson = json_encode([
                'riwayat' => $paymentsArray,
                'dueDate' => $request->dueDate ?? ''
            ]);

            // Ambil tipe pembayaran dari baris terakhir yang dimasukkan admin sebagai status aktif
            $tipeTerakhir = count($paymentsArray) > 0 ? ($paymentsArray[count($paymentsArray) - 1]['type'] ?? 'DP') : 'DP';

            // UPDATE ATAU INSERT DATA KE TABEL RIWAYAT_PEMBAYARAN
            $pembayaranAda = DB::table('riwayat_pembayaran')->where('id_pesanan', $id)->exists();

            if ($pembayaranAda) {
                $updateData = [
                    'nominal'            => $totalPaidCalculated, // Otomatis ter-update akumulatif!
                    'tipe_keterangan'    => $tipeTerakhir,
                    'catatan_pembayaran' => $stringPembayaranJson, // Mengunci array riil ke database MySQL
                    'updated_at'         => now(),
                ];

                if ($namaFotoKunci) {
                    $updateData['bukti_transfer'] = $namaFotoKunci;
                }

                DB::table('riwayat_pembayaran')->where('id_pesanan', $id)->update($updateData);
            } else if ($totalPaidCalculated > 0) {
                DB::table('riwayat_pembayaran')->insert([
                    'id_pesanan'         => $id,
                    'nominal'            => $totalPaidCalculated,
                    'tgl_bayar'          => now(),
                    'tipe_keterangan'    => $tipeTerakhir,
                    'bukti_transfer'     => $namaFotoKunci ?? 'bukti_default.jpg',
                    'status_pembayaran'  => 'Pending',
                    'catatan_pembayaran' => $stringPembayaranJson,
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ]);
            }
        });

        return response()->json(['message' => 'Detail data pesanan dan seluruh baris kolom cicilan keuangan berhasil diperbarui secara permanen!']);
    }

    // Memproses tombol verifikasi "SESUAI" atau "TOLAK" beserta perekaman teks alasan dari admin

    public function verifikasiPembayaran(Request $request, string $id)
    {
        $request->validate([
            'status_pembayaran'  => 'required|in:Disetujui,Ditolak',
            'catatan_pembayaran' => 'required|string|max:255' // ← VALIDASI KOLOM CATATAN BARU ANDA
        ]);

        // KUNCI SAKRAL BACKEND: Menyimpan pembaruan status beserta alasan penolakan secara serentak ke MySQL
        $affected = DB::table('riwayat_pembayaran')
            ->where('id_pesanan', $id)
            ->update([
                'status_pembayaran'  => $request->status_pembayaran,
                'catatan_pembayaran' => $request->catatan_pembayaran, // Mengunci ketikan alasan admin ke database
                'updated_at'         => now()
            ]);

        return response()->json([
            'message' => 'Validasi bukti pembayaran berhasil diperbarui menjadi ' . $request->status_pembayaran
        ]);
    }

    public function updateStatus(Request $request, string $id)
    {
        // 1. Validasi isi status yang dikirim dari React
        $request->validate([
            'status_pesanan' => 'required|string|in:Pending,Disetujui,Terjadwal,Selesai,Batal'
        ]);

        // 2. KUNCI BACKEND: Perbarui kolom status_pesanan di database MySQL secara riil
        $affected = DB::table('pesanan')
            ->where('id_pesanan', $id)
            ->update([
                'status_pesanan' => $request->status_pesanan,
                'updated_at'     => now()
            ]);

        // 3. Kembalikan respons sukses ke halaman depan React
        return response()->json([
            'message' => 'Status operasional reservasi bus berhasil diperbarui menjadi ' . $request->status_pembayaran
        ]);
    }
}
