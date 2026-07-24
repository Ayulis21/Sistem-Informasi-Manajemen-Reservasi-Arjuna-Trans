<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PesananController extends Controller
{
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
            ->get()
            ->map(function ($order) {
                $order->fleetRequirements = DB::table('pesanan_detail_armada')
                    ->where('id_pesanan', $order->id_pesanan)
                    ->get()
                    ->map(function ($item) {
                        // Cari master armada berdasarkan tipe untuk mendapatkan kapasitasnya
                        $master = DB::table('armada')
                            ->where('tipe_armada', $item->tipe_armada)
                            ->first();

                        return [
                            // GUNAKAN tipe_armada sebagai identitas utama, bukan ID
                            'armada_id' => $item->tipe_armada,
                            'tipe_armada' => $item->tipe_armada,
                            'qty' => (int)$item->qty,
                            'kapasitas' => $master ? $master->kapasitas : 0
                        ];
                    });
                return $order;
            });


        return response()->json($pesanan);
    }

    public function store(Request $request)
    {
        $fleetInput = $request->input('fleetRequirements');
        $fleet = is_string($fleetInput) ? json_decode($fleetInput, true) : ($fleetInput ?? []);
        $idPesananUnik = 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(5));

        DB::transaction(function () use ($request, $idPesananUnik, $fleet) {
            DB::table('pesanan')->insert([
                'id_pesanan'         => $idPesananUnik,
                'nama_pemesan'       => $request->input('customerName') ?: $request->input('nama_pemesan'),
                'alamat'             => $request->input('customerAddress') ?: ($request->input('alamat') ?: '-'),
                'no_telp'            => $request->input('whatsapp') ?: $request->input('no_telp'),
                'tgl_berangkat'      => $request->input('departureDate') ? date('Y-m-d H:i:s', strtotime($request->input('departureDate'))) : now(),
                'tgl_selesai'        => $request->input('returnDate') ? date('Y-m-d H:i:s', strtotime($request->input('returnDate'))) : now()->addDay(),
                'alamat_penjemputan' => $request->input('pickup') ?: '-',
                'tujuan_main'        => $request->input('destination') ?: '-',
                'rute'               => $request->input('routeNotes') ?: '-',
                'estimasi_jarak'     => intval($request->input('distance') ?: 0),
                'harga_sewa'         => floatval($request->input('totalPrice') ?: 0),
                'status_pesanan'     => 'Pending',
                'lain_lain'          => $request->input('lain_lain') ?: '-',
                'token_akses'        => Str::random(32),
                'created_at'         => now(),
                'updated_at'         => now(),
            ]);

            foreach ($fleet as $item) {
                $val = $item['armada_id'] ?? ($item['tipe_armada'] ?? null);
                if (empty($val)) continue;

                $armada = DB::table('armada')
                    ->where('id_armada', $val)
                    ->orWhere('tipe_armada', $val)
                    ->first();

                if ($armada) {
                    DB::table('pesanan_detail_armada')->insert([
                        'id_pesanan'  => $idPesananUnik,
                        'tipe_armada' => $armada->tipe_armada,
                        'qty'         => intval($item['qty'] ?? 1),
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                }
            }
        });

        return response()->json(['status' => 'success', 'message' => 'Pesanan berhasil disimpan']);
    }

    /**
     * ENDPOINT API BARU: MENYEDIAKAN DATA JSON UNTUK EDIT FORM (0 ERR)
     */
    public function getPesananData()
    {
        $pesanan = DB::table('pesanan')
            ->select(
                'pesanan.*',
                'pesanan.jatuh_tempo as jatuh_tempo',
                // Kita ambil data pembayaran (Baris tunggal per pesanan)
                DB::raw('(SELECT catatan_pembayaran FROM riwayat_pembayaran WHERE riwayat_pembayaran.id_pesanan = pesanan.id_pesanan LIMIT 1) as catatan_pembayaran_raw'),
                DB::raw('(SELECT status_pembayaran FROM riwayat_pembayaran WHERE riwayat_pembayaran.id_pesanan = pesanan.id_pesanan LIMIT 1) as status_pembayaran'),
                DB::raw('(SELECT tgl_bayar FROM riwayat_pembayaran WHERE riwayat_pembayaran.id_pesanan = pesanan.id_pesanan LIMIT 1) as tgl_bayar')
            )
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                // 1. OLAH DATA PEMBAYARAN (Bongkar JSON)
                $order->payments = [];
                $totalTerbayarValid = 0;

                if ($order->catatan_pembayaran_raw) {
                    $decoded = json_decode($order->catatan_pembayaran_raw, true);
                    if (is_array($decoded)) {
                        $order->payments = $decoded;

                        foreach ($decoded as $pay) {
                            if (($pay['paymentStatus'] ?? '') === 'Disetujui') {
                                $totalTerbayarValid += floatval($pay['amount'] ?? 0);
                            }
                        }
                    }
                }

                // Masukkan hasil hitungan ke property untuk dibaca List Admin
                $order->total_terbayar = $totalTerbayarValid;
                $order->catatan_pembayaran = $order->catatan_pembayaran_raw; // Backup teks mentah

                // 2. OLAH DETAIL ARMADA (Sesuai kode asli Mas)
                // $detailArmada = DB::table('pesanan_detail_armada')
                //     ->where('id_pesanan', $order->id_pesanan)
                //     ->get();

                $order->fleetRequirements = DB::table('pesanan_detail_armada')
                    ->where('id_pesanan', $order->id_pesanan)
                    ->get()
                    ->map(function ($item) {
                        // Cari master armada berdasarkan tipe untuk mendapatkan kapasitasnya
                        $master = DB::table('armada')
                            ->where('tipe_armada', $item->tipe_armada)
                            ->first();

                        return [
                            // GUNAKAN tipe_armada sebagai identitas utama, bukan ID
                            'armada_id' => $item->tipe_armada,
                            'tipe_armada' => $item->tipe_armada,
                            'qty' => (int)$item->qty,
                            'kapasitas' => $master ? $master->kapasitas : 0
                        ];
                    });

                $order->assignments = DB::table('penugasan')
                    ->where('id_pesanan', $order->id_pesanan)
                    ->select('id_armada as armadaId', 'jenis_aset as assetType', 'plat_mitra as platLuar')
                    ->get();

                return $order;
            });

        return response()->json($pesanan);
    }


    /**
     * 3. FUNGSI SIMPAN EDIT DATA LAMA (ANTI-ERROR 500 INTERNAL SERVER)
     */
    public function updateFull(Request $request, string $id)
    {
        // 1. Validasi Input (Pastikan minimal ada nama pelanggan)
        $request->validate([
            'customerName' => 'required|string',
        ], [
            'customerName.required' => 'Nama pelanggan tidak boleh kosong',
        ]);

        try {
            DB::transaction(function () use ($request, $id) {

                // --- A. PEMBERSIHAN DATA NOMINAL (SANGAT RAWAN ERROR) ---
                // Kita ambil dari 'totalPrice' atau 'harga_sewa'
                $rawPrice = $request->input('totalPrice') ?? $request->input('harga_sewa') ?? 0;
                $cleanPrice = preg_replace('/[^0-9]/', '', (string)$rawPrice);

                $rawDistance = $request->input('distance') ?? $request->input('estimasi_jarak') ?? 0;
                $cleanDistance = preg_replace('/[^0-9]/', '', (string)$rawDistance);

                // --- B. FORMAT TANGGAL ---
                $tglBerangkat = $request->departureDate ? date('Y-m-d H:i:s', strtotime($request->departureDate)) : now();
                $tglSelesai = $request->returnDate ? date('Y-m-d H:i:s', strtotime($request->returnDate)) : now();

                // --- C. UPDATE TABEL PESANAN (PASTIKAN TIDAK ADA NULL PADA KOLOM NOT NULL) ---
                DB::table('pesanan')
                    ->where('id_pesanan', $id)
                    ->update([
                        'nama_pemesan'       => $request->customerName,
                        'alamat'             => $request->customerAddress ?: ($request->alamat ?: '-'),
                        'no_telp'            => $request->whatsapp ?: ($request->no_telp ?: '-'),
                        'tgl_berangkat'      => $tglBerangkat,
                        'tgl_selesai'        => $tglSelesai,
                        'alamat_penjemputan' => $request->pickup ?: ($request->pickupAddress ?: '-'),
                        'tujuan_main'        => $request->destination ?: '-',
                        'rute'               => $request->routeNotes ?: '-',
                        'estimasi_jarak'     => (int)$cleanDistance,
                        'harga_sewa'         => (float)$cleanPrice,
                        'jatuh_tempo'        => $request->dueDate ?: $request->jatuh_tempo,
                        'lain_lain'          => $request->lain_lain ?: '-',
                        'updated_at'         => now(),
                    ]);

                // --- D. UPDATE DETAIL ARMADA ---
                $fleetInput = $request->input('fleetRequirements');
                $fleet = is_string($fleetInput) ? json_decode($fleetInput, true) : $fleetInput;

                // Bersihkan data lama
                DB::table('pesanan_detail_armada')->where('id_pesanan', $id)->delete();

                if (is_array($fleet)) {
                    foreach ($fleet as $item) {
                        $val = $item['armada_id'] ?? ($item['tipe_armada'] ?? null);
                        if (!$val) continue;

                        $m = DB::table('armada')
                            ->where('id_armada', $val)
                            ->orWhere('tipe_armada', $val)
                            ->first();

                        if ($m) {
                            DB::table('pesanan_detail_armada')->insert([
                                'id_pesanan'  => $id,
                                'tipe_armada' => $m->tipe_armada,
                                'qty'         => (int)($item['qty'] ?? 1),
                                'created_at'  => now(),
                                'updated_at'  => now()
                            ]);
                        }
                    }
                }

                // --- E. UPDATE PEMBAYARAN (JSON & FISIK) ---
                if ($request->has('paymentsData')) {
                    $payInput = $request->input('paymentsData');
                    $payments = is_string($payInput) ? json_decode($payInput, true) : $payInput;

                    if (is_array($payments) && count($payments) > 0) {
                        $totalLunas = 0;
                        $adaPembayaranNyata = false;

                        foreach ($payments as $p) {
                            $amt = (float)($p['amount'] ?? 0);
                            if (($p['paymentStatus'] ?? '') === 'Disetujui') {
                                $totalLunas += $amt;
                            }
                            // Cek apakah admin sebenarnya menginputkan sesuatu (bukan sekadar baris kosong)
                            if ($amt > 0) {
                                $adaPembayaranNyata = true;
                            }
                        }

                        // HANYA simpan ke database jika ada nominal > 0 atau data memang sudah ada sebelumnya
                        // Ini mencegah munculnya baris "RP 0 Pending" di halaman pelanggan
                        if ($adaPembayaranNyata || DB::table('riwayat_pembayaran')->where('id_pesanan', $id)->exists()) {

                            $latestPayment = end($payments);
                            $statusTerakhir = $latestPayment['paymentStatus'] ?? 'Pending';
                            $tglTerakhir = !empty($latestPayment['date']) ? $latestPayment['date'] : now();
                            $tipeTerakhir = !empty($latestPayment['type']) ? $latestPayment['type'] : 'DP';
                            $buktiTerakhir = !empty($latestPayment['bukti_transfer']) ? $latestPayment['bukti_transfer'] : 'bukti_default.jpg';

                            DB::table('riwayat_pembayaran')->updateOrInsert(
                                ['id_pesanan' => $id],
                                [
                                    'nominal'            => $totalLunas,
                                    'status_pembayaran'  => $statusTerakhir,
                                    'catatan_pembayaran' => json_encode($payments),
                                    'tgl_bayar'          => $tglTerakhir,
                                    'tipe_keterangan'    => $tipeTerakhir,
                                    'bukti_transfer'     => $buktiTerakhir,
                                    'updated_at'         => now()
                                ]
                            );
                        }
                    }
                }
            });

            return response()->json(['status' => 'success', 'message' => 'Pesanan berhasil diperbarui']);
        } catch (\Exception $e) {
            // Balikkan detail error agar kita bisa baca di Inspect Element
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage(),
                'debug' => $e->getTrace()[0] // Menunjukkan baris mana yang error
            ], 500);
        }
    }

    // app/Http/Controllers/PesananController.php

    public function verifikasiPembayaran(Request $request, string $id)
    {
        $request->validate([
            'status_pembayaran' => 'required|in:Disetujui,Ditolak',
            'catatan_pembayaran' => 'required|string|max:255' // Ini alasan admin
        ]);

        // Cari baris pembayaran (ID 35)
        $row = DB::table('riwayat_pembayaran')->where('id_pembayaran', $id)->first();

        if (!$row) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        // 1. Bongkar JSON
        $history = json_decode($row->catatan_pembayaran, true) ?: [];

        if (count($history) > 0) {
            $lastIdx = count($history) - 1;

            // 2. Update status di DALAM JSON
            $history[$lastIdx]['paymentStatus'] = $request->status_pembayaran;

            if ($request->status_pembayaran === 'Ditolak') {
                $history[$lastIdx]['rejection_reason'] = $request->catatan_pembayaran;
            } else {
                $history[$lastIdx]['rejection_reason'] = '';
            }
        }

        // 3. Hitung ulang nominal sah (Hanya yang 'Disetujui' yang dihitung)
        $newNominalValid = collect($history)
            ->where('paymentStatus', 'Disetujui')
            ->sum('amount');

        // 4. SIMPAN KEMBALI KE DATABASE (Update kolom fisik)
        DB::table('riwayat_pembayaran')->where('id_pembayaran', $id)->update([
            // KUNCI: Pastikan kolom status_pembayaran di-update sesuai request
            'status_pembayaran'  => $request->status_pembayaran,
            'nominal'            => $newNominalValid,
            'catatan_pembayaran' => json_encode($history),
            'updated_at'         => now()
        ]);

        return response()->json(['message' => 'Status pembayaran berhasil diperbarui menjadi ' . $request->status_pembayaran]);
    }

    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status_pesanan' => 'required|string|in:Pending,Disetujui,Terjadwal,Selesai,Batal'
        ]);

        DB::table('pesanan')->where('id_pesanan', $id)->update([
            'status_pesanan' => $request->status_pesanan,
            'updated_at'     => now()
        ]);

        return response()->json([
            // PERBAIKAN: Gunakan status_pesanan, bukan status_pembayaran
            'message' => 'Status operasional berhasil diperbarui menjadi ' . $request->status_pesanan
        ]);
    }

    public function createPublic()
    {
        $masterArmada = DB::table('armada')
            ->select('tipe_armada', 'kapasitas')
            ->groupBy('tipe_armada', 'kapasitas')
            ->get();

        return Inertia::render('CustomerOrder', [
            'masterArmada' => $masterArmada
        ]);
    }

    public function showOrderForm()
    {
        $masterArmada = DB::table('armada')
            ->select('tipe_armada', 'kapasitas')
            ->groupBy('tipe_armada', 'kapasitas')
            ->get();

        // Pastikan path render-nya benar: 'CustomerComponents/CustomerOrder'
        return \Inertia\Inertia::render('CustomerComponents/CustomerOrder', [
            'masterArmada' => $masterArmada
        ]);
    }

    public function storePublic(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'name' => 'required|string|max:255',
            'whatsapp' => 'required',
            'departDate' => 'required',
            'returnDate' => 'required',
            'destination' => 'required',
            'fleetRequirements' => 'required|array|min:1', // Pastikan armada ada
        ]);

        // Gunakan Transaction agar jika salah satu gagal, semua dibatalkan (Data Aman)
        DB::transaction(function () use ($request, &$idPesanan) {

            // 2. Buat ID Pesanan Unik
            $idPesanan = 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(5));

            // 3. Simpan ke Tabel Induk (pesanan)
            DB::table('pesanan')->insert([
                'id_pesanan' => $idPesanan,
                'nama_pemesan' => $request->name,
                'alamat' => $request->address ?: '-',
                'no_telp' => $request->whatsapp,
                'tgl_berangkat' => str_replace('T', ' ', $request->departDate),
                'tgl_selesai' => str_replace('T', ' ', $request->returnDate),
                'alamat_penjemputan' => $request->pickup ?: '-',
                'tujuan_main' => $request->destination,
                'rute' => $request->routeNotes ?: '-',
                'lain_lain'          => $request->lain_lain ?: '-',
                'estimasi_jarak' => 0,
                'harga_sewa' => 0,
                'status_pesanan' => 'Pending',
                'token_akses' => Str::random(32),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 4. 🎯 KUNCI FIX: Simpan ke Tabel Anak (pesanan_detail_armada)
            // Kita looping setiap tipe bus yang dipilih pelanggan
            foreach ($request->fleetRequirements as $fleet) {
                if (!empty($fleet['type'])) {
                    DB::table('pesanan_detail_armada')->insert([
                        'id_pesanan' => $idPesanan,
                        'tipe_armada' => $fleet['type'],
                        'qty' => $fleet['qty'] ?: 1,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        });

        // 5. Redirect ke halaman sukses dengan ID asli
        return redirect()->route('booking.success', ['id' => $idPesanan]);
    }
}
