<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kru extends Model
{
    protected $table = 'kru';
    protected $primaryKey = 'id_kru';

    protected $fillable = [
        'nama_kru',
        'no_telp',
        'peran',
        'status_ketersediaan',
        'status',
    ];

    // Relasi penugasan sebagai Driver utama
    public function penugasanDriver()
    {
        return $this->hasMany(Penugasan::class, 'id_driver', 'id_kru');
    }

    // Relasi penugasan sebagai Helper/Kernet
    public function penugasanHelper()
    {
        return $this->hasMany(Penugasan::class, 'id_helper', 'id_kru');
    }
}
