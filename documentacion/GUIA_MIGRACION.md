# Guía Completa: Migración de API REST a Laravel + Inertia.js + React

## 📋 Tabla de Contenidos
1. [Cambios Principales](#cambios-principales)
2. [Estructura de Proyecto](#estructura-de-proyecto)
3. [Ejemplos de Controllers](#ejemplos-de-controllers)
4. [Ejemplos de Páginas React](#ejemplos-de-páginas-react)
5. [Formularios con useForm](#formularios-con-useform)
6. [Manejo de Errores](#manejo-de-errores)
7. [Flash Messages](#flash-messages)
8. [Autenticación](#autenticación)
9. [Políticas de Autorización](#políticas-de-autorización)

---

## Cambios Principales

### ❌ ANTES (API REST)
```php
// routes/api.php
Route::post('/bookings', [BookingController::class, 'store']);

// Controllers
public function store(StoreBookingRequest $request)
{
    return ApiResponse::success($booking, "Reserva creada");
}

// Response JSON
{
    "success": true,
    "data": { /* booking */ },
    "message": "Reserva creada"
}
```

### ✅ AHORA (Inertia + React)
```php
// routes/web.php
Route::post('bookings', [BookingController::class, 'store']);

// Controllers
public function store(StoreBookingRequest $request)
{
    return redirect()->route('bookings.show', $booking)
        ->with('success', 'Reserva creada correctamente');
}

// React receives via props
<Inertia::render('Bookings/Show', ['booking' => $booking]);
```

---

## Estructura de Proyecto

### Frontend (React)
```
resources/js/
├── Pages/
│   ├── Bookings/
│   │   ├── Index.tsx       # Listar todas mis reservas
│   │   ├── Create.tsx      # Crear nueva reserva
│   │   ├── Show.tsx        # Ver detalle de reserva
│   │   └── Edit.tsx        # Editar reserva (si aplica)
│   ├── Services/
│   │   ├── Index.tsx       # Mis servicios
│   │   ├── Create.tsx      # Publicar servicio
│   │   ├── Edit.tsx        # Editar servicio
│   │   ├── Show.tsx        # Ver servicio público
│   │   └── Browse.tsx      # Buscar servicios con filtros
│   ├── Profiles/
│   │   ├── Show.tsx        # Ver perfil público
│   │   ├── Edit.tsx        # Editar mi perfil
│   │   ├── Services.tsx    # Servicios del usuario
│   │   └── Reviews.tsx     # Reseñas del usuario
│   └── Reviews/
│       ├── Create.tsx      # Crear reseña
│       ├── Show.tsx        # Ver reseña
│       └── Edit.tsx        # Editar reseña
├── Components/
│   ├── ui/                 # Componentes base (Button, Card, etc)
│   ├── forms/              # Componentes de formularios
│   └── common/             # Componentes comunes
├── Layouts/
│   ├── app-layout.tsx      # Layout principal con sidebar
│   └── auth-layout.tsx     # Layout sin autenticación
└── hooks/
    ├── useForm.ts          # Já viene de @inertiajs/react
    └── custom hooks aquí

### Backend (Laravel)
```
app/Http/
├── Controllers/
│   ├── BookingController.php    # Gestión de reservas
│   ├── ServiceController.php    # Gestión de servicios
│   ├── ProfileController.php    # Perfiles de usuario
│   ├── ReviewController.php     # Reseñas
│   └── Auth/                    # Controllers de autenticación
├── Requests/
│   ├── StoreBookingRequest.php
│   ├── UpdateBookingStatusRequest.php
│   └── (otros form requests)
├── Policies/
│   ├── BookingPolicy.php       # Autorización para reservas
│   ├── ServicePolicy.php       # Autorización para servicios
│   └── ReviewPolicy.php        # Autorización para reseñas
└── Models/
    ├── Booking.php
    ├── Service.php
    ├── Profile.php
    ├── Review.php
    └── User.php

routes/
├── web.php                 # Todas las rutas web
├── auth.php               # Rutas de autenticación
└── settings.php           # Rutas de configuración
```

---

## Ejemplos de Controllers

### BookingController - Completo
```php
<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Service;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingStatusRequest;
use Inertia\Inertia;

class BookingController extends Controller
{
    // Listar mis reservas
    public function index()
    {
        $bookings = Booking::where('user_id', auth()->id())
            ->with('service.user', 'user')
            ->latest()
            ->get();

        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    // Mostrar formulario crear
    public function create()
    {
        $services = Service::with('user')
            ->where('user_id', '!=', auth()->id())
            ->get();

        return Inertia::render('Bookings/Create', [
            'services' => $services,
        ]);
    }

    // Guardar nueva reserva
    public function store(StoreBookingRequest $request)
    {
        // Validaciones adicionales
        if (strtotime($request->date) < time()) {
            return back()->withErrors([
                'date' => 'No puedes reservar en una fecha pasada'
            ]);
        }

        // Verificar disponibilidad
        $exists = Booking::where('service_id', $request->service_id)
            ->where('date', $request->date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'date' => 'Este servicio ya tiene una reserva en ese horario'
            ]);
        }

        // Crear reserva
        $booking = Booking::create([
            'user_id' => auth()->id(),
            'service_id' => $request->service_id,
            'date' => $request->date,
            'status' => 'pending'
        ]);

        // Redirigir con mensaje de éxito
        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Reserva creada correctamente');
    }

    // Ver detalle
    public function show(Booking $booking)
    {
        $this->authorize('view', $booking);

        return Inertia::render('Bookings/Show', [
            'booking' => $booking->load('service.user', 'user'),
        ]);
    }

    // Cambiar estado
    public function updateStatus(UpdateBookingStatusRequest $request, Booking $booking)
    {
        $this->authorize('update', $booking);

        // Lógica de validaciones de transición de estado
        $validTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['completed', 'cancelled'],
            'cancelled' => [],
            'completed' => []
        ];

        if (!in_array($request->status, $validTransitions[$booking->status])) {
            return back()->withErrors([
                'status' => 'Transición de estado no válida'
            ]);
        }

        $booking->update(['status' => $request->status]);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Estado actualizado correctamente');
    }
}
```

---

## Ejemplos de Páginas React

### Bookings/Index.tsx - Listar Reservas
```typescript
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Booking {
    id: number;
    date: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    service: {
        title: string;
        price: number;
        user: { name: string };
    };
}

interface Props {
    bookings: Booking[];
}

export default function BookingsIndex({ bookings }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mis Reservas', href: '/bookings' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Reservas" />

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Mis Reservas</h1>
                    <Link href="/bookings/create">
                        <Button>Nueva Reserva</Button>
                    </Link>
                </div>

                {bookings.length === 0 ? (
                    <Card className="p-12 text-center">
                        <p>No tienes reservas</p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {bookings.map(booking => (
                            <Link key={booking.id} href={\`/bookings/\${booking.id}\`}>
                                <Card className="p-4 hover:shadow-lg cursor-pointer">
                                    <h3>{booking.service.title}</h3>
                                    <p>${booking.service.price}</p>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
```

### Services/Create.tsx - Crear Servicio
```typescript
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

export default function ServicesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        price: '',
        category: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/services'); // POST to route
    };

    return (
        <AppLayout>
            <Head title="Nuevo Servicio" />

            <h1>Publicar Nuevo Servicio</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label>Título</label>
                    <Input
                        value={data.title}
                        onChange={e => setData('title', e.target.value)}
                    />
                    {errors.title && (
                        <div className="text-red-600">
                            <AlertCircle size={16} />
                            {errors.title}
                        </div>
                    )}
                </div>

                <div>
                    <label>Descripción</label>
                    <textarea
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                    />
                    {errors.description && (
                        <div className="text-red-600">{errors.description}</div>
                    )}
                </div>

                <Button type="submit" disabled={processing}>
                    {processing ? 'Publicando...' : 'Publicar Servicio'}
                </Button>
            </form>
        </AppLayout>
    );
}
```

---

## Formularios con useForm

### Patrón Básico
```typescript
import { useForm } from '@inertiajs/react';

export default function MyForm() {
    const { data, setData, post, processing, errors } = useForm({
        field1: '',
        field2: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/route', {
            onSuccess: () => console.log('Éxito!'),
            onError: () => console.log('Error!'),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={data.field1}
                onChange={e => setData('field1', e.target.value)}
            />
            {errors.field1 && <span>{errors.field1}</span>}
            
            <button disabled={processing}>
                {processing ? 'Enviando...' : 'Enviar'}
            </button>
        </form>
    );
}
```

### Con Relaciones (nested data)
```typescript
const { data, setData, post } = useForm({
    user: {
        name: '',
        email: '',
    },
    booking: {
        date: '',
        service_id: '',
    }
});

// Actualizar campo anidado
<input
    value={data.user.name}
    onChange={e => setData('user', {...data.user, name: e.target.value})}
/>
```

---

## Manejo de Errores

### En Laravel
```php
// Form Request automáticamente redirige con errores
public function rules(): array
{
    return [
        'title' => 'required|string|max:255',
        'price' => 'required|numeric|min:0.01',
    ];
}

public function messages(): array
{
    return [
        'title.required' => 'El título es obligatorio',
        'price.min' => 'El precio mínimo es 0.01',
    ];
}

// En Controller, los errores se pasan automáticamente a React
return back()->withErrors(['field' => 'mensaje']);
```

### En React
```typescript
interface Props {
    bookings: Booking[];
    errors?: Record<string, string>; // Errores de validación
}

export default function MyPage({ errors }) {
    return (
        <div>
            {errors?.email && (
                <div className="text-red-600">{errors.email}</div>
            )}
        </div>
    );
}

// O en useForm
const { errors } = useForm({...});
{errors.field && <span>{errors.field}</span>}
```

---

## Flash Messages

### Enviadas desde Laravel
```php
return redirect()->route('bookings.show', $booking)
    ->with('success', 'Reserva creada correctamente')
    ->with('info', 'Mensaje informativo')
    ->with('warning', 'Mensaje de advertencia')
    ->with('error', 'Mensaje de error');

// O con old() para repoblar formularios
return back()
    ->withErrors($validator)
    ->withInput();
```

### Recibidas en React
```typescript
import { usePage } from '@inertiajs/react';

export default function MyComponent() {
    const { props } = usePage();
    const { flash } = props;

    return (
        <div>
            {flash.success && (
                <div className="bg-green-100 text-green-800">
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div className="bg-red-100 text-red-800">
                    {flash.error}
                </div>
            )}
        </div>
    );
}
```

---

## Autenticación

### Verificar autenticación
```php
// En Routes
Route::middleware('auth')->group(function () {
    Route::resource('bookings', BookingController::class);
});

// En Controllers
public function store(StoreRequest $request)
{
    // auth()->id() - ID del usuario autenticado
    // auth()->user() - Instancia de User
    $booking = Booking::create([
        'user_id' => auth()->id(),
    ]);
}
```

### En React
```typescript
import { usePage } from '@inertiajs/react';

export default function MyComponent() {
    const { auth } = usePage().props;

    return (
        <div>
            {auth.user ? (
                <span>Hola, {auth.user.name}!</span>
            ) : (
                <a href="/login">Iniciar sesión</a>
            )}
        </div>
    );
}
```

---

## Políticas de Autorización

### Definir una Policy
```php
// app/Policies/BookingPolicy.php
<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Booking;

class BookingPolicy
{
    public function view(User $user, Booking $booking): bool
    {
        return $user->id === $booking->user_id || 
               $user->id === $booking->service->user_id;
    }

    public function update(User $user, Booking $booking): bool
    {
        return $user->id === $booking->user_id ||
               $user->id === $booking->service->user_id;
    }

    public function delete(User $user, Booking $booking): bool
    {
        return $user->id === $booking->user_id && 
               $booking->status === 'pending';
    }
}
```

### Usar Policies en Controllers
```php
public function show(Booking $booking)
{
    // Lanza excepción si no está autorizado
    $this->authorize('view', $booking);

    return Inertia::render('Bookings/Show', [
        'booking' => $booking->load('service'),
    ]);
}

public function update(UpdateRequest $request, Booking $booking)
{
    $this->authorize('update', $booking);
    
    $booking->update($request->validated());
    
    return redirect()->back()->with('success', 'Actualizado');
}
```

---

## Mejores Prácticas

### ✅ DO
1. Usar resources naturales (Route::resource)
2. Mantener Form Requests para validación
3. Usar Policies para autorización
4. Pasar datos mínimos necesarios a React
5. Usar `->with()` para relaciones
6. Validar en servidor SIEMPRE
7. Usar Flash messages para feedback
8. Organizar componentes por feature

### ❌ DON'T
1. Devolver JSON desde controllers web
2. Pasar modelos completos sin necesidad
3. Olvidar validación del lado del servidor
4. Usar `@inertiajs/react` sin entender Inertia
5. Hacer queries N+1 (usar eager loading)
6. Olvidar autorizar acciones del usuario
7. Confiar solo en validación del cliente
8. Crear componentes gigantes

---

## Comandos Útiles

```bash
# Ejecutar migraciones
php artisan migrate

# Seeding
php artisan db:seed

# Compilar assets (Vite)
npm run dev       # Development
npm run build     # Production

# PHPUnit tests
php artisan test

# Linting
npm run lint      # ESLint
npm run format    # Prettier
```

---

## Troubleshooting

### Props no llegan a React
```php
// Asegúrate de pasar el nombre correcto
return Inertia::render('Bookings/Show', [
    'booking' => $booking, // ✅ Correcto
]);

// En React
interface Props {
    booking: Booking; // ✅ Mismo nombre
}
```

### Errores de validación no aparecen
```php
// Form Request debe retornar true en authorize()
public function authorize(): bool
{
    return true; // ✅
}

// Laravel redirige automáticamente con errores
// Usa back() en lugar de json()
return back()->withErrors($errors); // ✅
```

### Rutas no funcionan
```php
// Verifica que la ruta esté en routes/web.php
// NO en routes/api.php

// Usa rutas nombradas (named routes)
Route::post('/bookings', [BookingController::class, 'store'])
    ->name('bookings.store');

// En formularios
<form action={route('bookings.store')} method="POST">
```

---

## Próximos Pasos

1. Configurar middleware personalizados
2. Implementar cache con Redis
3. Agregar jobs y queues (emails, etc)
4. Implementar notifications
5. Agregar testing
6. Dockerizar la aplicación
7. Configurar CI/CD

---

¡Tu aplicación está completamente migrada a Laravel + Inertia.js + React!
