<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('marketplace', function () {
    return Inertia::render('marketplace');
})->name('marketplace');

Route::get('reviews-demo', function () {
    return Inertia::render('reviews-demo');
})->name('reviews.demo');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::patch('bookings/{booking}/status', [BookingController::class, 'updateStatus'])
        ->name('bookings.updateStatus');
    Route::resource('bookings', BookingController::class);
    Route::resource('services', ServiceController::class);
    Route::resource('reviews', ReviewController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
