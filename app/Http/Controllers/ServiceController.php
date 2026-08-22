<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaveServiceRequest;
use App\Models\Service;
use Illuminate\Http\Request;
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
        ]);

        $query = Service::with('user.profile', 'reviews')
            ->where('status', 'active')
            ->when(auth()->check(), fn ($query) => $query->where('user_id', '!=', auth()->id()));

        // Filtrar por categoría
        if (! empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        // Filtrar por búsqueda de texto
        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filtrar por precio
        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        $services = $query->latest()->paginate(12);

        return Inertia::render('Services/Browse', [
            'services' => $services,
            'filters' => $filters,
        ]);
    }
}
