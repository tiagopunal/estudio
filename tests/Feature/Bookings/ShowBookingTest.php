<?php

namespace Tests\Feature\Bookings;

use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

        $response->assertStatus(200);

        $this->actingAs($professional)
            ->get("/bookings/{$booking->id}")
            ->assertOk();
    }
}
