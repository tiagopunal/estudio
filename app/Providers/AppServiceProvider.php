<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Pagination\Paginator;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Review;
use App\Policies\BookingPolicy;
use App\Policies\ServicePolicy;
use App\Policies\ReviewPolicy;

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
