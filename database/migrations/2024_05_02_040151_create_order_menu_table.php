<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_menu', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('namaMenu');
            $table->integer('jumlah');
            $table->integer('hargaSatuan');
            $table->uuid('orderId');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_menu');
    }
};
