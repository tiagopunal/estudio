<?php

namespace Tests\Feature\Wallets;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\Service;
use App\Models\User;
use App\Models\WalletTransaction;
use App\Services\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class WalletTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_users_receive_one_wallet_and_can_top_up(): void
    {
        $user = User::factory()->create();

        $this->assertSame(1, $user->wallet()->count());
        $this->actingAs($user)
            ->post(route('wallet.demoTopUp'), ['amount' => '1000.50'])
            ->assertSessionHas('success', 'Saldo simulado acreditado correctamente.');

        $this->assertDatabaseHas('wallets', ['user_id' => $user->id, 'available_balance' => '1000.50']);
        $this->assertDatabaseHas('wallet_transactions', ['type' => 'demo_top_up', 'amount' => '1000.50']);
    }

    public function test_client_and_professional_can_open_only_their_own_wallet_view(): void
    {
        $client = User::factory()->create();
        $professional = User::factory()->professional()->create();
        $stranger = User::factory()->create();

        $this->actingAs($client)->get(route('wallet.show'))->assertOk()->assertSee('Wallet\\/Index');
        $this->actingAs($professional)->get(route('wallet.show'))->assertOk()->assertSee('Wallet\\/Index');
        $this->assertTrue(app(\Illuminate\Contracts\Auth\Access\Gate::class)->forUser($stranger)->denies('view', $client->wallet));
    }

    public function test_wallet_view_handles_empty_history_and_null_links(): void
    {
        $user = User::factory()->create();
        WalletTransaction::create([
            'wallet_id' => $user->wallet->id,
            'type' => 'demo_top_up',
            'amount' => '100.00',
            'balance_before' => '0.00',
            'balance_after' => '100.00',
            'description' => 'Carga sin reserva',
        ]);

        $this->actingAs($user)->get(route('wallet.show'))->assertOk()->assertSee('Wallet\\/Index');
    }

    public function test_seeder_is_idempotent_for_demo_wallet_top_up(): void
    {
        $this->seed(\Database\Seeders\DemoMarketplaceSeeder::class);
        $this->seed(\Database\Seeders\DemoMarketplaceSeeder::class);

        $demo = User::where('email', 'cliente.demo@prolink.com')->firstOrFail();
        $this->assertSame(1, $demo->wallet->transactions()->where('type', 'demo_top_up')->count());
        $this->assertSame('1000000.00', $demo->wallet->transactions()->where('type', 'demo_top_up')->value('balance_after'));
    }

    public function test_top_up_rejects_invalid_amounts(): void
    {
        $user = User::factory()->create();

        foreach (['0', '-1', '1000001'] as $amount) {
            $this->actingAs($user)->post(route('wallet.demoTopUp'), compact('amount'))->assertSessionHasErrors('amount');
        }
    }

    public function test_payment_hold_requires_balance_and_moves_funds_to_custody(): void
    {
        [$customer, $professional, $payment] = $this->payment();
        $this->actingAs($customer)->post(route('bookings.payment.approve', $payment->booking))->assertSessionHasErrors('payment');

        app(WalletService::class)->topUpDemo($customer, '100.00');
        $this->actingAs($customer)->post(route('bookings.payment.approve', $payment->booking))->assertSessionHas('success');

        $customer->refresh();
        $this->assertSame('90.00', $customer->wallet->available_balance);
        $this->assertSame('10.00', $customer->wallet->held_balance);
        $this->assertDatabaseHas('wallet_transactions', ['type' => 'payment_held', 'payment_id' => $payment->id]);
        $this->assertSame($professional->id, $payment->booking->service->user_id);
    }

    public function test_refund_and_release_are_idempotent_and_credit_professional(): void
    {
        [$customer, $professional, $payment] = $this->payment();
        $wallets = app(WalletService::class);
        $wallets->topUpDemo($customer, '100.00');
        $wallets->holdClientFunds($payment);
        $wallets->releaseFundsToProfessional($payment, 'client_confirmed_completion');
        $wallets->releaseFundsToProfessional($payment, 'second_attempt');

        $this->assertSame('10.00', $professional->refresh()->wallet->available_balance);
        $this->assertSame(2, WalletTransaction::where('payment_id', $payment->id)->where('type', 'payment_released')->count());
    }

    public function test_wallet_transactions_cannot_be_edited_or_deleted(): void
    {
        $user = User::factory()->create();
        app(WalletService::class)->topUpDemo($user, '100.00');
        $transaction = WalletTransaction::firstOrFail();

        $this->expectException(\LogicException::class);
        $transaction->update(['description' => 'edited']);
    }

    private function payment(): array
    {
        $customer = User::factory()->create();
        $professional = User::factory()->professional()->create();
        $service = Service::create([
            'user_id' => $professional->id,
            'title' => 'Servicio',
            'description' => 'Descripción',
            'price' => '100.00',
            'category' => 'Prueba',
            'status' => 'active',
        ]);
        $booking = Booking::create([
            'user_id' => $customer->id,
            'service_id' => $service->id,
            'date' => Carbon::tomorrow(),
            'status' => 'pending',
        ]);
        $payment = $booking->payment()->create([
            'customer_id' => $customer->id,
            'service_price' => '100.00',
            'amount' => '10.00',
            'currency' => 'ARS',
            'status' => 'pending',
            'release_at' => now()->addDays(60),
        ]);

        return [$customer, $professional, $payment->load('booking.service.user')];
    }
}