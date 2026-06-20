# 🏪 Marketplace de Servicios Locales - Documentación

> ✅ **MIGRACIÓN COMPLETADA**: De API REST a Laravel + Inertia.js + React

## 📚 Documentación Completa

La aplicación ha sido completamente migrada de una arquitectura API REST a una arquitectura web integrada con Laravel, Inertia.js y React. Toda la documentación se encuentra en la carpeta `documentacion/`:

### 📖 Archivos de Documentación

1. **[INICIO_RAPIDO.md](./documentacion/INICIO_RAPIDO.md)** 🚀
   - Instrucciones de instalación paso a paso
   - Comandos para ejecutar el proyecto
   - Primeras pruebas
   - Troubleshooting rápido

2. **[GUIA_MIGRACION.md](./documentacion/GUIA_MIGRACION.md)** 📋
   - Explicación detallada de cambios
   - Antes y después de código
   - Estructura del proyecto
   - Flash messages, validación, políticas

3. **[RESUMEN_CAMBIOS.md](./documentacion/RESUMEN_CAMBIOS.md)** 📊
   - Resumen visual de cambios
   - Comparación API REST vs Inertia
   - Nuevas características
   - Próximas mejoras

4. **[EJEMPLOS_CODIGO.md](./documentacion/EJEMPLOS_CODIGO.md)** 💻
   - 10 ejemplos prácticos de código
   - Controllers, Components, Formularios
   - Upload de archivos, validación
   - Flash messages, políticas

---

## 🎯 ¿Qué cambió?

### ❌ ANTES (API REST)
- Todas las respuestas en JSON
- Controllers devolvían `response()->json()`
- Rutas en `routes/api.php`
- Frontend separado (JavaScript puro)
- Validación manual en JS

### ✅ AHORA (Inertia + React)
- Controllers devuelven vistas con `Inertia::render()`
- Rutas en `routes/web.php`
- Frontend integrado (React + TypeScript)
- Validación automática server-side
- Flash messages de sistema
- Políticas de autorización
- Experiencia de usuario fluida (sin refresco)

---

## 🏗️ Estructura del Proyecto

### Backend (Laravel)
```
app/Http/
├── Controllers/
│   ├── BookingController.php    ✅ Migrado
│   ├── ServiceController.php    ✅ Nuevo
│   ├── ProfileController.php    ✅ Nuevo
│   └── ReviewController.php     ✅ Nuevo
├── Policies/
│   ├── BookingPolicy.php        ✅ Nueva
│   ├── ServicePolicy.php        ✅ Nueva
│   └── ReviewPolicy.php         ✅ Nueva
├── Requests/
│   ├── StoreBookingRequest.php  ✅ Actualizado
│   └── UpdateBookingStatusRequest.php ✅ Actualizado
└── Models/
    ├── Booking.php              ✅ Existente
    ├── Service.php              ✅ Existente
    ├── Profile.php              ✅ Existente
    ├── Review.php               ✅ Existente
    └── User.php                 ✅ Existente
```

### Frontend (React)
```
resources/js/pages/
├── Bookings/
│   ├── Index.tsx   ✅ Listar reservas
│   ├── Create.tsx  ✅ Crear reserva
│   └── Show.tsx    ✅ Detalle con cambio estado
├── Services/
│   ├── Index.tsx   ✅ Mis servicios
│   ├── Create.tsx  ✅ Crear servicio
│   ├── Edit.tsx    ✅ Editar servicio
│   ├── Show.tsx    ✅ Detalle público
│   └── Browse.tsx  ✅ Buscar servicios
├── Profiles/
│   ├── Show.tsx    ✅ Perfil público
│   ├── Edit.tsx    ✅ Mi perfil
│   ├── Services.tsx ✅ Servicios de usuario
│   └── Reviews.tsx ✅ Reseñas de usuario
└── Reviews/
    ├── Create.tsx  ✅ Crear reseña
    ├── Show.tsx    ✅ Ver reseña
    └── Edit.tsx    ✅ Editar reseña
```

---

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
composer install
npm install
```

### 2. Configurar base de datos
```bash
cp .env.example .env
php artisan key:generate
# Editar .env con datos de BD
php artisan migrate
```

### 3. Ejecutar aplicación
```bash
# Terminal 1: Backend
php artisan serve

# Terminal 2: Frontend
npm run dev
```

### 4. Acceder
- http://localhost:8000

**Para más detalles, ver [INICIO_RAPIDO.md](./documentacion/INICIO_RAPIDO.md)**

---

## 📋 Rutas de la Aplicación

### Públicas (sin autenticación)
```
GET    /                      Página de inicio
GET    /services/browse       Buscar servicios
GET    /services/{service}    Ver servicio
GET    /profiles/{user}       Ver perfil público
GET    /profiles/{user}/services
GET    /profiles/{user}/reviews
```

### Protegidas (con autenticación)
```
GET    /dashboard             Mi dashboard
GET    /bookings              Mis reservas
GET    /bookings/create       Crear reserva
POST   /bookings              Guardar reserva
GET    /bookings/{booking}    Ver reserva
PATCH  /bookings/{booking}/status  Cambiar estado

GET    /services              Mis servicios (profesional)
GET    /services/create       Crear servicio (profesional)
POST   /services              Guardar servicio
GET    /services/{service}/edit
PUT    /services/{service}    Actualizar servicio
DELETE /services/{service}    Eliminar servicio

GET    /profile/my-profile    Editar mi perfil
PUT    /profile/my-profile    Actualizar mi perfil

GET    /bookings/{booking}/reviews/create
POST   /bookings/{booking}/reviews     Crear reseña
GET    /reviews/{review}
GET    /reviews/{review}/edit
PUT    /reviews/{review}
DELETE /reviews/{review}
```

---

## 🔐 Modelos de Datos

### User (Usuario)
```typescript
{
  id: number
  name: string
  email: string
  password: string (hasheada)
  role: 'professional' | 'client'
  profile: Profile
  bookings: Booking[]
  services: Service[]
  reviews: Review[]
}
```

### Service (Servicio)
```typescript
{
  id: number
  user_id: number
  title: string
  description: string
  price: number
  category: string
  average_rating: number
  user: User
  reviews: Review[]
  bookings: Booking[]
}
```

### Booking (Reserva)
```typescript
{
  id: number
  user_id: number
  service_id: number
  date: string (datetime)
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  user: User
  service: Service
  review: Review | null
}
```

### Review (Reseña)
```typescript
{
  id: number
  booking_id: number
  user_id: number
  service_id: number
  rating: number (1-5)
  comment: string
  booking: Booking
  user: User
  service: Service
}
```

---

## 🎨 Características Implementadas

### ✅ Autenticación
- Registro de usuarios
- Login/Logout
- Roles (profesional/cliente)

### ✅ Servicios
- Crear/Editar/Eliminar servicios (profesional)
- Buscar servicios con filtros
- Ver detalles de servicio
- Reseñas y ratings

### ✅ Reservas
- Crear reserva
- Cambiar estado (pending → confirmed → completed)
- Cancelar reserva
- Ver historial

### ✅ Reseñas
- Dejar reseña después de completar reserva
- Editar/Eliminar propia reseña
- Sistema de calificación (1-5 estrellas)
- Promedio de calificación por servicio

### ✅ Perfiles
- Ver perfil público
- Editar mi perfil
- Avatar de usuario
- Listar servicios de usuario
- Ver reseñas de usuario

### ✅ Sistema de Mensajes
- Flash messages (éxito, error, advertencia)
- Validación de formularios con errores visibles
- Confirmación de acciones destructivas

---

## 🛠️ Stack Tecnológico

### Backend
- **Laravel 11** - Framework PHP
- **MySQL** - Base de datos
- **Inertia.js** - Adaptador client/server
- **PHP 8.2+** - Lenguaje

### Frontend
- **React 19** - Librería UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Vite** - Bundler
- **Lucide React** - Iconos
- **@radix-ui** - Componentes base

---

## 📚 Ejemplos de Código

Para ver ejemplos prácticos de:
- Crear un formulario
- Proteger una ruta con Policies
- Hacer querys con relaciones
- Subir archivos
- Flash messages
- Y mucho más...

**Ver [EJEMPLOS_CODIGO.md](./documentacion/EJEMPLOS_CODIGO.md)**

---

## 🧪 Testing

### Ejecutar tests
```bash
php artisan test
```

### Crear test
```bash
php artisan make:test BookingTest
```

---

## 🚨 Troubleshooting

### Assets no cargan
```bash
npm run dev
```

### Base de datos problema
```bash
php artisan migrate:fresh --seed
```

### Ver errores
```bash
tail -f storage/logs/laravel.log
```

### Más ayuda
Ver sección "Troubleshooting" en [INICIO_RAPIDO.md](./documentacion/INICIO_RAPIDO.md)

---

## 📝 Checklist de Implementación

- [x] Controllers adaptados a Inertia
- [x] Rutas organizadas en routes/web.php
- [x] Form Requests con validación
- [x] Policies para autorización
- [x] Páginas React creadas (15 componentes)
- [x] Flash messages implementadas
- [x] Manejo de errores
- [x] Métodos CRUD completos
- [x] Búsqueda y filtros
- [x] Relaciones eager loading
- [ ] Tests unitarios
- [ ] Tests E2E
- [ ] Optimización de queries
- [ ] Deployment

---

## 🎓 Recursos

- [Inertia.js Documentation](https://inertiajs.com)
- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)

---

## 📞 Soporte

Para más información:

1. Lee los archivos de documentación en `documentacion/`
2. Revisa los ejemplos en `EJEMPLOS_CODIGO.md`
3. Ejecuta los comandos en `INICIO_RAPIDO.md`
4. Busca en los logs: `storage/logs/laravel.log`

---

## ✨ Estado del Proyecto

| Componente | Estado | Detalles |
|-----------|--------|---------|
| Controllers | ✅ Completo | Todos adaptados a Inertia |
| Rutas | ✅ Completo | Organizadas en web.php |
| Form Requests | ✅ Completo | Con validación y mensajes |
| Policies | ✅ Completo | Autorización implementada |
| React Pages | ✅ Completo | 15 componentes creados |
| Modelos | ✅ Completo | Con todas las relaciones |
| Migraciones | ✅ Completo | Base de datos lista |
| Tests | 🔄 Pendiente | Próximo paso |
| Deployment | 🔄 Pendiente | Configuración necesaria |

---

## 🎉 ¡Listo para Usar!

La aplicación está completamente migrada y lista para:
1. Desarrollo local
2. Testing
3. Customización
4. Deployment

**Comienza en [INICIO_RAPIDO.md](./documentacion/INICIO_RAPIDO.md)**

---

**Última actualización**: 2024  
**Versión**: 2.0 (Inertia + React)  
**Estado**: Migración completada ✅
