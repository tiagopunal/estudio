<?php

namespace App\Http\Controllers;

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
        return Inertia::render('Services/Create');
    }

    /*
    |--------------------------------------------------------------------------
    | GUARDAR NUEVO SERVICIO
    |--------------------------------------------------------------------------
    */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'price' => 'required|numeric|min:0.01',
            'category' => 'required|string|max:50',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $service = Service::create([
            'user_id' => auth()->id(),
            ...$validated
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
    public function update(Request $request, Service $service)
    {
        $this->authorize('update', $service);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'price' => 'required|numeric|min:0.01',
            'category' => 'required|string|max:50',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

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
        $query = Service::with('user.profile', 'reviews')
            ->where('user_id', '!=', auth()->id());

        // Filtrar por categoría
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Filtrar por búsqueda de texto
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filtrar por precio
        if ($request->has('min_price') && $request->min_price) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price') && $request->max_price) {
            $query->where('price', '<=', $request->max_price);
        }

        $services = $query->latest()->paginate(12);

        return Inertia::render('Services/Browse', [
            'services' => $services,
            'filters' => $request->all(),
        ]);
    }
}
