<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('riwayat_pembayaran', function (Blueprint $table) {
            $table->id('id_pembayaran');
            $table->string('id_pesanan', 20);
            $table->decimal('nominal', 15, 2);
            $table->dateTime('tgl_bayar');
            $table->enum('tipe_keterangan', ['DP', 'Cicil', 'Lunas']);
            $table->string('bukti_transfer', 255);
            $table->string('status_pembayaran', 255)->default('Pending');
            $table->string('catatan_pembayaran', 255)->nullable();
            $table->timestamps();

            // Relasi Foreign Key lurus ke tabel pesanan
            $table->foreign('id_pesanan')->references('id_pesanan')->on('pesanan')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('riwayat_pembayaran');
    }
};
