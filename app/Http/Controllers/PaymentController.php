<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function approve(Request $request, Booking $booking)
    {
        $user = $request->user();

        $payment = $booking->payment;

        if (! $payment) {
            abort(404);
        }

        $this->authorize('approve', $payment);

        if ($payment->status !== 'pending') {
            return back()->withErrors(['payment' => 'Este pago ya no está pendiente de aprobación.']);
        }

        $payment->update([
            'status' => 'held',
            'held_at' => now(),
        ]);

        return back()->with('success', 'Pago simulado aprobado y registrado como retenido en custodia.');
    }

    public function release(Request $request, Booking $booking)
    {
        $payment = $booking->payment;

        if (! $payment) {
            abort(404);
        }

        $this->authorize('release', $payment);

        $user = $request->user();

        if ($booking->status !== 'completed') {
            return back()->withErrors(['payment' => 'Solo puedes liberar el pago cuando el trabajo fue marcado como completado.']);
        }

        $released = DB::transaction(function () use ($booking): bool {
            $payment = $booking->payment()->lockForUpdate()->first();

            if (! $payment || $payment->status !== 'held') {
                return false;
            }

            $payment->release('customer_confirmed_completion');

            return true;
        });

        if (! $released) {
            return back()->withErrors(['payment' => 'El pago no está retenido o ya fue liberado.']);
        }

        return back()->with('success', 'Confirmaste la finalización y liberaste el pago simulado.');
    }
}