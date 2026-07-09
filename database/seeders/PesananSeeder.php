<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PesananSeeder extends Seeder
{
    /**
     * Jalankan data seeder massal SINKRON SAKRAL 100% DENGAN STRUKTUR TABEL ARMADA ANDA.
     */
    public function run(): void
    {
        // ─── 1. SEED DATA TABEL: armada (🎯 SINKRON ENUM KAKU: Big Bus, Medium Bus, Elf, Mobil & Tersedia) ───
        DB::table('armada')->insert([
            [
                'id_armada' => 1,
                'nama_armada' => 'Arjuna Jetbus 3+ HDD',
                'tipe_armada' => 'Big Bus',
                'nopol' => 'S 7123 UA',
                'kapasitas' => 50,
                'fasilitas' => 'AC, TV, Karaoke, USB Charger, Reclining Seat',
                'status_ketersediaan' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_armada' => 2,
                'nama_armada' => 'Srikandi Medium Bus',
                'tipe_armada' => 'Medium Bus',
                'nopol' => 'S 7456 UB',
                'kapasitas' => 35,
                'fasilitas' => 'AC, Audio, Karaoke, USB Charger',
                'status_ketersediaan' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_armada' => 3,
                'nama_armada' => 'Bima Executive Elf Long',
                'tipe_armada' => 'Elf',
                'nopol' => 'S 7890 UC',
                'kapasitas' => 19,
                'fasilitas' => 'AC, Audio, Reclining Seat, USB Charger',
                'status_ketersediaan' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_armada' => 4,
                'nama_armada' => 'Nakula Luxury Avanza',
                'tipe_armada' => 'Mobil',
                'nopol' => 'S 7321 UD',
                'kapasitas' => 7,
                'fasilitas' => 'AC, TV, Reclining Seat',
                'status_ketersediaan' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // ─── 2. SEED DATA TABEL: kru ───
        DB::table('kru')->insert([
            ['id_kru' => 1, 'nama_kru' => 'Bambang Supriyadi', 'no_telp' => '081211112222', 'peran' => 'Driver', 'status_ketersediaan' => 'Ready', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
            ['id_kru' => 2, 'nama_kru' => 'Agus Setiawan', 'no_telp' => '081233334444', 'peran' => 'Driver', 'status_ketersediaan' => 'Ready', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
            ['id_kru' => 3, 'nama_kru' => 'Eko Prasetyo', 'no_telp' => '081255556666', 'peran' => 'Driver', 'status_ketersediaan' => 'Ready', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
            ['id_kru' => 4, 'nama_kru' => 'Dedi Kurniawan', 'no_telp' => '085711112222', 'peran' => 'Helper', 'status_ketersediaan' => 'Ready', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
            ['id_kru' => 5, 'nama_kru' => 'Roni Wijaya', 'no_telp' => '085733334444', 'peran' => 'Helper', 'status_ketersediaan' => 'Ready', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ─── 3. SEED DATA TABEL INDUK: pesanan (🎯 SINKRON: Kolom tipe_unit_diminta menggunakan Bus, Medium Bus, Big Bus, Mobil sesuai data riil Anda) ───
        DB::table('pesanan')->insert([
            [
                'id_pesanan' => 'ORD-2026070001',
                'nama_pemesan' => 'Ayu Listiyo Wati',
                'no_telp' => '081234567890',
                'tujuan_main' => 'Yogyakarta (Malioboro - Pantai Indrayanti)',
                'alamat' => 'Pacet, Mojokerto',
                'alamat_penjemputan' => 'Pacet, Mojokerto',
                'estimasi_jarak' => 280,
                'tgl_berangkat' => '2026-08-07 06:00:00',
                'tgl_selesai' => '2026-08-09 21:00:00',
                'rute' => 'Pacet - Tol Jombang - Solo - Jogja - Pacet',
                'harga_sewa' => 4000000,
                'tipe_unit_diminta' => 'Bus',
                'jumlah_unit_diminta' => 1,
                'status_pesanan' => 'Disetujui',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_pesanan' => 'ORD-2026070002',
                'nama_pemesan' => 'Budi Santoso (Rombongan PKK)',
                'no_telp' => '085711223344',
                'tujuan_main' => 'Batu - Malang',
                'alamat' => 'Alun-Alun Mojokerto',
                'alamat_penjemputan' => 'Alun-Alun Mojokerto',
                'estimasi_jarak' => 65,
                'tgl_berangkat' => '2026-07-15 07:00:00',
                'tgl_selesai' => '2026-07-15 22:00:00',
                'rute' => 'Mojokerto - Cangar - Batu - Malang - Tol Pandaan - Mojokerto',
                'harga_sewa' => 2500000,
                'tipe_unit_diminta' => 'Medium Bus',
                'jumlah_unit_diminta' => 1,
                'status_pesanan' => 'Terjadwal',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_pesanan' => 'ORD-2026070003',
                'nama_pemesan' => 'Zainal Arifin (Sewa Kantor)',
                'no_telp' => '089988776655',
                'tujuan_main' => 'Kuta Bali Tour full',
                'alamat' => 'Kantor Pemkab Mojokerto',
                'alamat_penjemputan' => 'Depan Pemkab Mojokerto',
                'estimasi_jarak' => 450,
                'tgl_berangkat' => '2026-09-01 13:00:00',
                'tgl_selesai' => '2026-09-05 18:00:00',
                'rute' => 'Mojokerto - Banyuwangi - Gilimanuk - Denpasar - Kuta - Mojokerto',
                'harga_sewa' => 16000000,
                'tipe_unit_diminta' => 'Big Bus',
                'jumlah_unit_diminta' => 2,
                'status_pesanan' => 'Disetujui',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_pesanan' => 'ORD-2026070004',
                'nama_pemesan' => 'Siti Aminah (Ziarah Wali)',
                'no_telp' => '082144556677',
                'tujuan_main' => 'Ziarah Wali 5 Jatim',
                'alamat' => 'Dsn. Kebonagung, Puri',
                'alamat_penjemputan' => 'Masjid Jami Kebonagung',
                'estimasi_jarak' => 310,
                'tgl_berangkat' => '2026-07-20 20:00:00',
                'tgl_selesai' => '2026-07-22 04:00:00',
                'rute' => 'Mojokerto - Sunan Ampel - Giri - Drajat - Asmoro - Bonang - Mojokerto',
                'harga_sewa' => 5500000,
                'tipe_unit_diminta' => 'Big Bus',
                'jumlah_unit_diminta' => 1,
                'status_pesanan' => 'Pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_pesanan' => 'ORD-2026070005',
                'nama_pemesan' => 'Randi Wijaya (Sewa Mobil Keliling)',
                'no_telp' => '087855556666',
                'tujuan_main' => 'Surabaya Kenjeran Park',
                'alamat' => 'Sooko, Mojokerto',
                'alamat_penjemputan' => 'Depan SMAN 1 Sooko',
                'estimasi_jarak' => 50,
                'tgl_berangkat' => '2026-07-10 08:00:00',
                'tgl_selesai' => '2026-07-10 17:00:00',
                'rute' => 'Sooko - Bypass - Tol Sumo - Kenjeran - Sooko',
                'harga_sewa' => 2000000,
                'tipe_unit_diminta' => 'Mobil',
                'jumlah_unit_diminta' => 1,
                'status_pesanan' => 'Batal',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // ─── 4. SEED DATA TABEL ANAK RELASI: riwayat_pembayaran ───
        DB::table('riwayat_pembayaran')->insert([
            [
                'id_pesanan' => 'ORD-2026070001',
                'tipe_keterangan' => 'DP',
                'tgl_bayar' => '2026-07-02',
                'nominal' => 500000,
                'catatan_pembayaran' => 'Pembayaran Uang Muka via Transfer Mandiri',
                'bukti_transfer' => 'struk_dp_ayu.jpg',
                'status_pembayaran' => 'Disetujui',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id_pesanan' => 'ORD-2026070001',
                'tipe_keterangan' => 'Cicil',
                'tgl_bayar' => '2026-07-08',
                'nominal' => 500000,
                'catatan_pembayaran' => 'Pembayaran Angsuran Kedua via ATM',
                'bukti_transfer' => 'struk_cicil_ayu.jpg',
                'status_pembayaran' => 'Pending',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id_pesanan' => 'ORD-2026070002',
                'tipe_keterangan' => 'Lunas',
                'tgl_bayar' => '2026-07-05',
                'nominal' => 2500000,
                'catatan_pembayaran' => 'Pelunasan Sewa Bus PKK Tunai di Kantor PO',
                'bukti_transfer' => 'bukti_default.jpg',
                'status_pembayaran' => 'Disetujui',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
