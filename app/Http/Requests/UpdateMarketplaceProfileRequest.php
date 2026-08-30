<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMarketplaceProfileRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        foreach (['full_name', 'description', 'phone', 'location', 'profession', 'skills'] as $field) {
            if ($this->has($field) && is_string($this->input($field))) {
                $this->merge([$field => trim($this->input($field))]);
            }
        }
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'min:2', 'max:100', 'regex:/^[\pL\pM\s\'.\-]+$/u'],
            'description' => ['nullable', 'string', 'max:1000'],
            'phone' => ['nullable', 'string', 'min:8', 'max:30', 'regex:/^\+?[0-9\s()\-]+$/'],
            'location' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90', 'required_with:longitude'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180', 'required_with:latitude'],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'profession' => ['nullable', 'string', 'max:120'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:80'],
            'skills' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'El nombre completo es obligatorio.',
            'full_name.regex' => 'El nombre solo puede contener letras, espacios, puntos, apóstrofes y guiones.',
            'phone.regex' => 'Ingresá un teléfono válido usando números, espacios, paréntesis, + o guiones.',
            'avatar.image' => 'El avatar debe ser una imagen.',
            'avatar.mimes' => 'El avatar debe ser JPG, PNG o WEBP.',
            'avatar.max' => 'El avatar no puede superar los 2 MB.',
            'latitude.required_with' => 'Ingresá también la latitud.',
            'longitude.required_with' => 'Ingresá también la longitud.',
            'experience_years.integer' => 'Los años de experiencia deben ser un número entero.',
            'experience_years.min' => 'Los años de experiencia no pueden ser negativos.',
        ];
    }
}
