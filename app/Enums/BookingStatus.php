<?php

namespace App\Enums;

class BookingStatus
{
    const PENDING = 'pending';
    const CONFIRMED = 'confirmed';
    const CANCELLED = 'cancelled';
    const COMPLETED = 'completed';

    public static function all()
    {
        return [
            self::PENDING,
            self::CONFIRMED,
            self::CANCELLED,
            self::COMPLETED
        ];
    }
} 