<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('penugasan', function (Blueprint $table) {
            $table->id('id_plotting');
            $table->string('id_pesanan', 20);
            $table->enum('jenis_aset', ['internal', 'rekanan']);

            // Kolom untuk aset internal (mengikat foreign key id_armada dan id_kru)
            $table->unsignedBigInteger('id_armada')->nullable();
            $table->unsignedBigInteger('id_driver')->nullable();
            $table->unsignedBigInteger('id_helper')->nullable();

            // Kolom untuk aset rekanan/mitra (opsional / nullable)
            $table->string('nama_po_mitra', 100)->nullable();
            $table->string('plat_mitra', 15)->nullable();
            $table->integer('kapasitas_mitra')->nullable();
            $table->decimal('harga_modal_mitra', 15, 2)->nullable();
            $table->timestamps();

            // Relasi Foreign Key
            $table->foreign('id_pesanan')->references('id_pesanan')->on('pesanan')->onDelete('cascade');
            $table->foreign('id_armada')->references('id_armada')->on('armada')->onDelete('set null');
            $table->foreign('id_driver')->references('id_kru')->on('kru')->onDelete('set null');
            $table->foreign('id_helper')->references('id_kru')->on('kru')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penugasan');
    }
};
