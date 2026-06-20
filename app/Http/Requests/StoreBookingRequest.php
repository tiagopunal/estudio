<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('date')) {
            $this->merge([
                'date' => str_replace('T', ' ', $this->input('date')),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date_format:Y-m-d H:i|after:now',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'service_id.required' => 'El servicio es obligatorio',
            'service_id.exists' => 'El servicio seleccionado no existe',
            'date.required' => 'La fecha es obligatoria',
            'date.date_format' => 'La fecha debe estar en formato YYYY-MM-DD HH:MM',
            'date.after' => 'La fecha debe ser posterior a la actual',
        ];
    }
}