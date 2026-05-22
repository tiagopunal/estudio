# Especificaciones Técnicas - Sistema de Reseñas y Calificaciones

## 1. Modelo de Datos

### Schema de Tabla `reviews`

```sql
CREATE TABLE reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    service_id BIGINT UNSIGNED NOT NULL,
    booking_id BIGINT UNSIGNED NOT NULL UNIQUE,
    rating INT NOT NULL,
    comment LONGTEXT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_booking_review (booking_id)
);
```

### Relaciones Eloquent

**Review.php**
```php
public function user() { return $this->belongsTo(User::class); }
public function service() { return $this->belongsTo(Service::class); }
public function booking() { return $this->belongsTo(Booking::class); }
```

**User.php**
```php
public function reviews() { return $this->hasMany(Review::class); }
```

**Service.php**
```php
public function reviews() { return $this->hasMany(Review::class); }
```

**Booking.php**
```php
public function review() { return $this->hasOne(Review::class); }
```

---

## 2. Controlador - ReviewController

### Métodos y Lógica

#### `index(Request $request): JsonResponse`
- **Acceso**: Público
- **Query**: Obtiene todas las reseñas
- **Filtrado**: `?service_id=1` (opcional)
- **Orden**: Por `created_at DESC`
- **Relaciones**: Carga user, service, booking
- **Retorna**: Array de objetos Review

#### `serviceReviews($serviceId): JsonResponse`
- **Acceso**: Público
- **Validación**: Verifica que el servicio exista (findOrFail)
- **Retorna**: Objeto con service, reviews array, average_rating
- **Propósito**: Mostrar reseñas en detalle de producto

#### `show($id): JsonResponse`
- **Acceso**: Público
- **Validación**: Verifica que la reseña exista (findOrFail)
- **Relaciones**: Carga todas las relaciones
- **Retorna**: Un objeto Review completo

#### `store(ReviewStoreRequest $request): JsonResponse`
- **Acceso**: Autenticado (auth:sanctum)
- **Validación**: 
  1. Booking existe
  2. Booking pertenece al usuario autenticado
  3. Booking status es "completada"
  4. No existe reseña previa para este booking
- **Acción**: 
  1. Crea registro en tabla reviews
  2. Llama a `updateServiceRating()`
  3. Carga relaciones en el objeto retornado
- **Código**: 201 Created

#### `update($id, ReviewUpdateRequest $request): JsonResponse`
- **Acceso**: Autenticado (auth:sanctum)
- **Autorización**: Solo el user_id de la reseña
- **Validación**: 
  1. Reseña existe (findOrFail)
  2. Usuario es dueño de la reseña
- **Acción**:
  1. Actualiza rating y/o comment
  2. Llama a `updateServiceRating()`
  3. Carga relaciones
- **Nota**: Usa operador `??` para mantener valores previos

#### `destroy($id): JsonResponse`
- **Acceso**: Autenticado (auth:sanctum)
- **Autorización**: Solo el user_id de la reseña
- **Acción**:
  1. Obtiene service_id antes de eliminar
  2. Elimina la reseña
  3. Recalcula promedio del servicio

#### `userReviews(): JsonResponse`
- **Acceso**: Autenticado (auth:sanctum)
- **Query**: WHERE user_id = Auth::user()->id
- **Orden**: created_at DESC
- **Relaciones**: service, booking
- **Propósito**: Historial de reseñas del usuario

#### `updateServiceRating($serviceId): void`
- **Acceso**: Privado (método interno)
- **Query**: 
  ```sql
  SELECT AVG(rating) FROM reviews WHERE service_id = ?
  ```
- **Acción**: 
  1. Calcula promedio (null si no hay reseñas)
  2. Actualiza `services.average_rating`
  3. Manejo de excepciones silencioso (log)
- **Nota**: Se ejecuta automáticamente en store/update/destroy

---

## 3. Form Requests - Validación

### ReviewStoreRequest

**Campos validados:**

| Campo | Reglas | Mensajes |
|-------|--------|----------|
| booking_id | required, integer, exists:bookings,id | Custom messages en español |
| rating | required, integer, min:1, max:5 | Valida rango 1-5 |
| comment | nullable, string, max:1000 | Opcional, max 1000 chars |

**Método `authorize()`**: Retorna true (autorización en controller)

**Método `messages()`**: Mensajes de error personalizados en español

### ReviewUpdateRequest

**Campos validados:**

| Campo | Reglas | Mensajes |
|-------|--------|----------|
| rating | sometimes, required, integer, min:1, max:5 | Opcional si se envía |
| comment | sometimes, nullable, string, max:1000 | Opcional si se envía |

**Diferencia con Store**: Usa `sometimes` para permitir actualizaciones parciales

---

## 4. Rutas API

### Estructura de Routes

```php
Route::prefix('reviews')->group(function () {
    // Públicas
    Route::get('/', 'ReviewController@index');
    Route::get('/service/{serviceId}', 'ReviewController@serviceReviews');
    Route::get('/{id}', 'ReviewController@show');

    // Protegidas
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', 'ReviewController@store');
        Route::put('/{id}', 'ReviewController@update');
        Route::delete('/{id}', 'ReviewController@destroy');
        Route::get('/user/me', 'ReviewController@userReviews');
    });
});
```

### Notas
- Uso de prefijo `reviews` para agrupar
- Middleware `auth:sanctum` en rutas protegidas
- Orden: métodos GET antes que POST/PUT/DELETE

---

## 5. Flujos de Negocio

### Flujo 1: Crear Reseña

```
1. Cliente completa reserva → status = "completada"
2. Cliente hace POST /api/reviews con {booking_id, rating, comment}
3. ReviewStoreRequest valida los datos
4. ReviewController.store() valida:
   - Booking existe
   - Booking es del usuario autenticado
   - Booking status es "completada"
   - No existe reseña previa (UNIQUE booking_id)
5. Se crea registro en reviews
6. updateServiceRating() recalcula Service.average_rating
7. Response 201 con objeto Review cargado
```

### Flujo 2: Actualizar Reseña

```
1. Usuario autenticado hace PUT /api/reviews/{id} con {rating?, comment?}
2. ReviewUpdateRequest valida los datos (sometimes)
3. ReviewController.update() valida:
   - Reseña existe
   - Usuario es dueño (user_id match)
4. Se actualizan campos rating y/o comment
5. updateServiceRating() recalcula promedio
6. Response 200 con objeto Review actualizado
```

### Flujo 3: Eliminar Reseña

```
1. Usuario autenticado hace DELETE /api/reviews/{id}
2. ReviewController.destroy() valida:
   - Reseña existe
   - Usuario es dueño
3. Se elimina el registro
4. updateServiceRating() recalcula promedio
5. Response 200 con mensaje de confirmación
```

### Flujo 4: Ver Reseñas de Servicio

```
1. Usuario (público) hace GET /api/reviews/service/{serviceId}
2. Se obtiene Service y todas sus reviews
3. Se cargan relaciones (user en cada review)
4. Se retorna: service object, reviews array, average_rating
5. Frontend puede mostrar todas las reseñas en detalle del servicio
```

---

## 6. Manejo de Errores y Códigos HTTP

### Códigos HTTP Utilizados

| Código | Caso | Método |
|--------|------|--------|
| 200 OK | Operación exitosa (GET, PUT, DELETE) | Todos |
| 201 Created | Reseña creada exitosamente | store() |
| 400 Bad Request | Validación fallida o regla de negocio | store(), update() |
| 403 Forbidden | Usuario no tiene permiso | update(), destroy() |
| 404 Not Found | Recurso no existe | show(), update(), destroy() |
| 401 Unauthorized | Sin autenticación | auth:sanctum |

### Errores Específicos

**400 - Validación (ReviewStoreRequest)**
```json
{ "message": "La calificación debe ser al menos 1", ... }
```

**400 - Reserva no completada**
```json
{ "message": "Solo se pueden reseñar reservas completadas", ... }
```

**400 - Reseña duplicada**
```json
{ "message": "Ya existe una reseña para esta reserva", ... }
```

**403 - Sin autorización**
```json
{ "message": "No tienes permiso para editar esta reseña", ... }
```

---

## 7. Base de Datos - Índices y Constraints

### Índices

- **PRIMARY**: id
- **FOREIGN KEY**: user_id → users(id)
- **FOREIGN KEY**: service_id → services(id)
- **FOREIGN KEY**: booking_id → bookings(id)
- **UNIQUE**: booking_id (una reseña por reserva)

### Constraints

- **ON DELETE CASCADE**: Si se elimina user/service/booking, se eliminan sus reseñas
- **ON UPDATE DEFAULT**: timestamps se actualizan automáticamente

---

## 8. Cálculo de Average Rating

### Algoritmo

```php
private function updateServiceRating($serviceId)
{
    $service = Service::findOrFail($serviceId);
    $averageRating = Review::where('service_id', $serviceId)->avg('rating');
    $service->update(['average_rating' => $averageRating ?? 0]);
}
```

### Casos

- **Sin reseñas**: average_rating = 0
- **1 reseña de 5**: average_rating = 5.0
- **2 reseñas 5 y 4**: average_rating = 4.5
- **Se elimina todas**: average_rating = 0

### Actualizaciones

Se ejecuta automáticamente en:
1. Crear reseña (store)
2. Actualizar reseña (update) - si cambió rating
3. Eliminar reseña (destroy)

---

## 9. Autenticación y Autorización

### Autenticación

- **Método**: Laravel Sanctum
- **Token**: Bearer token en header `Authorization`
- **Protección**: Middleware `auth:sanctum` en rutas protegidas

### Autorización

**En ReviewController:**
- `store()`: Solo el propietario del booking
- `update()`: Solo el propietario de la reseña (user_id match)
- `destroy()`: Solo el propietario de la reseña (user_id match)

**Validaciones:**
```php
if ($review->user_id !== $user->id) {
    return ApiResponse::error("No tienes permiso...", 403);
}
```

---

## 10. Carga de Relaciones (Eager Loading)

### En Respuestas
Todas las respuestas cargan relaciones con `with()`:
- `with('user')`: Perfil del usuario que escribió
- `with('service')`: Datos del servicio reseñado
- `with('booking')`: Datos de la reserva

### Ejemplo
```php
$reviews = Review::with(['user', 'service', 'booking'])
    ->orderBy('created_at', 'desc')
    ->get();
```

---

## 11. Migración de Base de Datos

### Archivo
`database/migrations/2026_05_07_022037_create_reviews_table.php`

### Cambios
- Agregadas foreign keys con ON DELETE CASCADE
- Agregada constraint UNIQUE en booking_id
- Agregados comentarios de validación

### Ejecución
```bash
php artisan migrate
```

---

## 12. Consideraciones de Performance

1. **Lazy vs Eager Loading**: Siempre cargar relaciones con `with()`
2. **Índices**: booking_id tiene índice UNIQUE
3. **Cálculo de promedio**: Se recalcula en cada cambio (considerar caché en producción)
4. **Paginación**: Para listados grandes, considerar agregar `paginate()` en `index()`

---

## 13. Extensiones Futuras

### Posibles Mejoras
1. **Respuestas útiles**: Campo que indica si la reseña fue útil (helpful count)
2. **Moderación**: Sistema de flags para reseñas inapropiadas
3. **Historial**: Auditoría de cambios en reseñas
4. **Filtros avanzados**: rating mínimo, fecha rango, etc.
5. **Reputación**: Score derivado de reseñas del usuario

### Cambios Necesarios
1. Nuevas migraciones para nuevos campos
2. Nuevos métodos en controller
3. Nuevas Form Requests
4. Actualización de rutas
