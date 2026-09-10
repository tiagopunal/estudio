<?php

namespace Tests\Feature\Users;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RolesAndProfilesTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_users_are_clients_and_receive_a_profile_automatically(): void
    {
        $response = $this->post('/register', [
            'name' => 'Thiago Alonso',
            'email' => 'thiago@example.com',
            'password' => 'Password1',
            'password_confirmation' => 'Password1',
            'role' => 'professional',
        ]);

        $response->assertRedirect('/dashboard');

        $user = User::where('email', 'thiago@example.com')->firstOrFail();
        $this->assertSame('client', $user->role);
        $this->assertSame('Thiago Alonso', $user->profile->full_name);
    }

    public function test_guests_cannot_edit_a_marketplace_profile(): void
    {
        $this->get('/my-profile')->assertRedirect('/login');
    }

    public function test_user_can_update_their_marketplace_profile(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/my-profile', [
            'full_name' => 'Thiago A. Alonso',
            'description' => 'Especialista en servicios locales.',
            'phone' => '+54 11 5555-1234',
            'location' => 'Buenos Aires',
            'profession' => 'Electricista',
            'experience_years' => 4,
            'skills' => 'Instalaciones, mantenimiento',
            'latitude' => -34.6037,
            'longitude' => -58.3816,
        ]);

        $response->assertSessionHasNoErrors()->assertRedirect('/my-profile');
        $this->assertDatabaseHas('profiles', [
            'user_id' => $user->id,
            'full_name' => 'Thiago A. Alonso',
            'profession' => 'Electricista',
            'experience_years' => 4,
            'latitude' => -34.6037,
            'longitude' => -58.3816,
        ]);
    }

    public function test_incomplete_profile_cannot_become_professional(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->patch('/my-profile/professional');

        $response->assertSessionHasErrors('professional');
        $this->assertSame('client', $user->refresh()->role);
    }

    public function test_complete_profile_can_become_professional(): void
    {
        $user = User::factory()->create();
        $user->profile->update([
            'description' => 'Profesional con experiencia.',
            'phone' => '+54 11 5555-1234',
            'location' => 'Buenos Aires',
            'profession' => 'Plomero',
            'skills' => 'Instalaciones y reparaciones',
        ]);

        $response = $this->actingAs($user)->patch('/my-profile/professional');

        $response->assertSessionHasNoErrors();
        $this->assertSame('professional', $user->refresh()->role);
    }

    public function test_client_cannot_access_service_creation_or_publish_a_service(): void
    {
        $client = User::factory()->create();

        $this->actingAs($client)->get('/services/create')->assertForbidden();
        $this->actingAs($client)->post('/services', [
            'title' => 'Servicio no autorizado',
            'description' => 'Este servicio no debería poder ser creado por un cliente.',
            'price' => 100,
            'category' => 'Hogar',
        ])->assertForbidden();

        $this->assertDatabaseCount('services', 0);
    }

    public function test_professional_can_publish_a_service(): void
    {
        $professional = User::factory()->professional()->create();

        $response = $this->actingAs($professional)->post('/services', [
            'title' => 'Reparaciones del hogar',
            'description' => 'Servicio profesional de reparaciones.',
            'price' => 15000,
            'category' => 'Hogar',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('services', [
            'user_id' => $professional->id,
            'title' => 'Reparaciones del hogar',
        ]);
    }

    public function test_marketplace_profile_is_public(): void
    {
        $professional = User::factory()->professional()->create();

        $this->get("/profiles/{$professional->id}")->assertOk();
    }

    public function test_public_professional_services_page_exposes_numeric_safe_service_data(): void
    {
        $professional = User::factory()->professional()->create();
        $service = $professional->services()->create([
            'title' => 'Electricidad domiciliaria',
            'description' => 'Instalaciones y reparaciones eléctricas.',
            'price' => 85000,
            'category' => 'Electricidad',
            'location' => 'Córdoba, Argentina',
            'status' => 'active',
        ]);

        $this->get("/profiles/{$professional->id}/services")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Profiles/Services')
                ->where('services.0.id', $service->id)
                ->where('services.0.reviews_count', 0)
                ->where('services.0.reviews_avg_rating', null));
    }
}
