<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Http\Requests\UpdateMarketplaceProfileRequest;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(User $user): Response
    {
        $user->load([
            'profile',
            'services' => fn ($query) => $query
                ->where('status', 'active')
                ->withCount('reviews')
                ->latest(),
        ]);

        $receivedReviews = Review::query()
            ->whereHas('service', fn ($query) => $query->where('user_id', $user->id))
            ->with(['user', 'service'])
            ->latest()
            ->get();

        return Inertia::render('Profiles/Show', [
            'profile' => $user,
            'receivedReviews' => $receivedReviews,
        ]);
    }

    public function edit(Request $request): Response
    {
        return Inertia::render('Profiles/Edit', [
            'profile' => $request->user()->load('profile'),
        ]);
    }

    public function update(UpdateMarketplaceProfileRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->safe()->except('avatar');

        if ($request->hasFile('avatar')) {
            if ($user->profile?->avatar) {
                Storage::disk('public')->delete($user->profile->avatar);
            }

            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->profile()->updateOrCreate(['user_id' => $user->id], $validated);

        return to_route('marketplace-profile.edit')
            ->with('success', 'Perfil actualizado correctamente.');
    }

    public function upgradeToProfessional(Request $request): RedirectResponse
    {
        $user = $request->user()->load('profile');

        if ($user->isProfessional()) {
            return back()->with('success', 'Tu cuenta ya es profesional.');
        }

        $profile = $user->profile;
        $missing = collect([
            'description' => 'descripción',
            'phone' => 'teléfono',
            'location' => 'ubicación',
            'profession' => 'profesión',
            'skills' => 'habilidades',
        ])->filter(fn ($label, $field) => blank($profile?->{$field}));

        if ($missing->isNotEmpty()) {
            throw ValidationException::withMessages([
                'professional' => 'Completá estos datos antes de activar el perfil profesional: '.$missing->implode(', ').'.',
            ]);
        }

        $user->update(['role' => Role::PROFESSIONAL]);

        return back()->with('success', 'Tu perfil profesional fue activado correctamente.');
    }

    public function services(User $user): Response
    {
        return Inertia::render('Profiles/Services', [
            'user' => $user->load('profile'),
            'services' => $user->services()
                ->where('status', 'active')
                ->withCount('reviews')
                ->withAvg('reviews', 'rating')
                ->latest()
                ->get(),
        ]);
    }

    public function reviews(User $user): Response
    {
        $reviews = Review::query()
            ->whereHas('service', fn ($query) => $query->where('user_id', $user->id))
            ->with(['user', 'service', 'booking'])
            ->latest()
            ->get();

        return Inertia::render('Profiles/Reviews', [
            'user' => $user->load('profile'),
            'reviews' => $reviews,
        ]);
    }
}
