<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->string('title');

            $table->text('description');

            $table->decimal('price', 10, 2);

            $table->string('category');

            $table->string('location')->nullable();

            $table->decimal('latitude', 10, 7)
                ->nullable();

            $table->decimal('longitude', 10, 7)
                ->nullable();

            
            $table->decimal('average_rating', 3, 2)
                ->default(0);

            $table->integer('total_reviews')
                ->default(0);

        
            $table->enum('status', ['active', 'paused'])
                ->default('active');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};