<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class StrictEmail implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)
            || filter_var($value, FILTER_VALIDATE_EMAIL) === false
            || ! preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u', $value)) {
            $fail('Ingresá un correo electrónico completo, por ejemplo nombre@gmail.com.');
        }
    }
}
