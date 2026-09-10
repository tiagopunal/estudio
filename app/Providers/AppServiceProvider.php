<?php

namespace App\Providers;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Service;
use App\Policies\BookingPolicy;
use App\Policies\ReviewPolicy;
use App\Policies\ServicePolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Password::defaults(fn () => Password::min(8)->mixedCase()->numbers());

        RateLimiter::for('geocoding', fn () => Limit::perSecond(1)->by('geocoding-provider'));

        // Usar Bootstrap para pagination
        Paginator::useBootstrapFive();

        // Registrar Policies
        $this->registerPolicies();
    }

    /**
     * Registrar Policies para autorización
     */
    protected function registerPolicies(): void
    {
        \Gate::policy(Booking::class, BookingPolicy::class);
        \Gate::policy(Service::class, ServicePolicy::class);
        \Gate::policy(Review::class, ReviewPolicy::class);
    }
}
