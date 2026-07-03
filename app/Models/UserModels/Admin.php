<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'user';
    protected $primaryKey = 'id_admin';

    protected $fillable = [
        'username',
        'password',
        'nama_lengkap',
        'login_terakhir',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'login_terakhir' => 'datetime',
    ];
}
