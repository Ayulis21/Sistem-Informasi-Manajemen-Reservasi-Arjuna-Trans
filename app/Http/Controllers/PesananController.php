<?php

namespace App\Http\Controllers;

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
                // 🎯 INI KUNCINYA: Laravel harus menarik data dari tabel detail!
                $order->fleetRequirements = DB::table('pesanan_detail_armada')
                    ->where('id_pesanan', $order->id_pesanan)
                    ->get()
                    ->map(function ($item) {
                        // Cari nama tipenya dari tabel armada
                        $armada = DB::table('armada')->where('tipe_armada', $item->tipe_armada)->first();
                        return [
                            'armada_id'   => $armada ? $armada->id_armada : "",
                            'tipe_armada' => $item->tipe_armada,
                            'qty'         => (int)$item->qty
                        ];
                    });
                return $order;
            });


        return response()->json($pesanan);
    }

    /**
     * MENYIMPAN TRANSAKSI PESANAN BARU DARI FORMDATA BINER (0 ERR)
     */
    public function store(Request $request)
    {
        // 🚀 FIX MUTLAK 1: Mengurai data array fleetRequirements yang dikirim dalam wujud JSON string biner
        $fleetInput = $request->input('fleetRequirements');
        $fleetData = [];
        if (is_string($fleetInput)) {
            $fleetData = json_decode($fleetInput, true) ?? [];
        } else if (is_array($fleetInput)) {
            $fleetData = $fleetInput;
        }
        $fleet = is_array($fleetData) ? $fleetData : [];

        // Membuat ID Pesanan acak yang unik otomatis jika tidak dikirim dari frontend
        $idPesananUnik = 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(5));

        DB::transaction(function () use ($request, $idPesananUnik, $fleet) {
            // Baris 79
            DB::table('pesanan')->insert([
                'id_pesanan'         => $idPesananUnik,
                'nama_pemesan'       => $request->input('customerName') ?: $request->input('nama_pemesan'),
                'alamat'             => $request->input('alamat') ?: $request->input('customerAddress') ?: '-',
                'no_telp'            => $request->input('whatsapp') ?: $request->input('no_telp'),
                'tgl_berangkat'      => $request->input('departureDate')
                    ? date('Y-m-d H:i:s', strtotime($request->input('departureDate')))
                    : now(),
                'tgl_selesai'        => $request->input('returnDate')
                    ? date('Y-m-d H:i:s', strtotime($request->input('returnDate')))
                    : now()->addDay(),
                'alamat_penjemputan' => $request->input('pickup') ?: '-',
                'tujuan_main'        => $request->input('destination') ?: '-',
                'rute'               => $request->input('routeNotes') ?: '-',
                'estimasi_jarak'     => intval($request->input('distance') ?: 0),
                'harga_sewa'         => floatval($request->input('totalPrice') ?: 0),
                'jatuh_tempo'        => $request->input('dueDate'),
                'status_pesanan'     => 'Pending',
                'lain_lain'          => $request->input('lain_lain') ?: '-',
                'token_akses'        => Str::random(32),
                'created_at'         => now(),
                'updated_at'         => now(),
            ]);

            // 🚀 FIX MUTLAK 3: Melakukan insert bersih ke tabel anak pesanan_detail_armada berdasarkan id_armada master
            foreach ($fleet as $item) {
                if (empty($item['armada_id'])) {
                    continue;
                }

                $targetIdArmada = is_array($item['armada_id']) ? ($item['armada_id']['id_armada'] ?? null) : $item['armada_id'];

                $armada = DB::table('armada')
                    ->where('id_armada', $targetIdArmada)
                    ->first();

                if ($armada) {
                    DB::table('pesanan_detail_armada')->insert([
                        'id_pesanan' => $idPesananUnik,
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
                // 🚀 KUNCI SAKRAL: Panggil secara eksplisit agar kolom jatuh_tempo dipaksa ikut keluar ke JSON!
                'pesanan.jatuh_tempo as jatuh_tempo',
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
                // 🚀 KUNCI SAKRAL: Menarik data dari tabel anak yang terbukti sukses menyimpan data Anda!
                $detailArmada = DB::table('pesanan_detail_armada')
                    ->where('id_pesanan', $order->id_pesanan)
                    ->get();

                $order->fleetRequirements = $detailArmada->map(function ($item) {
                    $masterArmada = DB::table('armada')
                        ->where('tipe_armada', $item->tipe_armada)
                        ->first();

                    return [
                        'armada_id'   => $masterArmada ? $masterArmada->id_armada : "",
                        'tipe_armada' => $item->tipe_armada, // 🎯 WAJIB ADA agar React tidak bingung
                        'qty'         => (int)$item->qty
                    ];
                });

                return $order;
            });

        return response()->json($pesanan);
    }


    /**
     * 3. FUNGSI SIMPAN EDIT DATA LAMA (ANTI-ERROR 500 INTERNAL SERVER)
     */
    public function updateFull(Request $request, string $id)
    {
        // 1. Validasi Input Dasar
        $request->validate([
            'customerName' => 'required|string|max:255',
            'totalPrice'   => 'required|numeric',
            'departureDate' => 'required',
        ]);

        DB::transaction(function () use ($request, $id) {
            // 2. Update Tabel Utama Pesanan
            DB::table('pesanan')
                ->where('id_pesanan', $id)
                ->update([
                    'nama_pemesan'       => $request->customerName,
                    'alamat'             => $request->alamat ?: '-',
                    'no_telp'            => $request->whatsapp ?: '-',
                    'tgl_berangkat'      => date('Y-m-d H:i:s', strtotime($request->departureDate)),
                    'tgl_selesai'        => $request->returnDate ? date('Y-m-d H:i:s', strtotime($request->returnDate)) : now(),
                    'alamat_penjemputan' => $request->pickup ?: '-',
                    'tujuan_main'        => $request->destination ?: '-',
                    'rute'               => $request->routeNotes ?: '-',
                    'estimasi_jarak'     => intval($request->distance ?: 0),
                    'harga_sewa'         => floatval($request->totalPrice ?: 0),
                    'jatuh_tempo'        => $request->dueDate,
                    'lain_lain'          => $request->lain_lain ?: '-',
                    'updated_at'         => now(),
                ]);

            // 3. Update Detail Armada (Hapus lalu isi ulang)
            $fleetInput = $request->fleetRequirements;
            $fleet = is_string($fleetInput) ? json_decode($fleetInput, true) : ($fleetInput ?? []);
            DB::table('pesanan_detail_armada')->where('id_pesanan', $id)->delete();

            foreach ($fleet as $item) {
                if (!empty($item['armada_id'])) {
                    $armada = DB::table('armada')->where('id_armada', $item['armada_id'])->first();
                    if ($armada) {
                        DB::table('pesanan_detail_armada')->insert([
                            'id_pesanan' => $id,
                            'tipe_armada' => $armada->tipe_armada,
                            'qty' => $item['qty'] ?? 1,
                            'created_at' => now(),
                            'updated_at' => now()
                        ]);
                    }
                }
            }

            // 4. Update Riwayat Pembayaran (JSON dan Tabel Riwayat)
            // 4. Update Riwayat Pembayaran (JSON dan Tabel Riwayat)
            $paymentsInput = $request->paymentsData;
            $paymentsArray = is_string($paymentsInput) ? json_decode($paymentsInput, true) : ($paymentsInput ?? []);

            $totalPaidCalculated = 0;
            $tipeTerakhir = 'DP';
            $statusTerakhir = 'Pending'; // Default awal

            foreach ($paymentsArray as $index => $p) {
                $totalPaidCalculated += floatval($p['amount'] ?? 0);
                $tipeTerakhir = $p['type'] ?? 'DP';

                // 🎯 KUNCI FIX 1: Ambil status dari baris pembayaran (Disetujui/Pending)
                // Kita ambil status yang paling update dari array
                $statusTerakhir = $p['paymentStatus'] ?? 'Pending';

                if ($request->hasFile("evidenceFile_{$index}")) {
                    $file = $request->file("evidenceFile_{$index}");
                    $namaFoto = 'BUKTI-' . time() . '-' . \Illuminate\Support\Str::random(5) . '.' . $file->getClientOriginalExtension();
                    $file->move(public_path('uploads/bukti_transfer'), $namaFoto);
                    $paymentsArray[$index]['bukti_transfer'] = $namaFoto;
                }
            }

            // Simpan JSON yang sudah bersih
            $stringPembayaranJson = json_encode($paymentsArray);

            // 🎯 KUNCI FIX 2: Update kolom fisik status_pembayaran dan nominal
            DB::table('riwayat_pembayaran')->updateOrInsert(
                ['id_pesanan' => $id],
                [
                    'nominal'            => $totalPaidCalculated, // Pastikan nominal masuk (Biar gak 0.00)
                    'status_pembayaran'  => $statusTerakhir,     // UPDATE STATUS NYATA (Biar Dashboard jadi 0)
                    'tgl_bayar'          => now(),
                    'tipe_keterangan'    => in_array($tipeTerakhir, ['DP', 'Cicil', 'Lunas']) ? $tipeTerakhir : 'DP',
                    'catatan_pembayaran' => $stringPembayaranJson,
                    'updated_at'         => now(),
                ]
            );
        });

        return response()->json(['status' => 'success', 'message' => 'Detail data pesanan dan riwayat pembayaran berhasil diperbarui secara permanen!']);
    }

    // Memproses tombol verifikasi "SESUAI" atau "TOLAK" beserta perekaman teks alasan dari admin
    public function verifikasiPembayaran(Request $request, string $id)
    {
        $request->validate([
            'status_pembayaran'  => 'required|in:Disetujui,Ditolak',
            'catatan_pembayaran' => 'required|string|max:255'
        ]);

        // 🎯 KUNCI FIX: Ganti 'id_pesanan' menjadi 'id_pembayaran'
        // Karena $id yang dikirim dari tombol di tabel adalah ID Baris Pembayaran
        $affected = DB::table('riwayat_pembayaran')
            ->where('id_pembayaran', $id)
            ->update([
                'status_pembayaran'  => $request->status_pembayaran,
                'catatan_pembayaran' => $request->catatan_pembayaran,
                'updated_at'         => now()
            ]);

        return response()->json([
            'message' => 'Validasi berhasil diperbarui menjadi ' . $request->status_pembayaran,
            'debug_id' => $id // Opsional: buat nge-cek ID mana yang diproses
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

    public function storePublic(Request $request)
    {
        // 1. Validasi Input Pelanggan
        $request->validate([
            'name' => 'required|string|max:255',
            'whatsapp' => 'required',
            'destination' => 'required',
            'departDate' => 'required|date',
            'returnDate' => 'required|date',
        ]);

        // 2. Buat ID Pesanan Unik
        $idPesanan = 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(5));

        // 3. Simpan ke Database
        DB::table('pesanan')->insert([
            'id_pesanan' => $idPesanan,
            'nama_pemesan' => $request->name,
            'alamat' => $request->address ?: '-',
            'no_telp' => $request->whatsapp,
            'tgl_berangkat' => str_replace('T', ' ', $request->departDate),
            'tgl_selesai'   => str_replace('T', ' ', $request->returnDate),
            'alamat_penjemputan' => $request->pickup ?: '-',
            'tujuan_main' => $request->destination,
            'rute' => $request->routeNotes ?: '-',
            'estimasi_jarak' => 0, // Admin yang isi nanti
            'harga_sewa' => 0,      // Admin yang isi nanti
            'status_pesanan' => 'Pending', // Default masuk ke antrean Baru
            'token_akses' => \Illuminate\Support\Str::random(32),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 4. Redirect ke halaman sukses
        return redirect()->route('booking.success', ['id' => $idPesanan]);
    }
}
