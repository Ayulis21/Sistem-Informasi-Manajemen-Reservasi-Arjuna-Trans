<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PesananController extends Controller
{
    /**
     * 1. MENARIK DATA PESANAN UTAMA (0 ERROR)
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

    /**
     * 2. TAMBAH DATA BARU (SANGGUP MENAMPUNG MULTI-CICILAN)
     */
    public function store(Request $request)
    {
        $request->validate([
            'customerName'  => 'required|string|max:255',
            'destination'   => 'required|string|max:255',
            'departureDate' => 'required',
            'totalPrice'    => 'required|numeric|min:0',
            'whatsapp'      => 'nullable|string|max:15',
        ]);

        $idPesananUnik = 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(5));

        DB::transaction(function () use ($request, $idPesananUnik) {
            $fleetInput = $request->fleetRequirements;
            $fleet = [];

            if (is_string($fleetInput)) {
                $decoded = json_decode($fleetInput, true);
                $fleet = is_array($decoded) ? $decoded : [];
            } else if (is_array($fleetInput)) {
                $fleet = $fleetInput;
            }

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

            $paymentsInput = $request->paymentsData;
            $paymentsArray = is_string($paymentsInput) ? json_decode($paymentsInput, true) : ($paymentsInput ?? []);
            if (!is_array($paymentsArray)) {
                $paymentsArray = [];
            }

            // 🎯 KUNCI SAKRAL PROTEKSI 1: Menjamin tidak ada data kosong / crash saat berhitung
            $totalPaidCalculated = 0;
            foreach ($paymentsArray as $index => $p) {
                if (is_array($p)) {
                    $totalPaidCalculated += floatval($p['amount'] ?? 0);

                    if ($request->hasFile("evidenceFile_{$index}")) {
                        $fileCicilan = $request->file("evidenceFile_{$index}");
                        $namaFotoCicilan = 'BUKTI-' . time() . '-' . Str::random(5) . '.' . $fileCicilan->getClientOriginalExtension();
                        $fileCicilan->move(public_path('uploads/bukti_transfer'), $namaFotoCicilan);
                        $paymentsArray[$index]['bukti_transfer'] = $namaFotoCicilan;
                    }
                }
            }

            if ($totalPaidCalculated > 0) {
                foreach ($paymentsArray as $index => $p) {
                    if (is_array($p)) {
                        // Menghapus paksa properti biner evidenceFile agar tidak membengkak di database MySQL
                        unset($paymentsArray[$index]['evidenceFile']);
                    }
                }

                // Sekarang array payments dijamin ringan, bersih, polos, dan langsung lolos masuk MySQL!
                $stringPembayaranJson = json_encode($paymentsArray);

                $tipeTerakhir = 'DP';
                if (count($paymentsArray) > 0) {
                    $barisAkhir = end($paymentsArray);
                    $tipeMentah = is_array($barisAkhir) ? ($barisAkhir['type'] ?? 'DP') : 'DP';
                    $tipeTerakhir = ($tipeMentah === 'Cicilan' || $tipeMentah === 'Cicil') ? 'Cicil' : $tipeMentah;
                }

                DB::table('riwayat_pembayaran')->insert([
                    'id_pesanan'         => $idPesananUnik,
                    'nominal'            => $totalPaidCalculated,
                    'tgl_bayar'          => now(),
                    'tipe_keterangan'    => substr($tipeTerakhir, 0, 20),
                    'bukti_transfer'     => 'bukti_default.jpg',
                    'status_pembayaran'  => 'Pending',
                    'catatan_pembayaran' => $stringPembayaranJson,
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ]);
            }
        });

        return response()->json(['message' => 'Reservasi pesanan dan berkas pembayaran awal berhasil disimpan ke sistem Arjuna Trans!']);
    }

    /**
     * 3. FUNGSI SIMPAN EDIT DATA LAMA (ANTI-ERROR 500 INTERNAL SERVER)
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
            $fleetInput = $request->fleetRequirements;
            $fleetData = [];
            if (is_string($fleetInput)) {
                $fleetData = json_decode($fleetInput, true) ?? [];
            } else if (is_array($fleetInput)) {
                $fleetData = $fleetInput;
            }
            $fleet = is_array($fleetData) ? $fleetData : [];

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

            $paymentsInput = $request->paymentsData;
            $paymentsArray = is_string($paymentsInput) ? json_decode($paymentsInput, true) : ($paymentsInput ?? []);
            if (!is_array($paymentsArray)) {
                $paymentsArray = [];
            }

            $totalPaidCalculated = 0;
            foreach ($paymentsArray as $index => $p) {
                if (is_array($p)) {
                    $totalPaidCalculated += floatval($p['amount'] ?? 0);

                    // Proses pemindahan file fisik gambar struk cicilan ke folder publik Anda
                    if ($request->hasFile("evidenceFile_{$index}")) {
                        $fileCicilan = $request->file("evidenceFile_{$index}");
                        $namaFotoCicilan = 'BUKTI-' . time() . '-' . Str::random(5) . '.' . $fileCicilan->getClientOriginalExtension();
                        $fileCicilan->move(public_path('uploads/bukti_transfer'), $namaFotoCicilan);

                        // Kunci teks nama filenya ke dalam array
                        $paymentsArray[$index]['bukti_transfer'] = $namaFotoCicilan;
                    }

                    // 🎯 KUNCI SAKRAL PENYEMBUHAN: Wajib membuang objek biner mentah pengganggu dari baris array!
                    unset($paymentsArray[$index]['evidenceFile']);
                }
            }

            // Sekarang teks JSON dijamin super ringan, bersih, polos, dan murni hanya berisi string teks pendek!
            $stringPembayaranJson = json_encode($paymentsArray);

            $tipeTerakhir = 'DP';
            if (count($paymentsArray) > 0) {
                $barisAkhir = end($paymentsArray);
                $tipeMentah = is_array($barisAkhir) ? ($barisAkhir['type'] ?? 'DP') : 'DP';
                $tipeTerakhir = ($tipeMentah === 'Cicilan' || $tipeMentah === 'Cicil') ? 'Cicil' : $tipeMentah;
            }
            $pembayaranAda = DB::table('riwayat_pembayaran')->where('id_pesanan', $id)->exists();
            if ($pembayaranAda) {
                DB::table('riwayat_pembayaran')
                    ->where('id_pesanan', $id)
                    ->update([
                        'nominal'            => $totalPaidCalculated,
                        'tipe_keterangan'    => substr($tipeTerakhir, 0, 20),
                        'catatan_pembayaran' => $stringPembayaranJson,
                        'updated_at'         => now(),
                    ]);
            } else if ($totalPaidCalculated > 0) {
                DB::table('riwayat_pembayaran')->insert([
                    'id_pesanan'         => $id,
                    'nominal'            => $totalPaidCalculated,
                    'tgl_bayar'          => now(),
                    'tipe_keterangan'    => substr($tipeTerakhir, 0, 20),
                    'bukti_transfer'     => 'bukti_default.jpg',
                    'status_pembayaran'  => 'Pending',
                    'catatan_pembayaran' => $stringPembayaranJson,
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ]);
            }
        });

        return response()->json(['message' => 'Detail data pesanan dan riwayat pembayaran berhasil diperbarui secara permanen!']);
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
