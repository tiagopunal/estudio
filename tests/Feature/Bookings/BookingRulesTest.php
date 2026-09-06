<?php

namespace Tests\Feature\Bookings;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingRulesTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_professional_cannot_create_a_booking(): void
    {
        $professional = User::factory()->professional()->create();
        $service = $this->serviceFor(User::factory()->professional()->create());

        $this->actingAs($professional)
            ->post('/bookings', $this->payload($service))
            ->assertSessionHasErrors('service_id');

        $this->assertDatabaseCount('bookings', 0);
    }

    public function test_a_paused_service_cannot_be_booked(): void
    {
        $customer = User::factory()->create();
        $service = $this->serviceFor(User::factory()->professional()->create(), 'paused');

        $this->actingAs($customer)
            ->post('/bookings', $this->payload($service))
            ->assertSessionHasErrors('service_id');
    }

    public function test_a_customer_cannot_book_their_own_service(): void
    {
        $customer = User::factory()->create();
        $service = $this->serviceFor($customer);

        $this->actingAs($customer)
            ->post('/bookings', $this->payload($service))
            ->assertSessionHasErrors('service_id');

        $this->assertDatabaseCount('bookings', 0);
    }

    public function test_pending_and_confirmed_bookings_block_the_same_schedule(): void
    {
        $customer = User::factory()->create();
        $otherCustomer = User::factory()->create();
        $service = $this->serviceFor(User::factory()->professional()->create());
        $date = now()->addDays(3)->format('Y-m-d H:i');

        Booking::create(['user_id' => $customer->id, 'service_id' => $service->id, 'date' => $date, 'status' => 'pending']);

        $this->actingAs($otherCustomer)
            ->post('/bookings', ['service_id' => $service->id, 'date' => $date])
            ->assertSessionHasErrors('date');

        Booking::query()->update(['status' => 'confirmed']);

        $this->actingAs($otherCustomer)
            ->post('/bookings', ['service_id' => $service->id, 'date' => $date])
            ->assertSessionHasErrors('date');
    }

    public function test_a_cancelled_booking_does_not_block_a_new_booking(): void
    {
        $customer = User::factory()->create();
        $otherCustomer = User::factory()->create();
        $service = $this->serviceFor(User::factory()->professional()->create());
        $date = now()->addDays(3)->format('Y-m-d H:i');

        Booking::create(['user_id' => $customer->id, 'service_id' => $service->id, 'date' => $date, 'status' => 'cancelled']);

        $this->actingAs($otherCustomer)
            ->post('/bookings', ['service_id' => $service->id, 'date' => $date])
            ->assertRedirect();
    }

    public function test_a_completed_booking_does_not_block_a_new_booking(): void
    {
        $customer = User::factory()->create();
        $otherCustomer = User::factory()->create();
        $service = $this->serviceFor(User::factory()->professional()->create());
        $date = now()->addDays(3)->format('Y-m-d H:i');

        Booking::create(['user_id' => $customer->id, 'service_id' => $service->id, 'date' => $date, 'status' => 'completed']);

        $this->actingAs($otherCustomer)
            ->post('/bookings', ['service_id' => $service->id, 'date' => $date])
            ->assertRedirect();
    }

    public function test_only_the_service_owner_can_confirm_reject_and_complete(): void
    {
        $customer = User::factory()->create();
        $professional = User::factory()->professional()->create();
        $service = $this->serviceFor($professional);
        $booking = $this->booking($customer, $service);

        $this->actingAs($customer)->patch("/bookings/{$booking->id}/status", ['status' => 'confirmed'])
            ->assertSessionHasErrors('status');
        $this->actingAs($customer)->patch("/bookings/{$booking->id}/status", ['status' => 'completed'])
            ->assertSessionHasErrors('status');

        $this->actingAs($professional)->patch("/bookings/{$booking->id}/status", ['status' => 'confirmed'])
            ->assertRedirect();

        $this->actingAs($professional)->patch("/bookings/{$booking->id}/status", ['status' => 'completed'])
            ->assertRedirect();
        $this->assertDatabaseHas('bookings', ['id' => $booking->id, 'status' => 'completed']);
    }

    public function test_customer_and_professional_can_cancel_a_pending_booking(): void
    {
        $customer = User::factory()->create();
        $professional = User::factory()->professional()->create();
        $service = $this->serviceFor($professional);

        $booking = $this->booking($customer, $service);
        $this->actingAs($professional)->patch("/bookings/{$booking->id}/status", ['status' => 'cancelled'])
            ->assertRedirect();

        $booking = $this->booking($customer, $service);
        $this->actingAs($customer)->patch("/bookings/{$booking->id}/status", ['status' => 'cancelled'])
            ->assertRedirect();
    }

    public function test_final_booking_states_cannot_be_changed_and_professional_cannot_cancel_confirmed(): void
    {
        $customer = User::factory()->create();
        $professional = User::factory()->professional()->create();
        $service = $this->serviceFor($professional);

        $confirmed = $this->booking($customer, $service, 'confirmed', now()->addHours(23));
        $this->actingAs($professional)->patch("/bookings/{$confirmed->id}/status", ['status' => 'cancelled'])
            ->assertSessionHasErrors('status');

        foreach (['cancelled', 'completed'] as $status) {
            $final = $this->booking($customer, $service, $status);
            $this->actingAs($professional)->patch("/bookings/{$final->id}/status", ['status' => 'confirmed'])
                ->assertSessionHasErrors('status');
        }
    }

    public function test_customer_can_cancel_a_confirmed_booking_only_before_the_24_hour_limit(): void
    {
        $customer = User::factory()->create();
        $professional = User::factory()->professional()->create();
        $service = $this->serviceFor($professional);

        $allowed = $this->booking($customer, $service, 'confirmed', now()->addHours(25));
        $this->actingAs($customer)->patch("/bookings/{$allowed->id}/status", ['status' => 'cancelled'])
            ->assertRedirect();

        $blocked = $this->booking($customer, $service, 'confirmed', now()->addHours(23));
        $this->actingAs($customer)->patch("/bookings/{$blocked->id}/status", ['status' => 'cancelled'])
            ->assertSessionHasErrors('status');
    }

    public function test_another_user_cannot_view_or_update_a_booking(): void
    {
        $customer = User::factory()->create();
        $professional = User::factory()->professional()->create();
        $service = $this->serviceFor($professional);
        $booking = $this->booking($customer, $service);
        $stranger = User::factory()->create();

        $this->actingAs($stranger)->get("/bookings/{$booking->id}")->assertForbidden();
        $this->actingAs($stranger)->patch("/bookings/{$booking->id}/status", ['status' => 'cancelled'])
            ->assertForbidden();
    }

    public function test_only_completed_bookings_can_be_reviewed_once(): void
    {
        $customer = User::factory()->create();
        $professional = User::factory()->professional()->create();
        $service = $this->serviceFor($professional);
        $pending = $this->booking($customer, $service, 'pending');
        $confirmed = $this->booking($customer, $service, 'confirmed');
        $cancelled = $this->booking($customer, $service, 'cancelled');

        $this->actingAs($customer)->get("/bookings/{$pending->id}/reviews/create")->assertForbidden();
        $this->actingAs($customer)->get("/bookings/{$confirmed->id}/reviews/create")->assertForbidden();
        $this->actingAs($customer)->get("/bookings/{$cancelled->id}/reviews/create")->assertForbidden();

        $completed = $this->booking($customer, $service, 'completed');
        $this->actingAs($customer)->get("/bookings/{$completed->id}/reviews/create")->assertOk();
        $payload = ['booking_id' => $completed->id, 'rating' => 5, 'comment' => 'Excelente'];

        $this->post('/reviews', $payload)->assertRedirect();
        $this->post('/reviews', $payload)->assertSessionHas('error');
        $this->assertDatabaseHas('reviews', [
            'user_id' => $customer->id,
            'service_id' => $service->id,
            'booking_id' => $completed->id,
        ]);
        $this->assertDatabaseCount('reviews', 1);
    }

    private function serviceFor(User $professional, string $status = 'active'): Service
    {
        return Service::create([
            'user_id' => $professional->id,
            'title' => 'Servicio de prueba',
            'description' => 'Descripción',
            'price' => 100,
            'category' => 'Prueba',
            'status' => $status,
        ]);
    }

    private function booking(User $customer, Service $service, string $status = 'pending', mixed $date = null): Booking
    {
        return Booking::create([
            'user_id' => $customer->id,
            'service_id' => $service->id,
            'date' => $date ?? now()->addDays(4),
            'status' => $status,
        ]);
    }

    private function payload(Service $service): array
    {
        return [
            'service_id' => $service->id,
            'date' => now()->addDays(3)->format('Y-m-d\TH:i'),
        ];
    }
}