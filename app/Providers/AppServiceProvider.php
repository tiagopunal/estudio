<?php

namespace App\Providers;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Service;
use App\Policies\BookingPolicy;
use App\Policies\ReviewPolicy;
use App\Policies\ServicePolicy;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

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
        Paginator::useBootstrapFive();

        Gate::policy(Booking::class, BookingPolicy::class);
        Gate::policy(Service::class, ServicePolicy::class);
        Gate::policy(Review::class, ReviewPolicy::class);
    }
}
