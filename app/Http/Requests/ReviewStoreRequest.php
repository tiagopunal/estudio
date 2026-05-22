<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ReviewStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'booking_id' => ['required', 'integer', 'exists:bookings,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000']
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'booking_id.required' => 'El ID de la reserva es requerido',
            'booking_id.exists' => 'La reserva no existe',
            'rating.required' => 'La calificación es requerida',
            'rating.integer' => 'La calificación debe ser un número entero',
            'rating.min' => 'La calificación debe ser al menos 1',
            'rating.max' => 'La calificación no puede ser mayor a 5',
            'comment.max' => 'El comentario no puede exceder 1000 caracteres'
        ];
    }
}
