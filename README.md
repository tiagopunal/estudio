## Grupo 4 (4 integrantes) - Trabajo 2
### Integrantes
- Lopez rodrigo
- Cortes Tatti
- Puñal Thiago
- Alonso Thiago

### Tema: 2. Marketplace de Servicios Locales
- **Nivel:** Intermedio-Avanzado
- **Enfoque:** Geolocalización, Roles y Reseñas.

#### Descripción
Plataforma donde profesionales (plomeros, tutores, diseñadores) ofrecen servicios y los clientes los reservan y califican.

#### Esquema de Base de Datos (PostgreSQL o MongoDB)
- **Opción Postgres:** Ideal para transacciones de reservas y consistencia de datos. Uso de extensiones como `PostGIS` para búsquedas por ubicación.
- **Opción MongoDB:** Ideal si los "servicios" tienen atributos muy variables (un tutor tiene horas, un plomero tiene materiales).
- **Tablas/Colecciones:** `users` (con rol), `profiles`, `services`, `bookings`, `reviews`.

#### ReactJS
- Integración con Mapas (Leaflet o Google Maps).
- Filtros complejos en el frontend (por precio, ubicación, calificación).

#### Aprendizaje
- Diseño de esquemas polimórficos (si usan Mongo).
- Manejo de fechas y zonas horarias.
- Sistemas de calificación.
