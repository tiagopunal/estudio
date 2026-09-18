<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->decimal('initial_amount', 12, 2)->default(0)->after('amount');
            $table->decimal('held_amount', 12, 2)->default(0)->after('initial_amount');
            $table->timestamp('final_charge_at')->nullable()->after('held_at');
        });

        DB::table('payments')->update([
            'initial_amount' => DB::raw('amount'),
            'held_amount' => DB::raw("CASE WHEN status IN ('held', 'released', 'refunded') THEN amount ELSE 0 END"),
        ]);
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->dropColumn(['initial_amount', 'held_amount', 'final_charge_at']);
        });
    }
};