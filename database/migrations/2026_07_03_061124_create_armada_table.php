<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('armada', function (Blueprint $table) {
            $table->id('id_armada');
            $table->string('nama_armada', 50);
            $table->enum('tipe_armada', ['Bus', 'Elf', 'Mobil']);
            $table->string('nopol', 15);
            $table->integer('kapasitas');
            $table->text('fasilitas')->nullable();
            $table->enum('status_ketersediaan', ['Tersedia', 'Perjalanan', 'Perbaikan'])->default('Tersedia');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('armada');
    }
};
