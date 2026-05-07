<?php

namespace App\Enums;

class Role
{
    const CLIENT = 'client';
    const PROFESSIONAL = 'professional';

    public static function all()
    {
        return [
            self::CLIENT,
            self::PROFESSIONAL
        ];
    }
} 