# Mapas y geolocalización

La plataforma usa Leaflet, React Leaflet y las teselas de OpenStreetMap. No requiere una API key.

## Funcionalidades implementadas

- Vistas Lista, Mapa y Combinada en `Explorar servicios`.
- Vista combinada por defecto con tarjetas y mapa sincronizados.
- Selección de tarjetas para enfocar su marcador y selección de marcadores desde el mapa.
- Marcadores con servicio, profesional, precio, zona y acceso al detalle.
- Detección opcional de la ubicación del dispositivo.
- Filtro combinado por texto, categoría, precio y radio de 10 a 500 km.
- Orden de resultados cercanos por distancia.
- Círculo visual del radio seleccionado.
- Selector de coordenadas al crear o editar un servicio.
- Selector de ubicación del perfil profesional.
- Búsqueda manual de direcciones limitada a Argentina.
- La dirección elegida completa automáticamente el campo `Ciudad o zona`.
- Mapas en el detalle del servicio y en el perfil público.
- Mapa de la ubicación contratada dentro del detalle privado de cada reserva.
- Los servicios sin coordenadas siguen disponibles en la lista, pero no aparecen en el mapa.

## Instalación

Después de descargar la rama:

```bash
composer install
npm install
php artisan migrate
npm run dev
php artisan serve
```

Laravel actúa como intermediario para cachear resultados, evitar problemas de CORS y limitar las consultas al proveedor. Se puede cambiar sin modificar el código:

```env
GEOCODING_SEARCH_URL=https://nominatim.openstreetmap.org/search
GEOCODING_USER_AGENT="ProLinkMarketplace/1.0 (+https://tu-dominio.com)"
```

Si una base local antigua informa que la columna `role` ya existe por una migración pendiente de otra rama, se puede aplicar solamente la migración geográfica:

```bash
php artisan migrate --path=database/migrations/2026_08_30_000001_add_coordinates_to_profiles_table.php
```

## Uso

1. En `Explorar servicios`, usar la vista combinada para comparar tarjetas y ubicaciones, o elegir las vistas `Lista` y `Mapa`.
2. Presionar `Usar mi ubicación` y aceptar el permiso del navegador para buscar por cercanía.
3. Elegir un radio y volver a aplicar el filtro cuando se quiera modificar la distancia.
4. Al publicar o editar un servicio, buscar una dirección argentina, hacer clic en el mapa o usar la ubicación del dispositivo.
5. Ejecutar `php artisan db:seed` para cargar 15 profesionales de demostración distribuidos por Argentina con servicios geolocalizados.

## Privacidad

- La geolocalización del navegador solo se solicita después de una acción explícita del usuario.
- Si el usuario rechaza el permiso, puede seguir navegando y seleccionar puntos manualmente.
- La interfaz presenta la ubicación como aproximada; no se debe publicar una dirección privada exacta si no es necesaria.

## Límites actuales

- La búsqueda de direcciones se ejecuta únicamente al presionar el botón; no funciona como autocompletado.
- No hay rutas, tiempos de viaje ni navegación GPS.
- El radio representa distancia geográfica aproximada, no distancia por calles.
- El servidor público de Nominatim es adecuado para esta demostración y exige como máximo una consulta por segundo. Laravel aplica ese límite y guarda cada búsqueda durante 24 horas. Para producción o alto tráfico se debe configurar un proveedor dedicado mediante `GEOCODING_SEARCH_URL`.
- Las consultas y los mapas muestran atribución a OpenStreetMap.

## Verificación

```bash
php artisan test tests/Feature/Services/ServiceGeolocationTest.php
php artisan test
npx tsc --noEmit
npm run build
```
