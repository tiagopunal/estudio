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
            $table->timestamp('release_at')->nullable()->after('held_at');
            $table->timestamp('refunded_at')->nullable()->after('released_at');
            $table->string('release_reason')->nullable()->after('refunded_at');
        });

        if (DB::getDriverName() === 'pgsql') {
            $constraints = DB::select(<<<'SQL'
                SELECT conname
                FROM pg_constraint
                WHERE conrelid = 'payments'::regclass
                  AND contype = 'c'
                  AND pg_get_constraintdef(oid) ILIKE '%status%'
            SQL);

            foreach ($constraints as $constraint) {
                $constraintName = str_replace('"', '""', $constraint->conname);
                DB::statement('ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "'.$constraintName.'"');
            }

            DB::statement(<<<'SQL'
                ALTER TABLE "payments"
                ADD CONSTRAINT "payments_status_check"
                CHECK ("status" IN ('pending', 'held', 'released', 'refunded', 'failed'))
            SQL);
            DB::statement('ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT \'pending\'');
        } else {
            Schema::table('payments', function (Blueprint $table): void {
                $table->enum('status', ['pending', 'held', 'released', 'refunded', 'failed'])
                    ->default('pending')
                    ->change();
            });
        }
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->dropColumn(['release_at', 'refunded_at', 'release_reason']);
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "payments_status_check"');
            DB::statement(<<<'SQL'
                ALTER TABLE "payments"
                ADD CONSTRAINT "payments_status_check"
                CHECK ("status" IN ('pending', 'held', 'released', 'refunded'))
            SQL);
            DB::statement('ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT \'pending\'');
        } else {
            Schema::table('payments', function (Blueprint $table): void {
                $table->enum('status', ['pending', 'held', 'released', 'refunded'])
                    ->default('pending')
                    ->change();
            });
        }
    }
};