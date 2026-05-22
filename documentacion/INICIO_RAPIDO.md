# 🚀 Guía de Inicio Rápido

## ✅ Requisitos Previos

- ✅ PHP 8.2+
- ✅ MySQL/MariaDB
- ✅ Node.js 18+
- ✅ Composer
- ✅ npm o yarn

---

## 📦 Instalación

### 1. Clonar o Verificar el Proyecto

```bash
cd c:\xampp\htdocs\Proyectos\grupo4
```

### 2. Instalar Dependencias PHP

```bash
composer install
```

### 3. Copiar Variables de Entorno

```bash
copy .env.example .env
```

### 4. Generar Key de Aplicación

```bash
php artisan key:generate
```

### 5. Configurar Base de Datos

Editar `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=grupo4_db
DB_USERNAME=root
DB_PASSWORD=
```

Crear base de datos:
```bash
# En MySQL
CREATE DATABASE grupo4_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 6. Ejecutar Migraciones

```bash
php artisan migrate
```

### 7. Instalar Dependencias Node

```bash
npm install
```

---

## 🛠️ Ejecución del Proyecto

### Terminal 1: Servir Laravel

```bash
php artisan serve
```

Accesible en: `http://localhost:8000`

### Terminal 2: Compilar Assets (Vite)

```bash
npm run dev
```

Vite se ejecutará en `http://localhost:5173` (en desarrollo)

---

## 📝 Primera Prueba

### 1. Ir a la Aplicación

```
http://localhost:8000
```

### 2. Ver Página de Inicio

Debería mostrar el welcome page de Laravel

### 3. Iniciar Sesión

Si tienes usuarios en la base de datos:
- Click en "Login"
- Usar credenciales de prueba

---

## 📊 Datos de Prueba (Seeding)

### Crear Seeder

Si no existe, crear:
```bash
php artisan make:seeder DatabaseSeeder
```

### Archivo: database/seeders/DatabaseSeeder.php

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use App\Models\Service;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Crear usuarios de prueba
        $professional = User::create([
            'name' => 'Juan Profesional',
            'email' => 'juan@example.com',
            'password' => bcrypt('password'),
            'role' => 'professional',
        ]);

        $client = User::create([
            'name' => 'Maria Cliente',
            'email' => 'maria@example.com',
            'password' => bcrypt('password'),
            'role' => 'client',
        ]);

        // Crear perfiles
        Profile::create([
            'user_id' => $professional->id,
            'description' => 'Profesional experimentado en diseño gráfico',
            'phone' => '1234567890',
            'location' => 'Buenos Aires',
        ]);

        Profile::create([
            'user_id' => $client->id,
            'description' => 'Buscando diseños profesionales',
            'phone' => '0987654321',
            'location' => 'Córdoba',
        ]);

        // Crear servicios
        Service::create([
            'user_id' => $professional->id,
            'title' => 'Diseño de Logo',
            'description' => 'Diseño profesional de logos personalizados',
            'price' => 250.00,
            'category' => 'design',
        ]);

        Service::create([
            'user_id' => $professional->id,
            'title' => 'Diseño Web',
            'description' => 'Sitios web responsivos y modernos',
            'price' => 500.00,
            'category' => 'design',
        ]);
    }
}
```

### Ejecutar Seeding

```bash
php artisan db:seed
```

---

## 🧪 Pruebas Manuales

### 1. Registrar Usuario

- Ir a `/register`
- Llenar formulario
- Click "Register"
- Debe redirigir a dashboard

### 2. Crear Servicio (si es profesional)

- Ir a Dashboard
- Click "Mis Servicios"
- Click "Nuevo Servicio"
- Llenar formulario
- Click "Publicar"
- Debe aparacer en lista

### 3. Buscar Servicios

- Ir a `/services/browse`
- Ver lista de servicios
- Usar filtros
- Clicker en servicio para ver detalle

### 4. Hacer Reserva

- Ir a servicio
- Click "Hacer Reserva"
- Seleccionar fecha/hora
- Click "Reservar"
- Debe aparecer en "Mis Reservas"

### 5. Confirmar Reserva (como profesional)

- Loguearse como profesional
- Ir a Dashboard
- Ver reservas pendientes
- Click "Confirmar"

### 6. Completar Reserva

- Cambiar estado a "Completada"
- Cliente verá opción "Dejar Reseña"

### 7. Dejar Reseña

- Click "Dejar Reseña"
- Seleccionar estrellas
- Escribir comentario
- Click "Enviar Reseña"

---

## 🐛 Troubleshooting

### Problema: Base de datos no existe

```bash
# Crear manualmente
php artisan migrate:fresh --seed
```

### Problema: Assets no cargan (CSS/JS)

Asegúrate de que Vite está corriendo:
```bash
npm run dev
```

### Problema: Errors en la consola

1. Abre la consola del navegador (F12)
2. Busca errores en pestaña "Console"
3. Verifica también Laravel logs:
```bash
tail -f storage/logs/laravel.log
```

### Problema: Flash messages no aparecen

Verifica que el Layout tenga código para mostrar flash:
```typescript
// resources/js/layouts/app-layout.tsx
const { flash } = usePage().props;
```

### Problema: Formularios no se envían

1. Verifica que el método sea correcto (post/put/patch/delete)
2. Asegúrate que routes/web.php tenga la ruta
3. Mira la pestaña Network en DevTools para ver la petición

---

## 📁 Estructura de Carpetas Importante

```
├── app/
│   ├── Http/Controllers/      # Controllers (BookingController, etc)
│   ├── Policies/              # Autorización (BookingPolicy, etc)
│   ├── Models/                # Modelos (Booking, Service, etc)
│   └── Http/Requests/         # Form Requests para validación
├── database/
│   ├── migrations/            # Migraciones (tablas)
│   └── seeders/               # Datos de prueba
├── resources/
│   ├── js/pages/              # Componentes React (Pages)
│   └── css/                   # Estilos CSS/Tailwind
├── routes/
│   └── web.php                # Rutas (todas aquí)
└── storage/logs/
    └── laravel.log            # Logs de errores
```

---

## 🔧 Comandos Útiles

```bash
# Ejecutar migraciones
php artisan migrate

# Deshacer migraciones
php artisan migrate:rollback

# Rehacer todo desde cero
php artisan migrate:fresh --seed

# Ver todas las rutas
php artisan route:list

# Limpiar caché
php artisan cache:clear

# Compilar assets (producción)
npm run build

# Ejecutar tests
php artisan test

# Hacer una migración
php artisan make:migration create_table_name

# Hacer un Controller
php artisan make:controller ControllerName

# Hacer un Model
php artisan make:model ModelName

# Hacer un Policy
php artisan make:policy PolicyName

# Hacer un Form Request
php artisan make:request StoreUserRequest
```

---

## 📱 Accesos Rápidos

| Página | URL |
|--------|-----|
| Home | http://localhost:8000 |
| Login | http://localhost:8000/login |
| Register | http://localhost:8000/register |
| Dashboard | http://localhost:8000/dashboard |
| Mis Reservas | http://localhost:8000/bookings |
| Mis Servicios | http://localhost:8000/services |
| Buscar Servicios | http://localhost:8000/services/browse |
| Mi Perfil | http://localhost:8000/profile/my-profile |
| Laravel Log | storage/logs/laravel.log |

---

## ✨ Tips Importantes

1. **Siempre usa `npm run dev`** mientras desarrollas - Vite recargará automáticamente
2. **Revisa errores en Laravel logs** - `tail -f storage/logs/laravel.log`
3. **Usa DevTools del navegador** - F12 para ver Network, Console, etc
4. **Limpia caché si ves cambios extraños** - `php artisan cache:clear`
5. **Respeta los tipos de TypeScript** - Te ayudará a evitar errores

---

## 🆘 Soporte Rápido

Si algo no funciona:

1. **Verifica los logs**
   ```bash
   tail -f storage/logs/laravel.log
   ```

2. **Abre la consola del navegador**
   - F12 → Console
   - Busca errores en rojo

3. **Verifica que Vite esté corriendo**
   ```bash
   npm run dev
   ```

4. **Verifica que artisan serve esté corriendo**
   ```bash
   php artisan serve
   ```

5. **Prueba limpiar todo**
   ```bash
   php artisan migrate:fresh --seed
   npm run dev
   php artisan serve
   ```

---

¡Listo para empezar! 🎉

Si necesitas ayuda, revisa los archivos de documentación:
- `GUIA_MIGRACION.md` - Cambios principales
- `EJEMPLOS_CODIGO.md` - Ejemplos de código
- `RESUMEN_CAMBIOS.md` - Resumen visual de cambios
