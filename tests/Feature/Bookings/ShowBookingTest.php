<?php

namespace Tests\Feature\Bookings;

use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ShowBookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_their_booking(): void
    {
        $customer = User::factory()->create();
        $professional = User::factory()->create();

        $service = Service::create([
            'user_id' => $professional->id,
            'title' => 'Corte de pelo express',
            'description' => 'Servicio de prueba para reservas',
            'price' => 25000,
            'category' => 'Belleza',
            'location' => 'Centro, Córdoba',
            'latitude' => -33.45,
            'longitude' => -70.66,
            'average_rating' => 4.8,
        ]);

        $booking = Booking::create([
            'user_id' => $customer->id,
            'service_id' => $service->id,
            'date' => now()->addDay()->format('Y-m-d H:i'),
            'status' => 'pending',
        ]);

        $this->actingAs($customer);

        $response = $this->get("/bookings/{$booking->id}");

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Bookings/Show')
                ->where('booking.service.location', 'Centro, Córdoba')
                ->where('booking.service.latitude', '-33.4500000')
                ->where('booking.service.longitude', '-70.6600000'));
    }
}
