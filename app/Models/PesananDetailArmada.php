<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PesananDetailArmada extends Model
{
    use HasFactory;

    protected $table = 'pesanan_detail_armada';

    protected $fillable = [

        'id_pesanan',
        'tipe_armada',
        'qty'

    ];
}
