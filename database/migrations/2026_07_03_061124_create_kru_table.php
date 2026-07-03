<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('kru', function (Blueprint $table) {
            $table->id('id_kru');
            $table->string('nama_kru', 255);
            $table->string('no_telp', 15);
            $table->enum('peran', ['Driver', 'Helper']);
            $table->enum('status_ketersediaan', ['Ready', 'Bertugas'])->default('Ready');
            $table->enum('status', ['Aktif', 'Tidak Aktif'])->default('Aktif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kru');
    }
};
