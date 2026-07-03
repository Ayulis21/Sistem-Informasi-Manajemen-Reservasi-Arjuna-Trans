<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penugasan extends Model
{
    protected $table = 'penugasan';
    protected $primaryKey = 'id_plotting';

    protected $fillable = [
        'id_pesanan',
        'jenis_aset',
        'id_armada',
        'id_driver',
        'id_helper',
        'nama_po_mitra',
        'plat_mitra',
        'kapasitas_mitra',
        'harga_modal_mitra',
    ];

    // Relasi balik menuju data pesanan induk
    public function pesanan()
    {
        return $this->belongsTo(Pesanan::class, 'id_pesanan', 'id_pesanan');
    }

    // Relasi balik menuju data armada internal
    public function armada()
    {
        return $this->belongsTo(Armada::class, 'id_armada', 'id_armada');
    }

    // Relasi balik menuju data driver internal
    public function driver()
    {
        return $this->belongsTo(Kru::class, 'id_driver', 'id_kru');
    }

    // Relasi balik menuju data helper internal
    public function helper()
    {
        return $this->belongsTo(Kru::class, 'id_helper', 'id_kru');
    }
}
