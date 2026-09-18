<?php

namespace App\Console\Commands;

use App\Models\Payment;
use App\Services\WalletService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class ReleaseDuePayments extends Command
{
    protected $signature = 'payments:release-due';

    protected $description = 'Libera pagos simulados retenidos 60 días después del servicio';

    public function handle(WalletService $wallets): int
    {
        Payment::query()
            ->where('status', 'held')
            ->with('booking')
            ->eachById(function (Payment $payment) use ($wallets): void {
                $booking = $payment->booking;
                // Completed bookings count 60 days from completion; otherwise use the scheduled service date.
                $referenceDate = $booking?->status === 'completed'
                    ? $booking->completed_at
                    : ($booking?->status === 'confirmed' ? Carbon::parse($booking->date) : null);

                if ($referenceDate?->copy()->addDays(60)->lte(now())) {
                    $wallets->releaseFundsToProfessional($payment, 'automatic_60_day_expiration');
                }
            });

        return self::SUCCESS;
    }
}