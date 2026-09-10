<?php

namespace Tests\Feature\Geocoding;

use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GeocodingSearchTest extends TestCase
{
    public function test_it_searches_only_argentine_addresses_and_normalizes_the_response(): void
    {
        Http::fake([
            '*' => Http::response([
                [
                    'place_id' => 123,
                    'display_name' => 'Avenida Colón 100, Córdoba, Argentina',
                    'lat' => '-31.4123456',
                    'lon' => '-64.1876543',
                    'unused' => 'not exposed',
                ],
            ]),
        ]);

        $this->getJson('/api/geocoding/search?q=Avenida%20Colon%20100%20Cordoba')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.0.place_id', 123)
            ->assertJsonPath('data.0.lat', '-31.4123456')
            ->assertJsonMissingPath('data.0.unused');

        Http::assertSent(fn (Request $request) => $request['countrycodes'] === 'ar'
            && $request['format'] === 'jsonv2'
            && $request['limit'] === 5);
    }

    public function test_it_validates_short_or_missing_queries_without_contacting_the_provider(): void
    {
        Http::fake();

        $this->getJson('/api/geocoding/search?q=ab')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('q');

        Http::assertNothingSent();
    }

    public function test_it_returns_a_controlled_error_when_the_provider_fails(): void
    {
        Http::fake(['*' => Http::response([], 500)]);

        $this->getJson('/api/geocoding/search?q=Direccion%20inexistente')
            ->assertStatus(503)
            ->assertJson([
                'success' => false,
                'message' => 'El buscador de direcciones no está disponible en este momento.',
                'data' => [],
            ]);
    }
}
