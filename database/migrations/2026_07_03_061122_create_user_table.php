<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Pastikan nama tabelnya tetap 'user' sesuai Model sampeyan
        Schema::create('user', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique(); // Kolom login
            $table->string('password');           // Kolom password (min 60 char)
            $table->string('nama_lengkap')->nullable();
            $table->rememberToken();              // WAJIB ADA: Kolom untuk fitur "Remember Me"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};
