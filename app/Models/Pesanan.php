<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pesanan extends Model
{
    protected $table = 'pesanan';
    protected $primaryKey = 'id_pesanan';
    public $incrementing = false; // Karena id_pesanan berupa string varchar(20)
    protected $keyType = 'string';

    protected $fillable = [
        'id_pesanan',
        'nama_pemesan',
        'alamat',
        'no_telp',
        'tgl_berangkat',
        'tgl_selesai',
        'alamat_penjemputan',
        'tujuan_main',
        'rute',
        'estimasi_jarak',
        'tipe_unit_diminta',
        'jumlah_unit_diminta',
        'harga_sewa',
        'status_pesanan',
        'lain_lain',
        'token_akses'
    ];

    // Relasi: Satu pesanan bisa punya banyak riwayat pembayaran cicilan
    public function riwayatPembayaran()
    {
        return $this->hasMany(RiwayatPembayaran::class, 'id_pesanan', 'id_pesanan');
    }
}
