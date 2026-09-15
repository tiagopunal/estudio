<?php

namespace Tests\Feature\Payments;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class PaymentRulesTest extends TestCase
{
    use RefreshDatabase;

    public function test_booking_creates_a_pending_payment_with_historical_price_and_release_date(): void
    {
        [$customer, , $service] = $this->participants();

        $this->actingAs($customer)->post('/bookings', [
            'service_id' => $service->id,
            'date' => now()->addDay()->format('Y-m-d\TH:i'),
            'amount' => '25.00',
        ])->assertRedirect();

        $payment = Payment::firstOrFail();
        $this->assertSame('pending', $payment->status);
        $this->assertSame('100.00', $payment->service_price);
        $this->assertSame('25.00', $payment->amount);
        $this->assertNotNull($payment->release_at);
        $this->assertDatabaseCount('payments', 1);
    }

    public function test_only_a_held_payment_can_be_confirmed(): void
    {
        [$customer, $professional, $service] = $this->participants();
        $booking = $this->booking($customer, $service);

        $this->actingAs($professional)
            ->patch("/bookings/{$booking->id}/status", ['status' => 'confirmed'])
            ->assertSessionHasErrors('status');

        $this->actingAs($customer)
            ->post("/bookings/{$booking->id}/payment/approve")
            ->assertRedirect();

        $this->actingAs($professional)
            ->patch("/bookings/{$booking->id}/status", ['status' => 'confirmed'])
            ->assertRedirect();

        $this->assertDatabaseHas('payments', ['booking_id' => $booking->id, 'status' => 'held']);
    }

    public function test_rejecting_or_customer_cancelling_refunds_pending_or_held_payment(): void
    {
        [$customer, $professional, $service] = $this->participants();
        $pending = $this->booking($customer, $service);

        $this->actingAs($professional)
            ->patch("/bookings/{$pending->id}/status", ['status' => 'cancelled'])
            ->assertRedirect();

        $this->assertDatabaseHas('payments', [
            'booking_id' => $pending->id,
            'status' => 'refunded',
        ]);
        $this->assertNotNull(Payment::where('booking_id', $pending->id)->firstOrFail()->refunded_at);

        $confirmed = $this->booking($customer, $service, 'confirmed', now()->addHours(25));
        $this->actingAs($customer)
            ->patch("/bookings/{$confirmed->id}/status", ['status' => 'cancelled'])
            ->assertRedirect();

        $this->assertDatabaseHas('payments', [
            'booking_id' => $confirmed->id,
            'status' => 'refunded',
        ]);
    }

    public function test_customer_can_release_only_after_completion_and_release_is_idempotent(): void
    {
        [$customer, , $service] = $this->participants();
        $booking = $this->booking($customer, $service, 'completed');

        $this->actingAs($customer)
            ->post("/bookings/{$booking->id}/payment/release")
            ->assertRedirect();

        $payment = Payment::where('booking_id', $booking->id)->firstOrFail();
        $this->assertSame('released', $payment->status);
        $this->assertSame('customer_confirmed_completion', $payment->release_reason);
        $releasedAt = $payment->released_at;

        $this->actingAs($customer)
            ->post("/bookings/{$booking->id}/payment/release")
            ->assertSessionHasErrors('payment');

        $this->assertTrue($releasedAt->equalTo($payment->fresh()->released_at));
    }

    public function test_professional_can_view_but_cannot_approve_or_release_and_stranger_is_forbidden(): void
    {
        [$customer, $professional, $service] = $this->participants();
        $booking = $this->booking($customer, $service);
        $stranger = User::factory()->create();

        $this->actingAs($professional)
            ->post("/bookings/{$booking->id}/payment/approve")
            ->assertForbidden();
        $this->actingAs($professional)
            ->post("/bookings/{$booking->id}/payment/release")
            ->assertForbidden();
        $this->actingAs($stranger)
            ->post("/bookings/{$booking->id}/payment/approve")
            ->assertForbidden();
        $this->actingAs($stranger)
            ->get("/bookings/{$booking->id}")
            ->assertForbidden();
    }

    public function test_automatic_release_uses_only_due_held_payments(): void
    {
        [$customer, , $service] = $this->participants();
        $due = $this->booking($customer, $service, 'confirmed');
        $due->payment->update(['release_at' => now()->subMinute()]);
        $future = $this->booking($customer, $service, 'confirmed', now()->addDay());
        $future->payment->update(['release_at' => now()->addDay()]);

        $this->artisan('payments:release-due')->assertExitCode(0);

        $this->assertDatabaseHas('payments', [
            'booking_id' => $due->id,
            'status' => 'released',
            'release_reason' => 'automatic_60_day_expiration',
        ]);
        $this->assertDatabaseHas('payments', ['booking_id' => $future->id, 'status' => 'held']);
    }

    public function test_final_payment_states_cannot_be_released_or_refunded(): void
    {
        [$customer, , $service] = $this->participants();
        $booking = $this->booking($customer, $service);

        foreach (['released', 'refunded', 'failed'] as $status) {
            $payment = $booking->payment;
            $payment->update(['status' => $status]);
            $payment->release('should_not_change');
            $payment->refund();
            $this->assertSame($status, $payment->fresh()->status);
        }
    }

    private function participants(): array
    {
        $customer = User::factory()->create();
        $professional = User::factory()->professional()->create();
        $service = Service::create([
            'user_id' => $professional->id,
            'title' => 'Servicio de prueba',
            'description' => 'Descripción',
            'price' => '100.00',
            'category' => 'Prueba',
            'status' => 'active',
        ]);

        return [$customer, $professional, $service];
    }

    private function booking(User $customer, Service $service, string $status = 'pending', mixed $date = null): Booking
    {
        $booking = Booking::create([
            'user_id' => $customer->id,
            'service_id' => $service->id,
            'date' => $date ?? now()->addDays(4),
            'status' => $status,
        ]);

        $booking->payment()->create([
            'customer_id' => $customer->id,
            'service_price' => '100.00',
            'amount' => '100.00',
            'currency' => 'ARS',
            'status' => in_array($status, ['confirmed', 'completed'], true) ? 'held' : 'pending',
            'held_at' => in_array($status, ['confirmed', 'completed'], true) ? now() : null,
            'release_at' => now()->addDays(60),
        ]);

        return $booking->load('payment');
    }
}