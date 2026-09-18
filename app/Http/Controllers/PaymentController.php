<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Services\WalletService;
use Illuminate\Http\Request;
use RuntimeException;

class PaymentController extends Controller
{
    public function __construct(private readonly WalletService $wallets) {}

    public function approve(Request $request, Booking $booking)
    {
        $payment = $booking->payment;

        if (! $payment) {
            abort(404);
        }

        $this->authorize('approve', $payment);

        try {
            $this->wallets->holdClientFunds($payment);
        } catch (RuntimeException $exception) {
            return back()->withErrors(['payment' => $exception->getMessage()]);
        }

        return back()->with('success', 'Pago simulado aprobado. El monto quedó retenido en custodia.');
    }

    public function release(Request $request, Booking $booking)
    {
        $payment = $booking->payment;

        if (! $payment) {
            abort(404);
        }

        $this->authorize('release', $payment);

        if ($booking->status !== 'completed') {
            return back()->withErrors(['payment' => 'Solo puedes liberar el pago cuando el trabajo fue marcado como completado.']);
        }

        if ($booking->payment->status !== 'held') {
            return back()->withErrors(['payment' => 'El pago no está retenido o ya fue liberado.']);
        }

        try {
            $this->wallets->releaseFundsToProfessional($booking->payment, 'customer_confirmed_completion');
        } catch (RuntimeException $exception) {
            return back()->withErrors(['payment' => $exception->getMessage()]);
        }

        return back()->with('success', 'Confirmaste la finalización y liberaste el pago simulado.');
    }
}