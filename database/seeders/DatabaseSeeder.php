<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 🎯 KUNCI UTAMA SAKRAL: Baris pabrikan perusak "User::factory()" SUDAH DIBUANG BERSIH!
        // Hanya memanggil seeder pesanan borongan yang berisi data armada, kru, dan riwayat pembayaran Anda
        $this->call(PesananSeeder::class);
    }
}
