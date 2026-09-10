<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GeocodingController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:3', 'max:160'],
        ]);
        $query = trim($validated['q']);
        $cacheKey = 'geocoding:ar:'.sha1(Str::lower($query));

        try {
            $results = Cache::remember($cacheKey, now()->addDay(), function () use ($query) {
                $response = Http::acceptJson()
                    ->withHeaders([
                        'User-Agent' => config('services.geocoding.user_agent'),
                        'Accept-Language' => 'es-AR,es;q=0.9',
                    ])
                    ->connectTimeout(3)
                    ->timeout(8)
                    ->get(config('services.geocoding.search_url'), [
                        'q' => $query,
                        'format' => 'jsonv2',
                        'addressdetails' => 1,
                        'limit' => 5,
                        'countrycodes' => 'ar',
                    ])
                    ->throw();

                return collect($response->json())
                    ->take(5)
                    ->map(fn (array $place) => [
                        'place_id' => $place['place_id'],
                        'display_name' => Str::limit($place['display_name'], 255, ''),
                        'lat' => $place['lat'],
                        'lon' => $place['lon'],
                    ])
                    ->values()
                    ->all();
            });
        } catch (\Throwable $exception) {
            report($exception);

            return response()->json([
                'success' => false,
                'message' => 'El buscador de direcciones no está disponible en este momento.',
                'data' => [],
            ], 503);
        }

        return response()->json([
            'success' => true,
            'message' => $results ? 'Direcciones encontradas.' : 'No se encontraron coincidencias.',
            'data' => $results,
        ]);
    }
}
