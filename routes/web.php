<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

/*
|--------------------------------------------------------------------------
| PÁGINAS PÚBLICAS
|--------------------------------------------------------------------------
*/

// Buscar servicios
Route::get('services/browse', [ServiceController::class, 'search'])->name('services.browse');

// Ver perfil público
Route::get('profiles/{user}', [ProfileController::class, 'show'])->name('profiles.show');
Route::get('profiles/{user}/services', [ProfileController::class, 'services'])->name('profiles.services');
Route::get('profiles/{user}/reviews', [ProfileController::class, 'reviews'])->name('profiles.reviews');

// Ver detalle de servicio
Route::get('services/{service}', [ServiceController::class, 'show'])->name('services.show');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | BOOKINGS - RESERVAS
    |--------------------------------------------------------------------------
    */
    Route::resource('bookings', BookingController::class);
    Route::patch('bookings/{booking}/status', [BookingController::class, 'updateStatus'])
        ->name('bookings.updateStatus');

    /*
    |--------------------------------------------------------------------------
    | SERVICES - SERVICIOS DEL USUARIO
    |--------------------------------------------------------------------------
    */
    Route::resource('services', ServiceController::class);

    /*
    |--------------------------------------------------------------------------
    | PROFILE - MI PERFIL
    |--------------------------------------------------------------------------
    */
    Route::get('profile/my-profile', [ProfileController::class, 'myProfile'])->name('profile.my-profile');
    Route::put('profile/my-profile', [ProfileController::class, 'updateProfile'])->name('profile.updateProfile');

    /*
    |--------------------------------------------------------------------------
    | REVIEWS - RESEÑAS
    |--------------------------------------------------------------------------
    */
    Route::resource('reviews', ReviewController::class)->only(['show', 'edit', 'update', 'destroy']);
    Route::get('bookings/{booking}/reviews/create', [ReviewController::class, 'create'])->name('reviews.create');
    Route::post('bookings/{booking}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
