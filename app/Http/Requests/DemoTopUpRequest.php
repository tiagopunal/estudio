<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DemoTopUpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'regex:/^\d+(?:\.\d{1,2})?$/', 'gte:100', 'lte:1000000'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Ingresá un importe.',
            'amount.regex' => 'El importe debe ser positivo y tener hasta dos decimales.',
            'amount.gte' => 'La carga mínima es de $100.',
            'amount.lte' => 'La carga máxima por operación es de $1.000.000.',
        ];
    }
}