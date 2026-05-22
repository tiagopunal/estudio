<?php

use Illuminate\Support\Facades\Route;
use App\Support\ApiResponse;

/*
|--------------------------------------------------------------------------
| API GLOBAL STRUCTURE
|--------------------------------------------------------------------------
| Organización oficial del backend del equipo
*/

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    // Thiago Alonso
});

/*
|--------------------------------------------------------------------------
| PROFILE
|--------------------------------------------------------------------------
*/
Route::prefix('profile')->group(function () {
    // Thiago Alonso
});

/*
|--------------------------------------------------------------------------
| SERVICES
|--------------------------------------------------------------------------
*/
Route::prefix('services')->group(function () {
    // Rodrigo Lopez
});

/*
|--------------------------------------------------------------------------
| BOOKINGS
|--------------------------------------------------------------------------
*/
Route::prefix('bookings')->group(function () {
    // Tati
});

/*
|--------------------------------------------------------------------------
| REVIEWS
|--------------------------------------------------------------------------
*/
Route::prefix('reviews')->group(function () {
    // Tiago
    // Endpoints públicos
    Route::get('/', [\App\Http\Controllers\ReviewController::class, 'index']);
    Route::get('/service/{serviceId}', [\App\Http\Controllers\ReviewController::class, 'serviceReviews']);
    Route::get('/{id}', [\App\Http\Controllers\ReviewController::class, 'show']);

    // Endpoints protegidos (requieren autenticación)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [\App\Http\Controllers\ReviewController::class, 'store']);
        Route::put('/{id}', [\App\Http\Controllers\ReviewController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\ReviewController::class, 'destroy']);
        Route::get('/user/me', [\App\Http\Controllers\ReviewController::class, 'userReviews']);
    });
});

/*
|--------------------------------------------------------------------------
| TEST GLOBAL (NO TOCAR)
|--------------------------------------------------------------------------
*/
Route::get('/test', function () {
    return ApiResponse::success(
        null,
        "API funcionando correctamente"
    );
});