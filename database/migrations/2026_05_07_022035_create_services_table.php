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
        Schema::create('services', function (Blueprint $table) {

            $table->id();

            $table->unsignedBigInteger('user_id');

            $table->string('title');

            $table->text('description');

            $table->decimal('price', 10, 2);

            $table->string('category');

            $table->decimal('latitude', 10, 7);

            $table->decimal('longitude', 10, 7);

            $table->float('average_rating')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
}; 