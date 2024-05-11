<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'menus';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $fillable = [
        'menuName', 'pict', 'harga',
    ];
}
