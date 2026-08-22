<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        foreach (['title', 'description', 'category', 'location'] as $field) {
            if ($this->has($field) && is_string($this->input($field))) {
                $this->merge([$field => trim($this->input($field))]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:5', 'max:120'],
            'description' => ['required', 'string', 'min:20', 'max:2000'],
            'price' => ['required', 'numeric', 'min:0.01', 'max:99999999.99'],
            'category' => ['required', 'string', 'min:3', 'max:50', 'regex:/^[\pL\pM\s\-&]+$/u'],
            'location' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90', 'required_with:longitude'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180', 'required_with:latitude'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.min' => 'El título debe tener al menos 5 caracteres.',
            'description.min' => 'La descripción debe tener al menos 20 caracteres.',
            'category.regex' => 'La categoría contiene caracteres no válidos.',
            'latitude.between' => 'La latitud debe estar entre -90 y 90.',
            'longitude.between' => 'La longitud debe estar entre -180 y 180.',
            'latitude.required_with' => 'Ingresá también la latitud.',
            'longitude.required_with' => 'Ingresá también la longitud.',
        ];
    }
}
