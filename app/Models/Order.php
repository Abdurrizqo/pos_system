<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'orders'; // Menyesuaikan nama tabel dengan yang telah Anda tentukan

    protected $primaryKey = 'id'; // Mengatur primary key

    public $incrementing = false; // Menonaktifkan auto-increment pada primary key

    protected $keyType = 'string'; // Menyesuaikan tipe data primary key

    protected $fillable = [
        'id',
        'namaKasir',
        'total_harga',
        'isDelete'
    ];
}
