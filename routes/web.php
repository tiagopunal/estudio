<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('marketplace', [ServiceController::class, 'search'])->name('marketplace');

Route::get('reviews-demo', function () {
    return Inertia::render('reviews-demo');
})->name('reviews.demo');

// Rutas públicas de servicios
Route::get('services/browse', [ServiceController::class, 'search'])->name('services.browse');
Route::get('services/{service}', [ServiceController::class, 'show'])->whereNumber('service')->name('services.show');
Route::get('profiles/{user}', [ProfileController::class, 'show'])->whereNumber('user')->name('profiles.show');
Route::get('profiles/{user}/services', [ProfileController::class, 'services'])->whereNumber('user')->name('profiles.services');
Route::get('profiles/{user}/reviews', [ProfileController::class, 'reviews'])->whereNumber('user')->name('profiles.reviews');
Route::get('reviews/service/{service}', [ReviewController::class, 'serviceReviews'])
    ->whereNumber('service')
    ->name('reviews.service');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::patch('bookings/{booking}/status', [BookingController::class, 'updateStatus'])
        ->name('bookings.updateStatus');
    Route::resource('bookings', BookingController::class);
    Route::resource('services', ServiceController::class)->except(['show']);
    Route::get('bookings/{booking}/reviews/create', [ReviewController::class, 'create'])
        ->whereNumber('booking')
        ->name('bookings.reviews.create');
    Route::get('my-reviews', [ReviewController::class, 'userReviews'])->name('reviews.mine');
    Route::resource('reviews', ReviewController::class);
    Route::get('my-profile', [ProfileController::class, 'edit'])->name('marketplace-profile.edit');
    Route::post('my-profile', [ProfileController::class, 'update'])->name('marketplace-profile.update');
    Route::patch('my-profile/professional', [ProfileController::class, 'upgradeToProfessional'])
        ->name('marketplace-profile.upgrade');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
