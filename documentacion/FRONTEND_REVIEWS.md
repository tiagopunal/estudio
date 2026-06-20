# Frontend - Sistema de Reseñas y Calificaciones

## Componentes Creados

### 1. **RatingStars** (`components/rating-stars.tsx`)

Componente visual para mostrar y seleccionar calificaciones de 1 a 5 estrellas.

#### Props

```typescript
interface RatingStarsProps {
    rating: number;              // Valor actual de rating (0-5)
    onRatingChange?: (rating: number) => void;  // Callback cuando cambia rating
    readOnly?: boolean;           // Si es true, solo muestra (default: true)
    size?: 'sm' | 'md' | 'lg';   // Tamaño de las estrellas (default: 'md')
    showValue?: boolean;          // Si muestra el número (default: true)
}
```

#### Ejemplos de Uso

```tsx
// Mostrar rating (solo lectura)
<RatingStars rating={4.5} readOnly size="lg" showValue={true} />

// Input interactivo
<RatingStars 
    rating={selectedRating} 
    onRatingChange={setSelectedRating}
    readOnly={false}
    size="lg"
/>
```

---

### 2. **ReviewCard** (`components/review-card.tsx`)

Componente para mostrar una reseña individual con todas sus detalles.

#### Props

```typescript
interface ReviewCardProps {
    review: Review;
    currentUser?: User;
    onEdit?: (review: Review) => void;
    onDelete?: (reviewId: number) => void;
}
```

#### Características

- Muestra nombre del usuario y tiempo relativo (ej: "hace 2 horas")
- Muestra avatar del usuario
- Muestra rating con estrellas
- Muestra comentario si existe
- Botones de editar/eliminar solo para el dueño
- Diseño responsive

#### Ejemplo de Uso

```tsx
<ReviewCard
    review={review}
    currentUser={currentUser}
    onEdit={(review) => console.log('Editar:', review)}
    onDelete={(id) => console.log('Eliminar:', id)}
/>
```

---

### 3. **ReviewForm** (`components/review-form.tsx`)

Formulario para crear o editar una reseña.

#### Props

```typescript
interface ReviewFormProps {
    bookingId: number;
    onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
    isLoading?: boolean;
    error?: string;
    existingReview?: Review;
    onCancel?: () => void;
}
```

#### Características

- Selector de rating interactivo (1-5 estrellas)
- Campo de comentario opcional (máx 1000 caracteres)
- Validación de que rating no sea 0
- Contador de caracteres
- Manejo de errores
- Modo crear/editar automático

#### Ejemplo de Uso

```tsx
const [isLoading, setIsLoading] = useState(false);

<ReviewForm
    bookingId={1}
    onSubmit={async (data) => {
        setIsLoading(true);
        try {
            await createReview(data.rating, data.comment);
        } finally {
            setIsLoading(false);
        }
    }}
    isLoading={isLoading}
    onCancel={() => setShowForm(false)}
/>
```

---

### 4. **ReviewList** (`components/review-list.tsx`)

Componente para mostrar un listado de reseñas con skeleton loading.

#### Props

```typescript
interface ReviewListProps {
    reviews: Review[];
    isLoading?: boolean;
    onEditReview?: (review: Review) => void;
    onDeleteReview?: (reviewId: number) => void;
    currentUserId?: number;
    emptyMessage?: string;
}
```

#### Características

- Skeleton loading mientras se obtienen datos
- Mensaje personalizable cuando no hay reseñas
- Integración con ReviewCard
- Manejo de permisos de edición/eliminación

#### Ejemplo de Uso

```tsx
<ReviewList
    reviews={reviews}
    isLoading={isLoading}
    onEditReview={(review) => handleEdit(review)}
    onDeleteReview={(id) => handleDelete(id)}
    currentUserId={currentUser?.id}
/>
```

---

### 5. **ServiceReviewsPage** (`pages/service-reviews.tsx`)

Página completa que integra todos los componentes para mostrar reseñas de un servicio.

#### Props

```typescript
interface ServiceReviewsPageProps {
    service: Service;
    currentUser?: User;
    currentBooking?: {
        id: number;
        status: string;
    };
    authToken?: string;
}
```

#### Características

- Muestra rating promedio del servicio
- Permite crear reseña solo si:
  - Usuario está autenticado
  - Tiene una reserva completada
  - No ha dejado reseña antes
- Permite editar/eliminar propias reseñas
- Listado de todas las reseñas
- Manejo completo de errores y éxito

#### Ejemplo de Uso

```tsx
import ServiceReviewsPage from '@/pages/service-reviews';

// En tu página de detalle de servicio
<ServiceReviewsPage
    service={serviceData}
    currentUser={user}
    currentBooking={booking}
    authToken={authToken}
/>
```

---

## Hook Personalizado

### `useReviews` (`hooks/useReviews.ts`)

Hook para manejar toda la lógica de reseñas (fetch, create, update, delete).

#### Métodos

```typescript
const {
    reviews,              // Array de reseñas
    isLoading,            // Está cargando
    error,                // Error si ocurre
    averageRating,        // Promedio de rating
    fetchServiceReviews,  // (serviceId) => Promise<void>
    fetchMyReviews,       // (token) => Promise<void>
    createReview,         // (bookingId, rating, comment, token) => Promise<Review>
    updateReview,         // (id, rating, comment, token) => Promise<Review>
    deleteReview,         // (id, token) => Promise<void>
} = useReviews();
```

#### Ejemplo de Uso

```tsx
import { useReviews } from '@/hooks/useReviews';

export function MyComponent() {
    const { reviews, isLoading, fetchServiceReviews, createReview } = useReviews();

    useEffect(() => {
        fetchServiceReviews(serviceId);
    }, [serviceId]);

    const handleSubmit = async (rating: number, comment: string) => {
        try {
            await createReview(bookingId, rating, comment, token);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        // JSX
    );
}
```

---

## Tipos TypeScript

Se agregaron los siguientes tipos en `resources/js/types/index.ts`:

```typescript
interface Review {
    id: number;
    user_id: number;
    service_id: number;
    booking_id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    service?: Service;
    booking?: Booking;
}

interface Service {
    id: number;
    user_id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    latitude: number;
    longitude: number;
    average_rating: number;
    created_at: string;
    updated_at: string;
}

interface Booking {
    id: number;
    user_id: number;
    service_id: number;
    date: string;
    status: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
    created_at: string;
    updated_at: string;
}
```

---

## Integración en Páginas

### En la página de detalle de servicio

```tsx
import ServiceReviewsPage from '@/pages/service-reviews';

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
    const [service, setService] = useState<Service | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentBooking, setCurrentBooking] = useState(null);
    const { authToken } = useAuth();

    return (
        <div>
            {/* ... contenido del servicio ... */}
            
            <ServiceReviewsPage
                service={service!}
                currentUser={currentUser || undefined}
                currentBooking={currentBooking || undefined}
                authToken={authToken}
            />
        </div>
    );
}
```

### Componentes individuales en otras páginas

```tsx
// Mostrar solo reseñas sin formulario
<ReviewList
    reviews={reviews}
    isLoading={isLoading}
    currentUserId={currentUser?.id}
/>

// Mostrar rating promedio
<RatingStars 
    rating={service.average_rating} 
    readOnly 
    size="lg" 
/>
```

---

## Estilos y Dependencias

Los componentes utilizan:
- **Tailwind CSS** para estilos
- **Lucide React** para iconos (Star, Trash2, Edit, AlertCircle)
- **date-fns** para formatear fechas relativas
- **Shadcn/ui** componentes base (Avatar, Button, Textarea, Alert, Skeleton)

---

## Validaciones Implementadas

### Formulario (ReviewForm)
- ✅ Rating requerido (1-5)
- ✅ Comentario máximo 1000 caracteres
- ✅ Botón deshabilitado si rating es 0

### Lógica de Negocio
- ✅ Solo se puede reseñar si booking está completada
- ✅ Una reseña por booking
- ✅ Solo el propietario puede editar/eliminar

### Hook (useReviews)
- ✅ Validación de token para operaciones protegidas
- ✅ Manejo de errores en todas las operaciones
- ✅ Recalcular promedio automáticamente
- ✅ Actualizar estado local optimistamente

---

## Testing / Integración

### Para probar en desarrollo

1. **Crear reseña**
```tsx
const { createReview } = useReviews();

await createReview(
    bookingId,  // ID de una reserva completada
    5,          // Rating
    "Excelente",// Comment
    authToken   // Bearer token
);
```

2. **Editar reseña**
```tsx
await updateReview(reviewId, 4, "Actualizado", authToken);
```

3. **Eliminar reseña**
```tsx
await deleteReview(reviewId, authToken);
```

---

## Notas de Implementación

1. **Autenticación**: Todos los endpoints protegidos requieren token Bearer
2. **CORS**: Asegúrate que el backend permita requests desde el frontend
3. **Rutas**: Los componentes usan fetch a `/api/reviews/*`
4. **Estado**: El hook maneja todo el estado de reseñas
5. **Errores**: Se muestran alertas visibles en rojo
6. **Éxito**: Se muestran alertas verdes por 3 segundos

---

## Estructura de Archivos Creados

```
resources/
├── js/
│   ├── components/
│   │   ├── rating-stars.tsx (NUEVO)
│   │   ├── review-card.tsx (NUEVO)
│   │   ├── review-form.tsx (NUEVO)
│   │   └── review-list.tsx (NUEVO)
│   ├── hooks/
│   │   └── useReviews.ts (NUEVO)
│   ├── pages/
│   │   └── service-reviews.tsx (NUEVO)
│   └── types/
│       └── index.ts (ACTUALIZADO con Review, Service, Booking)
```
