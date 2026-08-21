<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMarketplaceProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'phone' => ['nullable', 'string', 'max:30'],
            'location' => ['nullable', 'string', 'max:255'],
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
            'avatar.image' => 'El avatar debe ser una imagen.',
            'avatar.mimes' => 'El avatar debe ser JPG, PNG o WEBP.',
            'avatar.max' => 'El avatar no puede superar los 2 MB.',
            'experience_years.integer' => 'Los años de experiencia deben ser un número entero.',
            'experience_years.min' => 'Los años de experiencia no pueden ser negativos.',
        ];
    }
}
