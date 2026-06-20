# Sistema de Reseñas y Calificaciones - Documentación API

## Resumen
Este módulo gestiona todas las reseñas y calificaciones de servicios en la plataforma. Los usuarios pueden:
- Crear reseñas solo para reservas completadas
- Editar sus propias reseñas
- Eliminar sus propias reseñas
- Ver reseñas de otros usuarios sobre servicios

## Estructura de Datos

### Modelo Review

```json
{
  "id": 1,
  "user_id": 1,
  "service_id": 1,
  "booking_id": 1,
  "rating": 5,
  "comment": "Excelente servicio, muy profesional",
  "created_at": "2026-05-15T10:30:00Z",
  "updated_at": "2026-05-15T10:30:00Z"
}
```

### Relaciones
- **user_id**: Referencia al usuario que escribió la reseña
- **service_id**: Referencia al servicio siendo reseñado
- **booking_id**: Referencia a la reserva completada

### Restricciones
- `rating`: Debe ser un valor entre 1 y 5
- `comment`: Campo opcional, máximo 1000 caracteres
- Solo una reseña por reserva completada
- Solo usuarios pueden reseñar servicios que han reservado

---

## Endpoints

### 1. Listar Reseñas (Público)

**GET** `/api/reviews`

Lista todas las reseñas de la plataforma, con opción de filtrar por servicio.

#### Query Parameters
- `service_id` (optional, int): Filtra reseñas por servicio específico

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Reseñas obtenidas correctamente",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "service_id": 1,
      "booking_id": 1,
      "rating": 5,
      "comment": "Excelente servicio",
      "created_at": "2026-05-15T10:30:00Z",
      "updated_at": "2026-05-15T10:30:00Z",
      "user": {
        "id": 1,
        "name": "Juan Pérez",
        "email": "juan@example.com"
      },
      "service": {
        "id": 1,
        "title": "Limpieza de hogar",
        "average_rating": 4.8
      },
      "booking": {
        "id": 1,
        "status": "completada"
      }
    }
  ]
}
```

#### Ejemplos cURL
```bash
# Obtener todas las reseñas
curl -X GET http://localhost:8000/api/reviews

# Obtener reseñas de un servicio específico
curl -X GET "http://localhost:8000/api/reviews?service_id=1"
```

---

### 2. Obtener Reseñas por Servicio (Público)

**GET** `/api/reviews/service/{serviceId}`

Obtiene todas las reseñas de un servicio específico junto con el rating promedio.

#### URL Parameters
- `serviceId` (required, int): ID del servicio

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Reseñas del servicio obtenidas correctamente",
  "data": {
    "service": {
      "id": 1,
      "title": "Limpieza de hogar",
      "description": "Servicio profesional de limpieza...",
      "price": 50,
      "average_rating": 4.8
    },
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "comment": "Excelente trabajo",
        "created_at": "2026-05-15T10:30:00Z",
        "user": {
          "id": 1,
          "name": "Juan Pérez"
        }
      },
      {
        "id": 2,
        "rating": 4,
        "comment": "Muy bien",
        "created_at": "2026-05-14T15:20:00Z",
        "user": {
          "id": 2,
          "name": "María García"
        }
      }
    ],
    "average_rating": 4.8
  }
}
```

#### Ejemplo cURL
```bash
curl -X GET http://localhost:8000/api/reviews/service/1
```

---

### 3. Obtener Una Reseña Específica (Público)

**GET** `/api/reviews/{id}`

Obtiene los detalles completos de una reseña específica.

#### URL Parameters
- `id` (required, int): ID de la reseña

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Reseña obtenida correctamente",
  "data": {
    "id": 1,
    "user_id": 1,
    "service_id": 1,
    "booking_id": 1,
    "rating": 5,
    "comment": "Excelente servicio, muy profesional",
    "created_at": "2026-05-15T10:30:00Z",
    "updated_at": "2026-05-15T10:30:00Z",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com"
    },
    "service": {
      "id": 1,
      "title": "Limpieza de hogar",
      "price": 50
    },
    "booking": {
      "id": 1,
      "status": "completada",
      "date": "2026-05-10T14:00:00Z"
    }
  }
}
```

#### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Reseña no encontrada",
  "data": null
}
```

#### Ejemplo cURL
```bash
curl -X GET http://localhost:8000/api/reviews/1
```

---

### 4. Crear Una Reseña (Protegido - Autenticado)

**POST** `/api/reviews`

Crea una nueva reseña para una reserva completada.

#### Headers Requeridos
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

#### Request Body
```json
{
  "booking_id": 1,
  "rating": 5,
  "comment": "Excelente servicio, muy profesional y puntual"
}
```

#### Request Fields
- `booking_id` (required, int): ID de la reserva completada
- `rating` (required, int): Calificación del 1 al 5
- `comment` (optional, string): Comentario, máximo 1000 caracteres

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Reseña creada correctamente",
  "data": {
    "id": 3,
    "user_id": 1,
    "service_id": 1,
    "booking_id": 1,
    "rating": 5,
    "comment": "Excelente servicio, muy profesional y puntual",
    "created_at": "2026-05-15T10:30:00Z",
    "updated_at": "2026-05-15T10:30:00Z",
    "user": {
      "id": 1,
      "name": "Juan Pérez"
    },
    "service": {
      "id": 1,
      "title": "Limpieza de hogar"
    },
    "booking": {
      "id": 1,
      "status": "completada"
    }
  }
}
```

#### Errores Posibles

**400 Bad Request** - Validación fallida
```json
{
  "success": false,
  "message": "La calificación debe ser al menos 1",
  "data": null
}
```

**400 Bad Request** - Reserva no completada
```json
{
  "success": false,
  "message": "Solo se pueden reseñar reservas completadas",
  "data": null
}
```

**400 Bad Request** - Reseña ya existe
```json
{
  "success": false,
  "message": "Ya existe una reseña para esta reserva",
  "data": null
}
```

**403 Forbidden** - Permiso denegado
```json
{
  "success": false,
  "message": "No tienes permiso para reseñar esta reserva",
  "data": null
}
```

**401 Unauthorized** - Sin autenticación
```json
{
  "success": false,
  "message": "Unauthenticated",
  "data": null
}
```

#### Ejemplo cURL
```bash
curl -X POST http://localhost:8000/api/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": 1,
    "rating": 5,
    "comment": "Excelente servicio, muy profesional"
  }'
```

---

### 5. Actualizar Una Reseña (Protegido - Autenticado)

**PUT** `/api/reviews/{id}`

Actualiza una reseña existente. Solo el autor puede actualizar su reseña.

#### URL Parameters
- `id` (required, int): ID de la reseña

#### Headers Requeridos
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

#### Request Body
```json
{
  "rating": 4,
  "comment": "Actualizado: Buen servicio"
}
```

#### Request Fields
- `rating` (optional, int): Nueva calificación del 1 al 5
- `comment` (optional, string): Nuevo comentario, máximo 1000 caracteres

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Reseña actualizada correctamente",
  "data": {
    "id": 1,
    "user_id": 1,
    "service_id": 1,
    "booking_id": 1,
    "rating": 4,
    "comment": "Actualizado: Buen servicio",
    "created_at": "2026-05-15T10:30:00Z",
    "updated_at": "2026-05-15T11:45:00Z",
    "user": {
      "id": 1,
      "name": "Juan Pérez"
    },
    "service": {
      "id": 1,
      "title": "Limpieza de hogar"
    },
    "booking": {
      "id": 1,
      "status": "completada"
    }
  }
}
```

#### Errores Posibles

**403 Forbidden** - No es el autor
```json
{
  "success": false,
  "message": "No tienes permiso para editar esta reseña",
  "data": null
}
```

**404 Not Found** - Reseña no existe
```json
{
  "success": false,
  "message": "No query results found for model",
  "data": null
}
```

#### Ejemplo cURL
```bash
curl -X PUT http://localhost:8000/api/reviews/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "comment": "Actualizado: Buen servicio"
  }'
```

---

### 6. Eliminar Una Reseña (Protegido - Autenticado)

**DELETE** `/api/reviews/{id}`

Elimina una reseña existente. Solo el autor puede eliminar su reseña.

#### URL Parameters
- `id` (required, int): ID de la reseña

#### Headers Requeridos
- `Authorization: Bearer {token}`

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Reseña eliminada correctamente",
  "data": null
}
```

#### Errores Posibles

**403 Forbidden** - No es el autor
```json
{
  "success": false,
  "message": "No tienes permiso para eliminar esta reseña",
  "data": null
}
```

**404 Not Found** - Reseña no existe
```json
{
  "success": false,
  "message": "No query results found for model",
  "data": null
}
```

#### Ejemplo cURL
```bash
curl -X DELETE http://localhost:8000/api/reviews/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. Obtener Reseñas del Usuario Autenticado (Protegido)

**GET** `/api/reviews/user/me`

Obtiene todas las reseñas creadas por el usuario autenticado.

#### Headers Requeridos
- `Authorization: Bearer {token}`

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Reseñas del usuario obtenidas correctamente",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "service_id": 1,
      "booking_id": 1,
      "rating": 5,
      "comment": "Excelente servicio",
      "created_at": "2026-05-15T10:30:00Z",
      "updated_at": "2026-05-15T10:30:00Z",
      "service": {
        "id": 1,
        "title": "Limpieza de hogar"
      },
      "booking": {
        "id": 1,
        "status": "completada"
      }
    },
    {
      "id": 2,
      "user_id": 1,
      "service_id": 2,
      "booking_id": 2,
      "rating": 4,
      "comment": "Buen servicio",
      "created_at": "2026-05-14T15:20:00Z",
      "updated_at": "2026-05-14T15:20:00Z",
      "service": {
        "id": 2,
        "title": "Reparación de plomería"
      },
      "booking": {
        "id": 2,
        "status": "completada"
      }
    }
  ]
}
```

#### Ejemplo cURL
```bash
curl -X GET http://localhost:8000/api/reviews/user/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Reglas de Negocio Implementadas

1. **Una reseña por reserva**: No se permite crear múltiples reseñas para la misma reserva
2. **Solo reservas completadas**: Las reseñas solo se pueden crear para reservas con estado "completada"
3. **Validación de propiedad**: Solo el usuario que hizo la reserva puede reseñarla
4. **Cálculo automático de promedio**: El campo `average_rating` del servicio se recalcula automáticamente cuando se crea, actualiza o elimina una reseña
5. **Rating validado**: Las calificaciones deben estar entre 1 y 5
6. **Comentario opcional**: El comentario es opcional pero limitado a 1000 caracteres

---

## Notas Técnicas

### Relaciones en Base de Datos

```
reviews
├── id (PK)
├── user_id (FK → users)
├── service_id (FK → services)
├── booking_id (FK → bookings) - UNIQUE
├── rating (int: 1-5)
├── comment (text, nullable)
├── timestamps
```

### Flujo de Creación de Reseña
1. Usuario completa una reserva (estado: "completada")
2. Usuario hace POST a `/api/reviews` con `booking_id`, `rating`, y opcionalmente `comment`
3. Sistema valida:
   - Que el usuario sea dueño de la reserva
   - Que la reserva esté completada
   - Que no exista ya una reseña para esta reserva
   - Que el rating sea 1-5
4. Reseña se crea
5. Sistema recalcula el `average_rating` del servicio

### Cálculo del Promedio de Rating
```
average_rating = AVG(rating) FROM reviews WHERE service_id = {id}
```

El promedio se actualiza automáticamente en cada operación (create/update/delete).

---

## Estados de Error Comunes

| Código | Mensaje | Causa |
|--------|---------|-------|
| 400 | La calificación debe ser al menos 1 | Rating < 1 |
| 400 | La calificación no puede ser mayor a 5 | Rating > 5 |
| 400 | Solo se pueden reseñar reservas completadas | Booking status ≠ "completada" |
| 400 | Ya existe una reseña para esta reserva | Booking_id duplicado |
| 403 | No tienes permiso para reseñar esta reserva | user_id del booking ≠ usuario autenticado |
| 403 | No tienes permiso para editar esta reseña | user_id de review ≠ usuario autenticado |
| 403 | No tienes permiso para eliminar esta reseña | user_id de review ≠ usuario autenticado |
| 404 | Reseña no encontrada | Review no existe |
| 404 | La reserva no existe | Booking_id inválido |
| 401 | Unauthenticated | Token no proporcionado o inválido |

---

## Integración con Otros Módulos

### Con Módulo de Reservas
- Las reseñas solo se pueden crear para reservas completadas
- Al eliminar una reserva, se deben eliminar sus reseñas asociadas (considerar cascade)

### Con Módulo de Servicios
- El campo `average_rating` de servicios se mantiene sincronizado
- Las reseñas contribuyen a la reputación del servicio

### Con Módulo de Usuarios
- El usuario autenticado puede ver solo sus propias reseñas mediante `/api/reviews/user/me`
- Las reseñas reflejan datos del perfil del usuario
