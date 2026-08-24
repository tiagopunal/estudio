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
    public function index()
    {
        $services = Service::where('user_id', auth()->id())
            ->with('reviews', 'bookings')
            ->latest()
            ->get();

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

        if (($filters['sort'] ?? null) === 'price_asc') {
            $query->orderBy('price');
        } elseif (($filters['sort'] ?? null) === 'price_desc') {
            $query->orderByDesc('price');
        } else {
            $query->latest();
        }

        $services = $query->paginate(12)->withQueryString();
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
