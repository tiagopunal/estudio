<?php

use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('reviews/service/{service}', [ReviewController::class, 'serviceReviews'])
    ->name('reviews.service');

Route::get('reviews', [ReviewController::class, 'index'])
    ->name('reviews.index');

Route::middleware(['auth'])->group(function () {
    Route::get('reviews/create', [ReviewController::class, 'create'])
        ->name('reviews.create');

    Route::post('reviews', [ReviewController::class, 'store'])
        ->name('reviews.store');

    Route::get('reviews/{review}/edit', [ReviewController::class, 'edit'])
        ->name('reviews.edit');

    Route::put('reviews/{review}', [ReviewController::class, 'update'])
        ->name('reviews.update');

    Route::delete('reviews/{review}', [ReviewController::class, 'destroy'])
        ->name('reviews.destroy');

    Route::get('reviews/user/me', [ReviewController::class, 'userReviews'])
        ->name('reviews.user');
});

Route::get('reviews/{review}', [ReviewController::class, 'show'])
    ->name('reviews.show');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
