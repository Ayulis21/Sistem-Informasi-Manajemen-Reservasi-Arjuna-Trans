<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ArjunaTransSeeder extends Seeder
{
    public function run()
    {
        // 1. KOSONGKAN TABEL (Hati-hati: Menghapus data lama)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('penugasan')->truncate();
        DB::table('pesanan_detail_armada')->truncate();
        DB::table('riwayat_pembayaran')->truncate();
        DB::table('pesanan')->truncate();
        DB::table('kru')->truncate();
        DB::table('armada')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. DATA MASTER ARMADA
        $armadaIds = [];
        $tipeBus = ['Big Bus', 'Medium Bus', 'Elf', 'Mobil'];
        foreach ($tipeBus as $idx => $tipe) {
            for ($i = 1; $i <= 3; $i++) {
                $armadaIds[] = DB::table('armada')->insertGetId([
                    'nama_armada' => "Arjuna " . $tipe . " " . $i,
                    'tipe_armada' => $tipe,
                    'nopol' => "S " . rand(1000, 9999) . " U" . chr(65 + $idx),
                    'kapasitas' => ($tipe == 'Big Bus' ? 50 : ($tipe == 'Medium Bus' ? 35 : 15)),
                    'status_ketersediaan' => 'Tersedia',
                    'created_at' => now(),
                ]);
            }
        }

        // 3. DATA MASTER KRU (10 Driver, 10 Helper)
        $kruIds = [];
        $names = ['Bambang', 'Agus', 'Eko', 'Dedi', 'Roni', 'Siti', 'Budi', 'Ayu', 'Zainal', 'Randi', 'Heri', 'Toto', 'Maman', 'Yanto', 'Slamet', 'Gatot', 'Wawan', 'Dodi', 'Iwan', 'Joko'];
        foreach ($names as $idx => $name) {
            $peran = ($idx < 10) ? 'Driver' : 'Helper';
            $kruIds[] = DB::table('kru')->insertGetId([
                'nama_kru' => $name . " " . ($peran == 'Driver' ? '(Sopir)' : '(Kernet)'),
                'no_telp' => '0812' . rand(10000000, 99999999),
                'peran' => $peran,
                'status' => 'Aktif',
                'created_at' => now(),
            ]);
        }

        // 4. PESANAN MASA LALU (Untuk testing Rekomendasi KM Terendah)
        // Kita buat pesanan yang sudah "Selesai" agar kru punya riwayat jarak tempuh
        for ($i = 1; $i <= 5; $i++) {
            $idPesanan = 'ORD-PAST-00' . $i;
            $jarak = rand(200, 1000); // Jarak jauh

            DB::table('pesanan')->insert([
                'id_pesanan' => $idPesanan,
                'nama_pemesan' => "Pelanggan Lama " . $i,
                'alamat' => "Alamat Lama " . $i,
                'no_telp' => "0857" . rand(1111, 9999),
                'tgl_berangkat' => Carbon::now()->subDays(10 + $i),
                'tgl_selesai' => Carbon::now()->subDays(8 + $i),
                'alamat_penjemputan' => "Mojokerto",
                'tujuan_main' => "Bali / Jakarta",
                'rute' => "PP",
                'estimasi_jarak' => $jarak,
                'harga_sewa' => 5000000,
                'status_pesanan' => 'Selesai',
                'created_at' => now(),
            ]);

            // Plotting kru tertentu saja agar KM mereka tinggi (Bambang & Agus)
            DB::table('penugasan')->insert([
                'id_pesanan' => $idPesanan,
                'jenis_aset' => 'internal',
                'id_armada' => $armadaIds[0], // Bus 1
                'id_driver' => $kruIds[0], // Bambang (Akan punya KM tinggi)
                'id_helper' => $kruIds[10], // Heri
                'created_at' => now(),
            ]);
        }

        // 5. PESANAN SEKARANG (Untuk testing JADWAL BENTROK)
        // Pesanan yang sedang jalan hari ini
        DB::table('pesanan')->insert([
            'id_pesanan' => 'ORD-BUSY-001',
            'nama_pemesan' => "Rombongan Sedang Jalan",
            'alamat' => "Malang",
            'no_telp' => "0812333",
            'tgl_berangkat' => Carbon::now()->subHours(2),
            'tgl_selesai' => Carbon::now()->addHours(5),
            'alamat_penjemputan' => "Terminal Malang",
            'tujuan_main' => "Surabaya",
            'rute' => "Tol",
            'estimasi_jarak' => 100,
            'harga_sewa' => 2000000,
            'status_pesanan' => 'Terjadwal',
        ]);

        // Plot Eko (ID Driver 3) di pesanan yang sedang jalan ini
        DB::table('penugasan')->insert([
            'id_pesanan' => 'ORD-BUSY-001',
            'jenis_aset' => 'internal',
            'id_armada' => $armadaIds[1],
            'id_driver' => $kruIds[2], // Eko (Akan muncul JADWAL BENTROK)
            'id_helper' => $kruIds[11],
        ]);

        // 6. PESANAN BARU (Untuk Anda Test Plotting)
        // Pesanan besok yang butuh 3 armada berbeda
        $idTest = 'ORD-' . date('Ymd') . '-TEST';
        DB::table('pesanan')->insert([
            'id_pesanan' => $idTest,
            'nama_pemesan' => "Bapak Budi (Test Plotting Multi)",
            'alamat' => "Mojokerto Kota",
            'no_telp' => "0899888777",
            'tgl_berangkat' => Carbon::now()->addDays(1)->setTime(07, 0, 0),
            'tgl_selesai' => Carbon::now()->addDays(2)->setTime(21, 0, 0),
            'alamat_penjemputan' => "Kantor Pemkot",
            'tujuan_main' => "Yogyakarta",
            'rute' => "Malioboro - Parangtritis",
            'estimasi_jarak' => 350,
            'harga_sewa' => 9000000,
            'status_pesanan' => 'Disetujui',
        ]);

        // Detail Armadanya: 1 Big Bus, 1 Elf, 1 Mobil
        DB::table('pesanan_detail_armada')->insert([
            ['id_pesanan' => $idTest, 'tipe_armada' => 'Big Bus', 'qty' => 1],
            ['id_pesanan' => $idTest, 'tipe_armada' => 'Elf', 'qty' => 1],
            ['id_pesanan' => $idTest, 'tipe_armada' => 'Mobil', 'qty' => 1],
        ]);
    }
}
