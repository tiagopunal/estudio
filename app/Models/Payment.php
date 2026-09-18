<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'booking_id',
        'customer_id',
        'service_price',
        'amount',
        'initial_amount',
        'held_amount',
        'currency',
        'status',
        'held_at',
        'final_charge_at',
        'release_at',
        'released_at',
        'refunded_at',
        'release_reason',
    ];

    protected function casts(): array
    {
        return [
            'service_price' => 'decimal:2',
            'amount' => 'decimal:2',
            'initial_amount' => 'decimal:2',
            'held_amount' => 'decimal:2',
            'held_at' => 'datetime',
            'final_charge_at' => 'datetime',
            'release_at' => 'datetime',
            'released_at' => 'datetime',
            'refunded_at' => 'datetime',
        ];
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function walletTransactions()
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public static function amountToCents(string|int $amount): int
    {
        $normalized = trim((string) $amount);

        if (! preg_match('/^\d+(?:\.\d{1,2})?$/', $normalized)) {
            throw new \InvalidArgumentException('El importe debe ser un decimal positivo con hasta dos decimales.');
        }

        [$whole, $fraction] = array_pad(explode('.', $normalized, 2), 2, '0');

        return ((int) $whole * 100) + (int) str_pad($fraction, 2, '0');
    }

    public function release(string $reason): bool
    {
        if ($this->status !== 'held') {
            return false;
        }

        $updated = static::query()
            ->whereKey($this->getKey())
            ->where('status', 'held')
            ->update([
            'status' => 'released',
            'released_at' => now(),
            'release_reason' => $reason,
        ]);

        if ($updated === 1) {
            $this->refresh();
        }

        return $updated === 1;
    }

    public function refund(): void
    {
        if (! in_array($this->status, ['pending', 'held'], true)) {
            return;
        }

        $this->update([
            'status' => 'refunded',
            'refunded_at' => now(),
        ]);
    }
}