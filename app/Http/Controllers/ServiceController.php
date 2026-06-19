<?php

namespace App\Http\Controllers;

use App\Http\Requests\Services\StoreServiceRequest;
use App\Http\Requests\Services\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Service::class);

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'sort' => ['nullable', 'in:latest,price_asc,price_desc,rating_desc'],
        ]);

        $services = Service::query()
            ->with('user:id,name,email')
            ->when($filters['search'] ?? null, function ($query, string $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($query) => $query->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($filters['category'] ?? null, fn ($query, string $category) => $query->where('category', $category))
            ->when($filters['min_price'] ?? null, fn ($query, $price) => $query->where('price', '>=', $price))
            ->when($filters['max_price'] ?? null, fn ($query, $price) => $query->where('price', '<=', $price))
            ->when(($filters['sort'] ?? 'latest') === 'price_asc', fn ($query) => $query->orderBy('price'))
            ->when(($filters['sort'] ?? 'latest') === 'price_desc', fn ($query) => $query->orderByDesc('price'))
            ->when(($filters['sort'] ?? 'latest') === 'rating_desc', fn ($query) => $query->orderByDesc('average_rating'))
            ->when(($filters['sort'] ?? 'latest') === 'latest', fn ($query) => $query->latest())
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Service $service) => $this->serializeService($service, $request));

        return Inertia::render('services/index', [
            'services' => $services,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'category' => $filters['category'] ?? '',
                'min_price' => $filters['min_price'] ?? '',
                'max_price' => $filters['max_price'] ?? '',
                'sort' => $filters['sort'] ?? 'latest',
            ],
            'categories' => Service::query()->distinct()->orderBy('category')->pluck('category'),
            'canCreate' => $request->user()->can('create', Service::class),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Service::class);

        return Inertia::render('services/create');
    }

    public function store(StoreServiceRequest $request): RedirectResponse
    {
        $service = $request->user()->services()->create($request->validated());

        return to_route('services.show', $service)->with('success', 'Servicio creado correctamente.');
    }

    public function show(Request $request, Service $service): Response
    {
        Gate::authorize('view', $service);

        $service->load('user:id,name,email');

        return Inertia::render('services/show', [
            'service' => $this->serializeService($service, $request),
        ]);
    }

    public function edit(Request $request, Service $service): Response
    {
        Gate::authorize('update', $service);

        $service->load('user:id,name,email');

        return Inertia::render('services/edit', [
            'service' => $this->serializeService($service, $request),
        ]);
    }

    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $service->update($request->validated());

        return to_route('services.show', $service)->with('success', 'Servicio actualizado correctamente.');
    }

    public function destroy(Request $request, Service $service): RedirectResponse
    {
        Gate::authorize('delete', $service);

        $service->delete();

        return to_route('services.index')->with('success', 'Servicio eliminado correctamente.');
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeService(Service $service, Request $request): array
    {
        return [
            'id' => $service->id,
            'title' => $service->title,
            'description' => $service->description,
            'price' => (float) $service->price,
            'category' => $service->category,
            'latitude' => (float) $service->latitude,
            'longitude' => (float) $service->longitude,
            'average_rating' => (float) $service->average_rating,
            'created_at' => $service->created_at?->toISOString(),
            'professional' => [
                'id' => $service->user->id,
                'name' => $service->user->name,
                'email' => $service->user->email,
            ],
            'can_update' => $request->user()->can('update', $service),
            'can_delete' => $request->user()->can('delete', $service),
        ];
    }
}
