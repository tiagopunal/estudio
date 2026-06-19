<?php

namespace Tests\Feature\Services;

use App\Enums\Role;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_services(): void
    {
        $this->get('/services')->assertRedirect('/login');
    }

    public function test_professional_can_create_a_service_associated_to_their_user(): void
    {
        $professional = User::factory()->create(['role' => Role::PROFESSIONAL]);

        $this->actingAs($professional)
            ->post('/services', $this->validPayload())
            ->assertRedirect();

        $this->assertDatabaseHas('services', [
            'user_id' => $professional->id,
            'title' => 'Instalacion electrica',
            'category' => 'Electricidad',
        ]);
    }

    public function test_client_cannot_create_services(): void
    {
        $client = User::factory()->create(['role' => Role::CLIENT]);

        $this->actingAs($client)
            ->post('/services', $this->validPayload())
            ->assertForbidden();

        $this->assertDatabaseCount('services', 0);
    }

    public function test_only_owner_can_update_a_service(): void
    {
        $owner = User::factory()->create(['role' => Role::PROFESSIONAL]);
        $other = User::factory()->create(['role' => Role::PROFESSIONAL]);
        $service = $this->createService($owner);

        $this->actingAs($other)
            ->put("/services/{$service->id}", $this->validPayload(['title' => 'Cambio rechazado']))
            ->assertForbidden();

        $this->actingAs($owner)
            ->put("/services/{$service->id}", $this->validPayload(['title' => 'Cambio aceptado']))
            ->assertRedirect(route('services.show', $service));

        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'title' => 'Cambio aceptado',
        ]);
    }

    public function test_only_owner_can_delete_a_service(): void
    {
        $owner = User::factory()->create(['role' => Role::PROFESSIONAL]);
        $other = User::factory()->create(['role' => Role::PROFESSIONAL]);
        $service = $this->createService($owner);

        $this->actingAs($other)
            ->delete("/services/{$service->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('services', ['id' => $service->id]);

        $this->actingAs($owner)
            ->delete("/services/{$service->id}")
            ->assertRedirect(route('services.index'));

        $this->assertDatabaseMissing('services', ['id' => $service->id]);
    }

    public function test_services_can_be_filtered_by_search_and_category(): void
    {
        $professional = User::factory()->create(['role' => Role::PROFESSIONAL]);
        $this->createService($professional, ['title' => 'Plomeria urgente', 'category' => 'Plomeria']);
        $this->createService($professional, ['title' => 'Pintura interior', 'category' => 'Pintura']);

        $this->actingAs(User::factory()->create())
            ->get('/services?search=urgente&category=Plomeria')
            ->assertOk()
            ->assertSee('Plomeria urgente')
            ->assertDontSee('Pintura interior');
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Instalacion electrica',
            'description' => 'Revision y reparacion de instalaciones domiciliarias.',
            'price' => 15000,
            'category' => 'Electricidad',
            'latitude' => -34.603722,
            'longitude' => -58.381592,
        ], $overrides);
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function createService(User $user, array $overrides = []): Service
    {
        return Service::create(array_merge($this->validPayload(), [
            'user_id' => $user->id,
        ], $overrides));
    }
}
