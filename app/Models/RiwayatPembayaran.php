<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiwayatPembayaran extends Model
{
    protected $table = 'riwayat_pembayaran';
    protected $primaryKey = 'id_pembayaran';

    protected $fillable = [
        'id_pesanan',
        'nominal',
        'tgl_bayar',
        'tipe_keterangan',
        'bukti_transfer',
        'status_pembayaran',
        'catatan_pembayaran'
    ];
}
