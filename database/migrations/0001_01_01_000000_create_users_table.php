<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user', function (Blueprint $table) {
            $table->id('id_admin');
            $table->string('username', 50)->unique();
            $table->string('password', 255);
            $table->string('nama_lengkap', 100);
            $table->dateTime('login_terakhir')->nullable();
            $table->enum('role', ['Admin', 'Driver']);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};
