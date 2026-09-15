<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete()->unique();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('service_price', 12, 2);
            $table->decimal('amount', 12, 2);
            $table->char('currency', 3)->default('ARS');
            $table->enum('status', ['pending', 'held', 'released', 'refunded'])->default('pending');
            $table->timestamp('held_at')->nullable();
            $table->timestamp('released_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};