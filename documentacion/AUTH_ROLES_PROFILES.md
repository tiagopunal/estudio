# Auth, roles y perfiles

Este documento describe el flujo implementado para usuarios del marketplace.

## Roles

- `client`: rol asignado automáticamente al registrarse. Puede buscar y reservar servicios, pero no publicarlos.
- `professional`: conserva las funciones de cliente y además puede publicar y administrar sus servicios.

El campo `role` no se acepta desde el formulario de registro. Esto evita que un usuario se otorgue permisos profesionales enviando una petición modificada.

## Perfil del marketplace

Cada usuario recibe automáticamente un perfil uno-a-uno al registrarse. El perfil contiene:

- Nombre completo.
- Descripción.
- Teléfono.
- Ubicación.
- Avatar.
- Profesión u oficio.
- Años de experiencia.
- Habilidades.

El perfil de cuenta de `/settings/profile` administra nombre y correo. El perfil de `/my-profile` administra la información pública del marketplace.

## Alta profesional

Todos los usuarios comienzan como clientes. Para activar una cuenta profesional deben completar descripción, teléfono, ubicación, profesión y habilidades desde `/my-profile`.

La activación es automática porque la primera versión no incluye un rol administrador. Una vez activada, la autorización del backend permite crear servicios.

## Rutas principales

### Públicas

- `GET /profiles/{user}`: perfil público.
- `GET /profiles/{user}/services`: servicios activos del profesional.
- `GET /profiles/{user}/reviews`: reseñas recibidas en sus servicios.

### Protegidas

- `GET /my-profile`: edición del perfil del usuario autenticado.
- `POST /my-profile`: actualización, incluido el avatar.
- `PATCH /my-profile/professional`: activación profesional.

## Seguridad

- Las contraseñas se almacenan con hash de Laravel.
- El registro siempre asigna `client`.
- Solo `professional` puede acceder a creación y publicación de servicios.
- Solo el propietario puede editar o eliminar sus servicios.
- La autorización se valida en Laravel, además de adaptar la navegación del frontend.
- `profiles.user_id` es único, por lo que cada usuario puede tener un solo perfil.

## Verificación

```bash
php artisan migrate
php artisan test
npx tsc --noEmit
npm run build
```

Los tests específicos están en `tests/Feature/Users/RolesAndProfilesTest.php`.
