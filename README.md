
# 🏗️ Marketplace de Servicios Locales

Proyecto Laravel + React + PostgreSQL

## Módulos principales

- Autenticación por sesión con registro, login, recuperación y verificación de correo.
- Roles `client` y `professional` con autorización en backend.
- Perfiles públicos y profesionales editables.
- Publicación y búsqueda de servicios.
- Reservas con estados y control de permisos.
- Reseñas asociadas a reservas completadas.

La documentación del módulo de usuarios se encuentra en
[`documentacion/AUTH_ROLES_PROFILES.md`](documentacion/AUTH_ROLES_PROFILES.md).

---

## 🚀 Instalación

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run dev
```
