<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role', 20)->default('client')->index();
            });
        }

        DB::table('users')
            ->whereNotExists(function ($query) {
                $query->selectRaw('1')
                    ->from('profiles')
                    ->whereColumn('profiles.user_id', 'users.id');
            })
            ->orderBy('id')
            ->each(function ($user): void {
                DB::table('profiles')->insert([
                    'user_id' => $user->id,
                    'full_name' => $user->name,
                    'experience_years' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            });

        Schema::table('profiles', function (Blueprint $table) {
            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropUnique(['user_id']);
        });

    }
};
