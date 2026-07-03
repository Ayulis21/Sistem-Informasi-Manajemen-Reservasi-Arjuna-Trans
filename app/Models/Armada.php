<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Armada extends Model
{
    protected $table = 'armada';
    protected $primaryKey = 'id_armada';

    protected $fillable = [
        'nama_armada',
        'tipe_armada',
        'nopol',
        'kapasitas',
        'fasilitas',
        'status_ketersediaan',
    ];

    // Relasi: Satu armada internal bisa ditugaskan ke banyak jadwal penugasan
    public function penugasan()
    {
        return $this->hasMany(Penugasan::class, 'id_armada', 'id_armada');
    }
}
