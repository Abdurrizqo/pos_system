<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'profile';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $fillable = [
        'namaUsaha'
    ];
}
