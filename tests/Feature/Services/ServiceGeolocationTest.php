<?php

namespace Tests\Feature\Services;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ServiceGeolocationTest extends TestCase
{
    use RefreshDatabase;

    public function test_marketplace_filters_services_by_distance(): void
    {
        $professional = User::factory()->professional()->create();

        Service::create([
            'user_id' => $professional->id,
            'title' => 'Electricista en Buenos Aires',
            'description' => 'Servicio eléctrico profesional en la Ciudad de Buenos Aires.',
            'price' => 30000,
            'category' => 'Electricidad',
            'location' => 'Palermo, Buenos Aires',
            'latitude' => -34.5800,
            'longitude' => -58.4200,
            'status' => 'active',
        ]);

        Service::create([
            'user_id' => $professional->id,
            'title' => 'Electricista en Córdoba',
            'description' => 'Servicio eléctrico profesional en la ciudad de Córdoba.',
            'price' => 32000,
            'category' => 'Electricidad',
            'location' => 'Córdoba Capital',
            'latitude' => -31.4201,
            'longitude' => -64.1888,
            'status' => 'active',
        ]);

        $this->get('/services/browse?latitude=-34.6037&longitude=-58.3816&radius=50')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Services/Browse')
                ->has('services.data', 1)
                ->where('services.data.0.title', 'Electricista en Buenos Aires')
                ->where('services.data.0.location', 'Palermo, Buenos Aires')
                ->where('filters.radius', '50'));
    }

    public function test_geolocation_filter_requires_complete_coordinates_and_radius(): void
    {
        $this->get('/services/browse?latitude=-34.6037&radius=20')
            ->assertSessionHasErrors(['longitude']);
    }
}
