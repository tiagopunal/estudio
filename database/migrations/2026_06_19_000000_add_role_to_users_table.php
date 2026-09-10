<?php

use App\Enums\Role;
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
        if (Schema::hasColumn('users', 'role')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default(Role::CLIENT)->after('password');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // La migración 2026_08_21 mantiene `role` como parte del esquema actual.
        // No debe eliminarse al revertir esta migración histórica redundante.
    }
};
