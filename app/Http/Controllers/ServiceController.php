<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaveServiceRequest;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | LISTAR SERVICIOS DEL USUARIO AUTENTICADO
    |--------------------------------------------------------------------------
    */
    public function index(Request $request)
    {
        $query = Service::with('reviews', 'bookings')->latest();

        if ($request->filled('search') || $request->filled('category')) {
            $query->where('status', 'active');

            if ($request->filled('search')) {
                $search = $request->string('search')->toString();
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%");
                });
            }

            if ($request->filled('category')) {
                $query->where('category', $request->string('category')->toString());
            }
        } else {
            $query->where('user_id', auth()->id());
        }

        $services = $query->get();

        return Inertia::render('Services/Index', [
            'services' => $services,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | MOSTRAR FORMULARIO DE CREAR SERVICIO
    |--------------------------------------------------------------------------
    */
    public function create()
    {
        $this->authorize('create', Service::class);

        return Inertia::render('Services/Create');
    }

    /*
    |--------------------------------------------------------------------------
    | GUARDAR NUEVO SERVICIO
    |--------------------------------------------------------------------------
    */
    public function store(SaveServiceRequest $request)
    {
        $this->authorize('create', Service::class);

        $validated = $request->validated();

        $service = Service::create([
            'user_id' => auth()->id(),
            ...$validated,
        ]);

        return redirect()->route('services.show', $service)
            ->with('success', 'Servicio creado correctamente');
    }

    /*
    |--------------------------------------------------------------------------
    | MOSTRAR DETALLE DEL SERVICIO
    |--------------------------------------------------------------------------
    */
    public function show(Service $service)
    {
        $service->load('user.profile', 'reviews.user', 'bookings');

        return Inertia::render('Services/Show', [
            'service' => $service,
            'isOwner' => $service->user_id === auth()->id(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | MOSTRAR FORMULARIO DE EDITAR SERVICIO
    |--------------------------------------------------------------------------
    */
    public function edit(Service $service)
    {
        $this->authorize('update', $service);

        return Inertia::render('Services/Edit', [
            'service' => $service,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ACTUALIZAR SERVICIO
    |--------------------------------------------------------------------------
    */
    public function update(SaveServiceRequest $request, Service $service)
    {
        $this->authorize('update', $service);

        $validated = $request->validated();

        $service->update($validated);

        return redirect()->route('services.show', $service)
            ->with('success', 'Servicio actualizado correctamente');
    }

    /*
    |--------------------------------------------------------------------------
    | ELIMINAR SERVICIO
    |--------------------------------------------------------------------------
    */
    public function destroy(Service $service)
    {
        $this->authorize('delete', $service);

        $service->delete();

        return redirect()->route('services.index')
            ->with('success', 'Servicio eliminado correctamente');
    }

    /*
    |--------------------------------------------------------------------------
    | BUSCAR SERVICIOS PÚBLICOS
    |--------------------------------------------------------------------------
    */
    public function search(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'max:50'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0', 'gte:min_price'],
            'sort' => ['nullable', 'in:price_asc,price_desc'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90', 'required_with:longitude,radius'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180', 'required_with:latitude,radius'],
            'radius' => ['nullable', 'numeric', 'min:1', 'max:500', 'required_with:latitude,longitude'],
        ]);

        // El catálogo público también muestra los servicios del usuario actual.
        // El detalle ya evita que un profesional reserve su propio servicio.
        $query = Service::with('user.profile', 'reviews')
            ->where('status', 'active');

        // Filtrar por categoría
        if (! empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        // Filtrar por búsqueda de texto
        if (! empty($filters['search'])) {
            $terms = preg_split('/\s+/', trim($filters['search']), -1, PREG_SPLIT_NO_EMPTY);
            $normalizeColumn = static fn (string $column): string => "REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER({$column}), 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u'), 'ü', 'u'), 'ñ', 'n')";

            foreach ($terms as $term) {
                $normalizedTerm = Str::ascii(Str::lower($term));
                $query->where(function ($q) use ($normalizedTerm, $normalizeColumn) {
                    foreach (['title', 'description', 'category'] as $column) {
                        $q->orWhereRaw($normalizeColumn($column).' LIKE ?', ["%{$normalizedTerm}%"]);
                    }
                });
            }
        }

        // Filtrar por precio
        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        if (isset($filters['latitude'], $filters['longitude'], $filters['radius'])) {
            $latitude = (float) $filters['latitude'];
            $longitude = (float) $filters['longitude'];
            $radius = (float) $filters['radius'];
            $latitudeKm = 111.32;
            $longitudeKm = 111.32 * cos(deg2rad($latitude));
            $latitudeDelta = $radius / $latitudeKm;
            $longitudeDelta = $radius / max($longitudeKm, 0.01);
            $distanceSquaredSql = '(((latitude - ?) * (latitude - ?) * ?) + ((longitude - ?) * (longitude - ?) * ?))';
            $bindings = [$latitude, $latitude, $latitudeKm ** 2, $longitude, $longitude, $longitudeKm ** 2];

            $query->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->whereBetween('latitude', [$latitude - $latitudeDelta, $latitude + $latitudeDelta])
                ->whereBetween('longitude', [$longitude - $longitudeDelta, $longitude + $longitudeDelta])
                ->orderByRaw($distanceSquaredSql, $bindings);
        }

        if (isset($filters['latitude'], $filters['longitude'], $filters['radius'])) {
            // La distancia ya se ordena con la misma aproximación usada para el radio.
        } elseif (($filters['sort'] ?? null) === 'price_asc') {
            $query->orderBy('price');
        } elseif (($filters['sort'] ?? null) === 'price_desc') {
            $query->orderByDesc('price');
        } else {
            $query->latest();
        }

        $services = $query->paginate(12)->withQueryString();

        if (isset($filters['latitude'], $filters['longitude'], $filters['radius'])) {
            $originLatitude = (float) $filters['latitude'];
            $originLongitude = (float) $filters['longitude'];
            $services->through(function (Service $service) use ($originLatitude, $originLongitude) {
                $latitudeDelta = deg2rad((float) $service->latitude - $originLatitude);
                $longitudeDelta = deg2rad((float) $service->longitude - $originLongitude);
                $a = sin($latitudeDelta / 2) ** 2
                    + cos(deg2rad($originLatitude)) * cos(deg2rad((float) $service->latitude)) * sin($longitudeDelta / 2) ** 2;

                $service->setAttribute('distance_km', round(6371 * 2 * atan2(sqrt($a), sqrt(1 - $a)), 1));

                return $service;
            });
        }
        $categories = Service::query()
            ->where('status', 'active')
            ->whereNotNull('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->values();

        return Inertia::render('Services/Browse', [
            'services' => $services,
            'filters' => $filters,
            'categories' => $categories,
        ]);
    }
}
