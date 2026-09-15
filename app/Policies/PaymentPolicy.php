<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function view(User $user, Payment $payment): bool
    {
        return $payment->customer_id === $user->id
            || $payment->booking->service->user_id === $user->id;
    }

    public function approve(User $user, Payment $payment): bool
    {
        return $payment->customer_id === $user->id;
    }

    public function release(User $user, Payment $payment): bool
    {
        return $payment->customer_id === $user->id
            && $payment->booking->status === 'completed';
    }
}