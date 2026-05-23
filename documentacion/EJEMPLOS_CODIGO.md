# 💻 Ejemplos de Código - React + Inertia

## 📱 Ejemplo 1: Crear un Formulario Simple

### Controller (Laravel)
```php
// app/Http/Controllers/ServiceController.php

public function create()
{
    return Inertia::render('Services/Create');
}

public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'price' => 'required|numeric|min:0.01',
    ]);

    Service::create([
        'user_id' => auth()->id(),
        ...$validated
    ]);

    return redirect()->route('services.index')
        ->with('success', 'Servicio creado correctamente');
}
```

### Component (React)
```typescript
// resources/js/pages/Services/Create.tsx

import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function ServicesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        price: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/services');
    };

    return (
        <div>
            <Head title="Nuevo Servicio" />
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título</label>
                    <input
                        value={data.title}
                        onChange={e => setData('title', e.target.value)}
                    />
                    {errors.title && <span className="text-red-600">{errors.title}</span>}
                </div>

                <div>
                    <label>Precio</label>
                    <input
                        type="number"
                        value={data.price}
                        onChange={e => setData('price', e.target.value)}
                    />
                    {errors.price && <span className="text-red-600">{errors.price}</span>}
                </div>

                <Button type="submit" disabled={processing}>
                    {processing ? 'Guardando...' : 'Guardar'}
                </Button>
            </form>
        </div>
    );
}
```

---

## 🔐 Ejemplo 2: Proteger una Ruta

### Controller con Policy
```php
// app/Http/Controllers/BookingController.php

public function updateStatus(UpdateBookingStatusRequest $request, Booking $booking)
{
    // Autorizar: lanza error 403 si no está autorizado
    $this->authorize('update', $booking);

    $booking->update(['status' => $request->status]);

    return redirect()->back()
        ->with('success', 'Estado actualizado');
}
```

### Policy
```php
// app/Policies/BookingPolicy.php

public function update(User $user, Booking $booking): bool
{
    // Solo el cliente o el profesional pueden actualizar
    return $user->id === $booking->user_id ||
           $user->id === $booking->service->user_id;
}
```

### Component React
```typescript
// resources/js/pages/Bookings/Show.tsx

import { useForm, usePage } from '@inertiajs/react';

export default function BookingsShow({ booking }) {
    const { auth } = usePage().props;
    const { patch, processing } = useForm({});

    const canUpdate = 
        auth.user.id === booking.user_id ||
        auth.user.id === booking.service.user_id;

    const handleStatusChange = (newStatus: string) => {
        patch(`/bookings/${booking.id}/status`, {
            status: newStatus
        });
    };

    if (!canUpdate) {
        return <div>No tienes permiso para cambiar este estado</div>;
    }

    return (
        <div>
            <button onClick={() => handleStatusChange('confirmed')}>
                Confirmar
            </button>
        </div>
    );
}
```

---

## 🔍 Ejemplo 3: Listar y Filtrar Datos

### Controller con Filtros
```php
// app/Http/Controllers/ServiceController.php

public function search(Request $request)
{
    $query = Service::query();

    if ($request->has('search') && $request->search) {
        $search = $request->search;
        $query->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
    }

    if ($request->has('category') && $request->category) {
        $query->where('category', $request->category);
    }

    if ($request->has('min_price') && $request->min_price) {
        $query->where('price', '>=', $request->min_price);
    }

    $services = $query->with('user', 'reviews')
        ->paginate(12);

    return Inertia::render('Services/Browse', [
        'services' => $services,
        'filters' => $request->all(),
    ]);
}
```

### Component React
```typescript
// resources/js/pages/Services/Browse.tsx

import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';

interface Props {
    services: {
        data: Service[];
        links: any[];
    };
    filters: Record<string, string>;
}

export default function ServicesBrowse({ services, filters }: Props) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        category: filters.category || '',
        min_price: filters.min_price || '',
    });

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        get('/services/browse', { preserveScroll: true });
    };

    return (
        <form onSubmit={handleFilter}>
            <Input
                value={data.search}
                onChange={e => setData('search', e.target.value)}
                placeholder="Buscar servicios..."
            />

            <Input
                value={data.category}
                onChange={e => setData('category', e.target.value)}
                placeholder="Categoría..."
            />

            <button type="submit">Buscar</button>

            {/* Mostrar resultados */}
            <div>
                {services.data.map(service => (
                    <div key={service.id}>{service.title}</div>
                ))}
            </div>

            {/* Paginación */}
            {services.links.length > 0 && (
                <div>
                    {services.links.map((link, i) => (
                        link.url && (
                            <a key={i} href={link.url}>
                                {link.label}
                            </a>
                        )
                    ))}
                </div>
            )}
        </form>
    );
}
```

---

## 📤 Ejemplo 4: Subir Archivos

### Controller
```php
// app/Http/Controllers/ProfileController.php

public function updateProfile(Request $request)
{
    $validated = $request->validate([
        'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        'description' => 'nullable|string|max:1000',
    ]);

    $user = auth()->user();

    // Procesar imagen
    if ($request->hasFile('avatar')) {
        // Eliminar vieja
        if ($user->profile?->avatar) {
            Storage::delete($user->profile->avatar);
        }

        // Guardar nueva
        $validated['avatar'] = $request->file('avatar')
            ->store('avatars', 'public');
    }

    // Actualizar o crear perfil
    $user->profile()->updateOrCreate(
        ['user_id' => $user->id],
        $validated
    );

    return redirect()->back()
        ->with('success', 'Perfil actualizado');
}
```

### Component React
```typescript
// resources/js/pages/Profiles/Edit.tsx

import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';

export default function ProfilesEdit() {
    const { data, setData, put, processing } = useForm({
        avatar: null as File | null,
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // FormData se maneja automáticamente en put()
        put('/profile/my-profile');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Avatar</label>
                <Input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                        const file = e.currentTarget.files?.[0];
                        setData('avatar', file || null);
                    }}
                />
            </div>

            <div>
                <label>Descripción</label>
                <textarea
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                />
            </div>

            <button type="submit" disabled={processing}>
                Guardar
            </button>
        </form>
    );
}
```

---

## 🔗 Ejemplo 5: Relaciones y Eager Loading

### Controller (Good Practice)
```php
// ✅ CORRECTO: Eager loading para evitar N+1

public function index()
{
    $bookings = Booking::where('user_id', auth()->id())
        ->with(['service' => fn($q) => $q->with('user')])
        ->with('user')
        ->latest()
        ->get();

    return Inertia::render('Bookings/Index', [
        'bookings' => $bookings,
    ]);
}

// ❌ INCORRECTO: Lazy loading (N+1 queries)
public function index()
{
    $bookings = Booking::where('user_id', auth()->id())->get();
    // Aquí, acceder a $bookings->service hace N queries adicionales
}
```

### React Component
```typescript
// resources/js/pages/Bookings/Index.tsx

interface Booking {
    id: number;
    service: {
        id: number;
        title: string;
        user: {
            id: number;
            name: string;
        }
    }
}

interface Props {
    bookings: Booking[];
}

export default function BookingsIndex({ bookings }: Props) {
    return (
        <div>
            {bookings.map(booking => (
                <div key={booking.id}>
                    <h3>{booking.service.title}</h3>
                    <p>Por: {booking.service.user.name}</p>
                </div>
            ))}
        </div>
    );
}
```

---

## 💬 Ejemplo 6: Flash Messages

### Controller
```php
public function store(StoreBookingRequest $request)
{
    $booking = Booking::create($request->validated());

    return redirect()->route('bookings.show', $booking)
        ->with('success', 'Reserva creada correctamente!')
        ->with('info', 'El profesional confirmará en breve');
}

public function destroy(Booking $booking)
{
    $booking->delete();

    return redirect()->route('bookings.index')
        ->with('warning', 'Reserva cancelada');
}
```

### React Component
```typescript
// resources/js/layouts/app-layout.tsx

import { usePage } from '@inertiajs/react';

export default function AppLayout({ children }) {
    const { flash } = usePage().props;

    return (
        <div>
            {/* Flash Messages */}
            {flash.success && (
                <div className="bg-green-100 text-green-800 p-4 rounded">
                    {flash.success}
                </div>
            )}

            {flash.error && (
                <div className="bg-red-100 text-red-800 p-4 rounded">
                    {flash.error}
                </div>
            )}

            {flash.warning && (
                <div className="bg-yellow-100 text-yellow-800 p-4 rounded">
                    {flash.warning}
                </div>
            )}

            {flash.info && (
                <div className="bg-blue-100 text-blue-800 p-4 rounded">
                    {flash.info}
                </div>
            )}

            {children}
        </div>
    );
}
```

---

## 🎯 Ejemplo 7: Mostrar Datos del Usuario Autenticado

### Controller
```php
public function dashboard()
{
    return Inertia::render('dashboard', [
        'user' => auth()->user(),
        'stats' => [
            'bookings_count' => auth()->user()->bookings()->count(),
            'services_count' => auth()->user()->services()->count(),
            'reviews_count' => auth()->user()->reviews()->count(),
        ]
    ]);
}
```

### React Component
```typescript
// resources/js/pages/dashboard.tsx

import { usePage } from '@inertiajs/react';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
    stats: {
        bookings_count: number;
        services_count: number;
        reviews_count: number;
    };
}

export default function Dashboard({ user, stats }: Props) {
    const { auth } = usePage().props;

    return (
        <div>
            <h1>¡Hola, {user.name}!</h1>
            
            <div>
                <p>Rol: {user.role === 'professional' ? 'Profesional' : 'Cliente'}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-100 rounded">
                    <p className="text-2xl">{stats.bookings_count}</p>
                    <p>Reservas</p>
                </div>

                {user.role === 'professional' && (
                    <div className="p-4 bg-green-100 rounded">
                        <p className="text-2xl">{stats.services_count}</p>
                        <p>Servicios</p>
                    </div>
                )}

                <div className="p-4 bg-purple-100 rounded">
                    <p className="text-2xl">{stats.reviews_count}</p>
                    <p>Reseñas</p>
                </div>
            </div>
        </div>
    );
}
```

---

## 🗑️ Ejemplo 8: Eliminar con Confirmación

### Controller
```php
public function destroy(Service $service)
{
    $this->authorize('delete', $service);

    $service->delete();

    return redirect()->route('services.index')
        ->with('success', 'Servicio eliminado correctamente');
}
```

### React Component
```typescript
// resources/js/pages/Services/Index.tsx

import { useForm } from '@inertiajs/react';

interface Service {
    id: number;
    title: string;
}

interface Props {
    services: Service[];
}

export default function ServicesIndex({ services }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (service: Service) => {
        if (confirm(`¿Eliminar servicio "${service.title}"?`)) {
            destroy(`/services/${service.id}`);
        }
    };

    return (
        <div>
            {services.map(service => (
                <div key={service.id}>
                    <h3>{service.title}</h3>
                    
                    <button onClick={() => handleDelete(service)}>
                        Eliminar
                    </button>
                </div>
            ))}
        </div>
    );
}
```

---

## ⏳ Ejemplo 9: Estados de Carga

### React Component
```typescript
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

export default function CreateService() {
    const { post, processing, errors } = useForm({
        title: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/services');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                disabled={processing}
                placeholder="Título..."
            />

            <Button 
                type="submit" 
                disabled={processing}
                className="flex items-center gap-2"
            >
                {processing ? (
                    <>
                        <Loader className="animate-spin" size={16} />
                        Guardando...
                    </>
                ) : (
                    'Guardar'
                )}
            </Button>
        </form>
    );
}
```

---

## 📊 Ejemplo 10: Formulario Complejo con Validación

### Controller
```php
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string|max:2000',
        'price' => 'required|numeric|min:0.01',
        'category' => 'required|string|in:design,programming,marketing',
        'date' => 'required|date|after:now',
    ], [
        'title.required' => 'El título es obligatorio',
        'price.min' => 'El precio mínimo es $0.01',
        'date.after' => 'La fecha debe ser futura',
    ]);

    Service::create($validated);

    return redirect()->back()
        ->with('success', 'Servicio creado exitosamente');
}
```

### React Component
```typescript
import { useForm } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';

export default function ServiceForm() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        price: '',
        category: 'design',
        date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/services');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Título */}
            <div>
                <label htmlFor="title">Título</label>
                <input
                    id="title"
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                    className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                    <p className="text-red-600 flex items-center gap-2">
                        <AlertCircle size={16} />
                        {errors.title}
                    </p>
                )}
            </div>

            {/* Descripción */}
            <div>
                <label htmlFor="description">Descripción</label>
                <textarea
                    id="description"
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                    <p className="text-red-600">{errors.description}</p>
                )}
            </div>

            {/* Precio */}
            <div>
                <label htmlFor="price">Precio</label>
                <input
                    id="price"
                    type="number"
                    step="0.01"
                    value={data.price}
                    onChange={e => setData('price', e.target.value)}
                    className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                    <p className="text-red-600">{errors.price}</p>
                )}
            </div>

            {/* Categoría */}
            <div>
                <label htmlFor="category">Categoría</label>
                <select
                    id="category"
                    value={data.category}
                    onChange={e => setData('category', e.target.value)}
                >
                    <option value="design">Diseño</option>
                    <option value="programming">Programación</option>
                    <option value="marketing">Marketing</option>
                </select>
            </div>

            {/* Fecha */}
            <div>
                <label htmlFor="date">Fecha</label>
                <input
                    id="date"
                    type="datetime-local"
                    value={data.date}
                    onChange={e => setData('date', e.target.value)}
                    className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && (
                    <p className="text-red-600">{errors.date}</p>
                )}
            </div>

            <button type="submit" disabled={processing}>
                {processing ? 'Guardando...' : 'Guardar'}
            </button>
        </form>
    );
}
```

---

¡Estos ejemplos cubren la mayoría de casos de uso comunes en tu aplicación! 🚀
