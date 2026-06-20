<?php

namespace Tests\Feature\Bookings;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateBookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_a_booking_from_a_datetime_local_input()
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

        $this->actingAs($customer);

        $payload = [
            'service_id' => $service->id,
            'date' => now()->addDay()->format('Y-m-d\TH:i'),
        ];

        $response = $this->post('/bookings', $payload);

        $response->assertRedirect();
        $this->assertDatabaseHas('bookings', [
            'user_id' => $customer->id,
            'service_id' => $service->id,
            'status' => 'pending',
        ]);
    }
}
