<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TestingArjunaSeeder extends Seeder
{
    public function run()
    {
        // Bersihkan data lama agar tidak bentrok
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('penugasan')->truncate();
        DB::table('pesanan_detail_armada')->truncate();
        DB::table('pesanan')->truncate();
        DB::table('kru')->truncate();
        DB::table('armada')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. SEED DATA ARMADA (Berbagai Tipe)
        $armadaList = [
            ['nama' => 'Arjuna HDD 01', 'tipe' => 'Big Bus', 'nopol' => 'S 7123 UA'],
            ['nama' => 'Arjuna HDD 02', 'tipe' => 'Big Bus', 'nopol' => 'S 7124 UA'],
            ['nama' => 'Srikandi Executive', 'tipe' => 'Medium Bus', 'nopol' => 'S 7456 UB'],
            ['nama' => 'Bima Elf Long', 'tipe' => 'Elf', 'nopol' => 'S 7890 UC'],
            ['nama' => 'Nakula Avanza', 'tipe' => 'Mobil', 'nopol' => 'S 7321 UD'],
        ];

        foreach ($armadaList as $a) {
            DB::table('armada')->insert([
                'nama_armada' => $a['nama'],
                'tipe_armada' => $a['tipe'],
                'nopol' => $a['nopol'],
                'kapasitas' => 50,
                'status_ketersediaan' => 'Ready',
                'created_at' => now(),
            ]);
        }

        // 2. SEED DATA KRU (Untuk Tes Rekomendasi KM & Status)
        $kruList = [
            // Sopir
            ['nama' => 'Bambang (Sopir Senior)', 'peran' => 'Driver', 'status' => 'Aktif', 'ready' => 'Ready'], // Akan dibuat KM Tinggi
            ['nama' => 'Agus (Sopir Baru)', 'peran' => 'Driver', 'status' => 'Aktif', 'ready' => 'Ready'],     // Akan dibuat KM Rendah (⭐)
            ['nama' => 'Eko (Sopir Cuti)', 'peran' => 'Driver', 'status' => 'Aktif', 'ready' => 'Cuti'],      // Tidak muncul di plot
            ['nama' => 'Randi (Sopir Keluar)', 'peran' => 'Driver', 'status' => 'Tidak Aktif', 'ready' => 'Ready'], // Tidak muncul di plot

            // Helper
            ['nama' => 'Dedi (Helper 1)', 'peran' => 'Helper', 'status' => 'Aktif', 'ready' => 'Ready'],
            ['nama' => 'Roni (Helper 2)', 'peran' => 'Helper', 'status' => 'Aktif', 'ready' => 'Ready'],
            ['nama' => 'Siti (Helper Cuti)', 'peran' => 'Helper', 'status' => 'Aktif', 'ready' => 'Cuti'],
        ];

        foreach ($kruList as $k) {
            DB::table('kru')->insert([
                'nama_kru' => $k['nama'],
                'no_telp' => '0812345678',
                'peran' => $k['peran'],
                'status' => $k['status'],
                'status_ketersediaan' => $k['ready'],
                'created_at' => now(),
            ]);
        }

        // 3. SEED PESANAN MASA LALU (Untuk mencatat KM Jalan)
        // Kita buat Bambang sudah jalan 5000 KM
        $idLama = 'ORD-PAST-001';
        DB::table('pesanan')->insert([
            'id_pesanan' => $idLama,
            'nama_pemesan' => 'Pelanggan Masa Lalu',
            'alamat' => '-',
            'no_telp' => '-',
            'alamat_penjemputan' => '-',
            'tujuan_main' => '-',
            'rute' => '-',
            'tgl_berangkat' => Carbon::now()->subMonth(),
            'tgl_selesai' => Carbon::now()->subMonth()->addDays(3),
            'estimasi_jarak' => 5000, // 🎯 JARAK TINGGI
            'harga_sewa' => 0,
            'status_pesanan' => 'Selesai'
        ]);

        DB::table('penugasan')->insert([
            'id_pesanan' => $idLama,
            'jenis_aset' => 'internal',
            'id_driver' => 1, // Bambang
            'id_helper' => 5, // Dedi
        ]);

        // 4. SEED PESANAN TEST (Yang akan Anda buka di halaman Plotting)
        $idTest = 'ORD-TEST-999';
        DB::table('pesanan')->insert([
            'id_pesanan' => $idTest,
            'nama_pemesan' => 'Bapak Budi (TESTING FITUR)',
            'alamat' => 'Mojokerto',
            'no_telp' => '0812',
            'tgl_berangkat' => Carbon::now()->addDays(2)->setTime(08, 0, 0),
            'tgl_selesai' => Carbon::now()->addDays(4)->setTime(20, 0, 0),
            'alamat_penjemputan' => 'Alun-alun',
            'tujuan_main' => 'Bali',
            'rute' => 'Mojokerto - Bali',
            'estimasi_jarak' => 1000,
            'harga_sewa' => 10000000,
            'status_pesanan' => 'Disetujui'
        ]);

        DB::table('pesanan_detail_armada')->insert([
            ['id_pesanan' => $idTest, 'tipe_armada' => 'Big Bus', 'qty' => 1],
            ['id_pesanan' => $idTest, 'tipe_armada' => 'Elf', 'qty' => 1],
        ]);
    }
}
