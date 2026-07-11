<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pesanan', function (Blueprint $table) {
            $table->string('id_pesanan', 20)->primary(); // Sesuai ERD memakai varchar(20) primary key
            $table->string('nama_pemesan', 255);
            $table->text('alamat');
            $table->string('no_telp', 15);
            $table->dateTime('tgl_berangkat');
            $table->dateTime('tgl_selesai');
            $table->string('alamat_penjemputan', 255);
            $table->string('tujuan_main', 255);
            $table->string('rute', 255);
            $table->integer('estimasi_jarak');
            $table->decimal('harga_sewa', 15, 2);
            $table->date('jatuh_tempo')->nullable();
            $table->enum('status_pesanan', ['Pending', 'Disetujui', 'Terjadwal', 'Selesai', 'Batal'])->default('Pending');
            $table->text('lain_lain')->nullable();
            $table->string('token_akses', 64)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pesanan');
    }
};
