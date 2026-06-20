# Implementación del Módulo de Reseñas y Calificaciones - Guía Rápida

## ✅ Tareas Completadas

### 1. **Diseño de Base de Datos**
- ✅ Migración `create_reviews_table` actualizada con:
  - `id` (clave primaria)
  - `user_id` (foránea → users)
  - `service_id` (foránea → services)
  - `booking_id` (foránea → bookings, UNIQUE)
  - `rating` (int: 1-5)
  - `comment` (text, nullable)
  - `timestamps` (created_at, updated_at)

- ✅ Modelo `Review.php` con relaciones:
  - `user()`: belongsTo User
  - `service()`: belongsTo Service
  - `booking()`: belongsTo Booking

### 2. **Relaciones Actualizadas**
- ✅ `User` → `reviews()`: hasMany Review
- ✅ `Service` → `reviews()`: hasMany Review (ya existía)
- ✅ `Booking` → `review()`: hasOne Review

### 3. **Controlador API - ReviewController**
Ubicación: `app/Http/Controllers/ReviewController.php`

**Métodos implementados:**
- `index()` - GET /api/reviews (lista todas, filtrable por service_id)
- `serviceReviews()` - GET /api/reviews/service/{serviceId}
- `show()` - GET /api/reviews/{id}
- `store()` - POST /api/reviews (crear reseña)
- `update()` - PUT /api/reviews/{id} (actualizar reseña)
- `destroy()` - DELETE /api/reviews/{id} (eliminar reseña)
- `userReviews()` - GET /api/reviews/user/me (reseñas del usuario actual)

### 4. **Form Requests (Validación)**

#### ReviewStoreRequest (`app/Http/Requests/ReviewStoreRequest.php`)
- `booking_id`: required, integer, existe en tabla bookings
- `rating`: required, integer, min:1, max:5
- `comment`: nullable, string, max:1000

#### ReviewUpdateRequest (`app/Http/Requests/ReviewUpdateRequest.php`)
- `rating`: sometimes, integer, min:1, max:5
- `comment`: sometimes, nullable, string, max:1000

### 5. **Rutas API**
Ubicación: `routes/api.php`

```php
Route::prefix('reviews')->group(function () {
    // Públicas
    Route::get('/', [ReviewController::class, 'index']);
    Route::get('/service/{serviceId}', [ReviewController::class, 'serviceReviews']);
    Route::get('/{id}', [ReviewController::class, 'show']);

    // Protegidas (requieren auth:sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [ReviewController::class, 'store']);
        Route::put('/{id}', [ReviewController::class, 'update']);
        Route::delete('/{id}', [ReviewController::class, 'destroy']);
        Route::get('/user/me', [ReviewController::class, 'userReviews']);
    });
});
```

### 6. **Documentación Completa**
Ubicación: `documentacion/API_REVIEWS.md`
- Estructura de datos
- 7 endpoints documentados con ejemplos
- Ejemplos cURL para cada endpoint
- Códigos de error y sus causas
- Integración con otros módulos

---

## 🔧 Características Implementadas

### Reglas de Negocio Validadas
1. ✅ Una reseña por reserva (constraint UNIQUE en booking_id)
2. ✅ Solo reservas completadas (validación en controller)
3. ✅ Usuario debe ser dueño de la reserva (validación en controller)
4. ✅ Rating entre 1 y 5 (validación en Form Request)
5. ✅ Comentario opcional hasta 1000 caracteres (validación)
6. ✅ Cálculo automático de promedio (método `updateServiceRating()`)

### Seguridad Implementada
- ✅ Autenticación con Sanctum para endpoints protegidos
- ✅ Autorización: solo dueños pueden editar/eliminar sus reseñas
- ✅ Validación de propiedad de reserva
- ✅ Manejo de excepciones y errores

### Respuestas API
- ✅ Formato consistente usando `ApiResponse`
- ✅ Mensajes descriptivos en español
- ✅ Relaciones cargadas (user, service, booking)
- ✅ Códigos HTTP apropiados

---

## 📋 Próximos Pasos / Consideraciones

### Base de Datos
```bash
# Ejecutar migraciones
php artisan migrate

# Si necesitas rollback (cuidado con datos existentes)
php artisan migrate:rollback
```

### Testing (Recomendado)
Crear tests en `tests/Feature/ReviewTest.php`:
- Test crear reseña válida
- Test crear reseña sin autorización
- Test crear reseña en reserva no completada
- Test crear reseña duplicada
- Test actualizar reseña propia
- Test actualizar reseña de otro usuario
- Test eliminar reseña propia
- Test eliminar reseña de otro usuario

### Frontend (Componentes React/Vue Sugeridos)
- Componente `ReviewForm.tsx` para crear/editar reseña
- Componente `ReviewCard.tsx` para mostrar una reseña
- Componente `ReviewList.tsx` para listar reseñas
- Componente `RatingStars.tsx` para visualizar rating

### Integración con Otros Módulos
1. **Módulo de Reservas**: Necesita pasar estado "completada" correctamente
2. **Módulo de Servicios**: El campo `average_rating` se actualiza automáticamente
3. **Módulo de Auth**: Sanctum debe estar configurado correctamente

---

## 🧪 Ejemplos de Uso

### Crear una reseña
```bash
curl -X POST http://localhost:8000/api/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": 1,
    "rating": 5,
    "comment": "Excelente servicio"
  }'
```

### Obtener reseñas de un servicio
```bash
curl -X GET http://localhost:8000/api/reviews/service/1
```

### Actualizar una reseña
```bash
curl -X PUT http://localhost:8000/api/reviews/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "comment": "Reseña actualizada"
  }'
```

### Ver mis reseñas
```bash
curl -X GET http://localhost:8000/api/reviews/user/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Estructura de Carpetas Actualizada

```
app/
├── Http/
│   ├── Controllers/
│   │   └── ReviewController.php (NUEVO)
│   └── Requests/
│       ├── ReviewStoreRequest.php (NUEVO)
│       └── ReviewUpdateRequest.php (NUEVO)
└── Models/
    └── Review.php (existente, relaciones completas)

database/
└── migrations/
    └── 2026_05_07_022037_create_reviews_table.php (ACTUALIZADO)

documentacion/
└── API_REVIEWS.md (NUEVO - documentación completa)

routes/
└── api.php (ACTUALIZADO - endpoints de reviews)
```

---

## 🔍 Validaciones Implementadas

### En ReviewStoreRequest
- booking_id existe en tabla bookings
- rating es entero entre 1 y 5
- comment no excede 1000 caracteres

### En ReviewController (lógica de negocio)
1. Validar que booking pertenezca al usuario autenticado
2. Validar que booking esté en estado "completada"
3. Validar que no exista ya reseña para ese booking
4. Recalcular promedio del servicio después de crear/actualizar/eliminar

---

## 🐛 Debugging

Si encuentras problemas:

1. **"No query results found for model"** → El ID de la reseña no existe
2. **"No tienes permiso para..."** → El usuario no es el dueño de la reseña
3. **"La reserva no está completada"** → El booking debe tener status "completada"
4. **"Ya existe una reseña para esta reserva"** → Ya hay una reseña en este booking

---

## 📞 Notas para Integración

- El `average_rating` se actualiza automáticamente en `services` table
- Las reseñas se eliminan en cascada si se elimina un booking/servicio/usuario
- Se usa `auth:sanctum` para autenticación (asegurate que esté configurado)
- Todas las respuestas siguen el formato de `ApiResponse`
