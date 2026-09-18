<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;
use RuntimeException;

class WalletService
{
    public function getOrCreateWallet(User $user): Wallet
    {
        return DB::transaction(function () use ($user): Wallet {
            Wallet::firstOrCreate(['user_id' => $user->id], ['currency' => 'ARS']);

            return Wallet::where('user_id', $user->id)->lockForUpdate()->firstOrFail();
        });
    }

    public function topUpDemo(User $user, string|int $amount): Wallet
    {
        $cents = $this->toCents($amount);
        if ($cents < 10000 || $cents > 100000000) {
            throw new InvalidArgumentException('La carga debe estar entre $100 y $1.000.000.');
        }

        return DB::transaction(function () use ($user, $cents): Wallet {
            $wallet = $this->lockedWallet($user);
            $before = $this->cents($wallet->available_balance);
            $after = $before + $cents;
            $wallet->update(['available_balance' => $this->money($after)]);
            $this->transaction($wallet, $cents, $before, $after, 'demo_top_up', 'Carga de saldo simulada');

            return $wallet->fresh();
        });
    }

    public function holdClientFunds(Payment $payment): Payment
    {
        return DB::transaction(function () use ($payment): Payment {
            $payment = Payment::whereKey($payment->id)->lockForUpdate()->firstOrFail();
            if ($payment->status === 'held') {
                return $payment;
            }
            if ($payment->status !== 'pending') {
                throw new RuntimeException('Este pago ya no está pendiente de aprobación.');
            }

            $wallet = $this->lockedWallet($payment->customer);
            $amount = $this->cents($payment->amount);
            $availableBefore = $this->cents($wallet->available_balance);
            $heldBefore = $this->cents($wallet->held_balance);
            if ($availableBefore < $amount) {
                throw new RuntimeException('No tenés saldo simulado suficiente. Cargá saldo en tu billetera para continuar.');
            }

            $wallet->update([
                'available_balance' => $this->money($availableBefore - $amount),
                'held_balance' => $this->money($heldBefore + $amount),
            ]);
            $this->transaction($wallet, $amount, $availableBefore, $availableBefore - $amount, 'payment_held', 'Pago simulado enviado a custodia', $payment);

            $payment->update([
                'status' => 'held',
                'held_at' => now(),
                'initial_amount' => $this->money($amount),
                'held_amount' => $this->money($amount),
                'release_at' => $payment->release_at ?? $payment->booking->date->addDays(60),
            ]);
            return $payment->fresh();
        });
    }

    public function releaseFundsToProfessional(Payment $payment, string $reason): Payment
    {
        return DB::transaction(function () use ($payment, $reason): Payment {
            $payment = Payment::whereKey($payment->id)->lockForUpdate()->firstOrFail();
            if ($payment->status === 'released') {
                return $payment;
            }
            if ($payment->status !== 'held') {
                throw new RuntimeException('El pago no está retenido o ya fue liberado.');
            }

            $amount = $this->heldAmount($payment);
            $clientWallet = $this->lockedWallet($payment->customer);
            $professionalWallet = $this->lockedWallet($payment->booking->service->user);
            $heldBefore = $this->cents($clientWallet->held_balance);
            if ($heldBefore < $amount) {
                if ($clientWallet->transactions()->where('payment_id', $payment->id)->exists()) {
                    throw new RuntimeException('El saldo retenido del cliente no es válido.');
                }
                $heldBefore = $amount;
                $clientWallet->update(['held_balance' => $this->money($amount)]);
            }
            $professionalBefore = $this->cents($professionalWallet->available_balance);
            $clientWallet->update(['held_balance' => $this->money($heldBefore - $amount)]);
            $professionalWallet->update(['available_balance' => $this->money($professionalBefore + $amount)]);
            $this->transaction($clientWallet, $amount, $heldBefore, $heldBefore - $amount, 'payment_released', 'Pago simulado liberado de custodia', $payment);
            $this->transaction($professionalWallet, $amount, $professionalBefore, $professionalBefore + $amount, 'payment_released', 'Ingreso simulado liberado', $payment);
            $payment->update([
                'status' => 'released',
                'held_amount' => '0.00',
                'released_at' => now(),
                'release_reason' => $reason,
            ]);
            return $payment->fresh();
        });
    }

    public function refundClientFunds(Payment $payment, string $reason = 'booking_cancelled'): Payment
    {
        return DB::transaction(function () use ($payment, $reason): Payment {
            $payment = Payment::whereKey($payment->id)->lockForUpdate()->firstOrFail();
            if ($payment->status === 'refunded') {
                return $payment;
            }
            if ($payment->status !== 'held') {
                $payment->update(['status' => 'refunded', 'refunded_at' => now()]);
                return $payment->fresh();
            }

            $amount = $this->heldAmount($payment);
            $wallet = $this->lockedWallet($payment->customer);
            $heldBefore = $this->cents($wallet->held_balance);
            $availableBefore = $this->cents($wallet->available_balance);
            if ($heldBefore < $amount) {
                if ($wallet->transactions()->where('payment_id', $payment->id)->exists()) {
                    throw new RuntimeException('El saldo retenido del cliente no es válido.');
                }
                $heldBefore = $amount;
                $wallet->update(['held_balance' => $this->money($amount)]);
            }
            $wallet->update([
                'held_balance' => $this->money($heldBefore - $amount),
                'available_balance' => $this->money($availableBefore + $amount),
            ]);
            $this->transaction($wallet, $amount, $availableBefore, $availableBefore + $amount, 'payment_refund', 'Reembolso de pago simulado', $payment, ['reason' => $reason]);
            $payment->update(['status' => 'refunded', 'held_amount' => '0.00', 'refunded_at' => now()]);
            return $payment->fresh();
        });
    }

    private function lockedWallet(User $user): Wallet
    {
        Wallet::firstOrCreate(['user_id' => $user->id], ['currency' => 'ARS']);
        return Wallet::where('user_id', $user->id)->lockForUpdate()->firstOrFail();
    }

    private function heldAmount(Payment $payment): int
    {
        $heldAmount = $this->cents($payment->held_amount ?? '0');

        return $heldAmount > 0 ? $heldAmount : $this->cents($payment->amount);
    }

    private function transaction(Wallet $wallet, int $amount, int $before, int $after, string $type, string $description, ?Payment $payment = null, ?array $metadata = null): void
    {
        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'payment_id' => $payment?->id,
            'booking_id' => $payment?->booking_id,
            'type' => $type,
            'amount' => $this->money($amount),
            'balance_before' => $this->money($before),
            'balance_after' => $this->money($after),
            'description' => $description,
            'metadata' => $metadata,
        ]);
    }

    private function toCents(string|int $amount): int
    {
        $value = trim((string) $amount);
        if (! preg_match('/^\d+(?:\.\d{1,2})?$/', $value)) {
            throw new InvalidArgumentException('El importe debe ser positivo y tener hasta dos decimales.');
        }
        [$whole, $fraction] = array_pad(explode('.', $value, 2), 2, '0');
        return ((int) $whole * 100) + (int) str_pad($fraction, 2, '0');
    }

    private function cents(string|int $amount): int
    {
        return $this->toCents((string) $amount);
    }

    private function money(int $cents): string
    {
        return number_format($cents / 100, 2, '.', '');
    }
}