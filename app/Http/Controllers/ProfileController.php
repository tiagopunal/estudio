<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | MOSTRAR PERFIL DE USUARIO
    |--------------------------------------------------------------------------
    */
    public function show(User $user)
    {
        return Inertia::render('Profiles/Show', [
            'profile' => $user->load('profile', 'services', 'reviews'),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | MOSTRAR MI PERFIL (AUTENTICADO)
    |--------------------------------------------------------------------------
    */
    public function myProfile()
    {
        $user = auth()->user()->load('profile', 'services', 'reviews');

        return Inertia::render('Profiles/Edit', [
            'profile' => $user,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ACTUALIZAR MI PERFIL
    |--------------------------------------------------------------------------
    */
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'description' => 'nullable|string|max:1000',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = auth()->user();
        
        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            if ($user->profile?->avatar) {
                // Delete old avatar
                \Storage::delete($user->profile->avatar);
            }
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        // Update or create profile
        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return redirect()->route('profile.my-profile')
            ->with('success', 'Perfil actualizado correctamente');
    }

    /*
    |--------------------------------------------------------------------------
    | LISTAR SERVICIOS DEL USUARIO
    |--------------------------------------------------------------------------
    */
    public function services(User $user)
    {
        $services = $user->services()->with('reviews')->get();

        return Inertia::render('Profiles/Services', [
            'user' => $user,
            'services' => $services,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | LISTAR RESEÑAS DEL USUARIO
    |--------------------------------------------------------------------------
    */
    public function reviews(User $user)
    {
        $reviews = $user->reviews()
            ->with('booking', 'service')
            ->latest()
            ->get();

        return Inertia::render('Profiles/Reviews', [
            'user' => $user,
            'reviews' => $reviews,
        ]);
    }
}
