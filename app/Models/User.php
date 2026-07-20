<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $table = 'user'; // TABEL HARUS 'user'
    protected $fillable = ['username', 'password'];
    protected $hidden = ['password', 'remember_token'];
}
