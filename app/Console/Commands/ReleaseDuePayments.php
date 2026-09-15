<?php

namespace App\Console\Commands;

use App\Models\Payment;
use Illuminate\Console\Command;

class ReleaseDuePayments extends Command
{
    protected $signature = 'payments:release-due';

    protected $description = 'Libera pagos simulados retenidos 60 días después del servicio';

    public function handle(): int
    {
        Payment::query()
            ->where('status', 'held')
            ->whereNotNull('release_at')
            ->where('release_at', '<=', now())
            ->eachById(function (Payment $payment): void {
                $payment->release('automatic_60_day_expiration');
            });

        return self::SUCCESS;
    }
}