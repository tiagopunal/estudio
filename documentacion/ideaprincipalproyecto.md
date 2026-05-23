# Alcance Real del Proyecto

El alcance real del proyecto define las funcionalidades que el equipo desarrollará dentro de esta primera versión del sistema, estableciendo límites claros sobre qué incluirá el producto final y qué características quedarán fuera del alcance inicial.  

Dado que el proyecto consiste en un Marketplace de Servicios Locales con enfoque en geolocalización, roles y reseñas, el alcance debe centrarse en implementar correctamente las funcionalidades esenciales que permitan validar el flujo principal de la plataforma.

---

## Funcionalidades Incluidas en el Alcance Inicial

### Gestión de Usuarios y Roles
- Registro e inicio de sesión de usuarios.  
- Selección de rol al registrarse (cliente o profesional).  
- Middleware / control de permisos según rol.  

---

### Gestión de Perfiles
- Creación y edición de perfil de usuario.  
- Información adicional según tipo de usuario/profesional.  
- Asociación entre usuario y perfil.  

---

### Publicación y Gestión de Servicios
- Creación de servicios por parte de profesionales.  
- Edición / eliminación de servicios publicados.  
- Visualización pública de servicios disponibles.  
- Asociación de ubicación geográfica al servicio.  

---

### Sistema de Reservas
- Reserva de servicios por parte de clientes.  
- Gestión de fechas y horarios de reserva.  
- Validación de disponibilidad / conflictos de horario.  
- Estados de reserva:
  - pendiente  
  - confirmada  
  - cancelada  
  - completada  

---

### Sistema de Reseñas / Calificaciones
- Calificación de servicios una vez completada la reserva.  
- Valoración calificación.  

---

### Geolocalización y Mapas
- Integración con Leaflet o Google Maps.  
- Visualización de servicios en mapa.  
- Filtro / búsqueda por ubicación o cercanía.  

---

### Filtros Avanzados
Filtrado de servicios por:
- Precio  
- Ubicación  
- Calificación  
- Categoría / Tipo de servicio  

---

## Funcionalidades Fuera del Alcance Inicial

Para mantener el proyecto dentro de un nivel realista y entregable, las siguientes funcionalidades no formarán parte de la primera versión:

- Chat en tiempo real entre cliente y profesional a verse  
- Notificaciones push / email automáticas  
- Panel de administración completo  

---

# Punto 2 — Definir Reglas de Negocio

Las reglas de negocio son el conjunto de condiciones, restricciones y comportamientos que determinan cómo debe funcionar el sistema desde la perspectiva operativa del proyecto.

---

## Reglas de Negocio Propuestas para el Proyecto

---

### 1. Reglas de Usuarios y Roles

Estas reglas determinan el comportamiento de los usuarios dentro del sistema y cómo evolucionan sus permisos dentro de la plataforma.

#### Definiciones
- Todo usuario deberá registrarse para utilizar la plataforma.  
- Al momento del registro, todo usuario será creado inicialmente con rol de cliente.  
- Existirá una funcionalidad específica para solicitar el alta como profesional.  
- Para convertirse en profesional, el usuario deberá completar un proceso de validación / filtros definidos por la plataforma.  
- Una vez aprobado dicho proceso, el usuario pasará a tener rol cliente-profesional.  

#### Restricciones
- Un usuario con rol cliente podrá navegar, buscar y reservar servicios, pero no podrá publicar servicios.  
- Un usuario con rol cliente-profesional podrá:
  - Reservar servicios como cliente.  
  - Publicar y administrar sus propios servicios como profesional.  
- El cambio de rol de cliente a cliente-profesional solo podrá realizarse mediante el proceso de validación definido por el sistema.  
- No existirá rol administrador developers  

---

### 2. Reglas de Perfiles

Definen cómo se gestiona la información ampliada de cada usuario.

#### Definiciones
Cada usuario tendrá un perfil asociado.  

El perfil podrá contener información adicional como:
- Descripción profesional  
- Foto de perfil  
- Ubicación  
- Teléfono / contacto  

#### Restricciones
- Un perfil solo podrá pertenecer a un usuario.  
- El usuario solo podrá modificar su propio perfil.  

---

### 3. Reglas de Servicios

Definen cómo se publican y administran los servicios ofrecidos.

#### Definiciones
Solo profesionales podrán crear servicios.  

Cada servicio deberá incluir:
- Título  
- Descripción  
- Precio  
- Categoría  
- Ubicación geográfica  

#### Restricciones
- Un profesional podrá tener múltiples servicios publicados.  
- Solo el creador del servicio podrá editarlo o eliminarlo  

---

### 4. Reglas de Reservas

Definen el funcionamiento del sistema de bookings.

#### Definiciones
Un cliente podrá reservar un servicio disponible.  

Toda reserva deberá asociarse a:
- Cliente  
- Servicio  
- Fecha / Hora  
- Estado de reserva  

#### Estados Posibles
- pendiente  
- confirmada  
- cancelada  
- completada  

#### Restricciones
- No se permitirán reservas duplicadas para el mismo servicio en el mismo horario.  
- El profesional podrá confirmar o rechazar reservas pendientes.  
- El cliente podrá cancelar una reserva antes de su confirmación o dentro del límite establecido.  
- Solo reservas completadas podrán generar reseñas.  

---

### 5. Reglas de Reseñas y Calificaciones

Definen cómo funciona el sistema de reviews.

#### Definiciones
Los clientes podrán calificar servicios luego de una reserva completada.  

Cada reseña incluirá:
- Puntaje numérico  
- Comentario opcional  
- a verse sistema de puntuación??????????????  

#### Restricciones
- Solo se permitirá una reseña por reserva completada.  
- Un usuario solo podrá reseñar servicios que haya reservado.  
- Las reseñas podrán modificarse/eliminarse una vez publicadas (o podrán editarse una única vez, según decida el equipo).  
- El promedio de calificaciones deberá recalcularse automáticamente.  

---

### 6. Reglas de Geolocalización

Definen el uso de ubicación en la plataforma.

#### Definiciones
- Cada servicio deberá tener coordenadas geográficas asociadas.  
- Los servicios se visualizarán en un mapa interactivo tipo el mapa de facebook en marketplace.  

#### Restricciones
- Solo servicios con ubicación válida aparecerán en el mapa.  
- El sistema permitirá filtrar servicios por cercanía/radio de distancia.  

---

### 7. Reglas de Búsqueda y Filtros

Definen cómo los usuarios encuentran servicios.

#### Filtros Permitidos
- Por categoría  
- Por ubicación/cercanía  

#### Restricciones
- Los filtros podrán combinarse entre sí.  

---

# 3. División Final del Trabajo del Equipo

---

## Grupo  — Reservas y Reseñas

Responsable del flujo posterior a la publicación de servicios: reserva, disponibilidad, finalización del servicio y sistema de reputación.

---

### Tati — Sistema de Reservas

Será responsable del desarrollo completo del módulo de reservas.

#### Diseño y Base de Datos
- Diseñar tabla/colección bookings.  
- Definir relaciones entre reservas, usuarios y servicios.  
- Modelar estados de reserva.  

#### Diseño de API / Endpoints
- Definir endpoints del módulo de reservas.  
- Documentar contratos de request/response.  

#### Backend
- Implementar creación de reservas.  
- Validar conflictos de horario/fecha.  
- Implementar estados de reserva:
  - pendiente  
  - confirmada  
  - cancelada  
  - completada  
- Implementar lógica de cancelación/modificación.  
- Validar permisos de clientes y profesionales.  

#### Frontend
- Desarrollar formulario de reserva.  
- Implementar vista de historial/listado de reservas.  
- Mostrar estados visuales de cada reserva.  
- Implementar acciones de cancelación/confirmación.  

#### Testing / Integración
- Testing funcional completo del flujo de reservas.  
- Integración con sistema de reseñas.  

---
## Funcionalidades generales
- Registro e inicio de sesión
- Creación de perfiles (cliente/profesional)
- Publicación de servicios
- Búsqueda de servicios por ubicación
- Reservas de servicios
- Sistema de calificaciones y reseñas

### Tiago — Sistema de Reseñas y Calificaciones

Será responsable del desarrollo completo del módulo de reputación/calificación.

#### Diseño y Base de Datos
- Diseñar tabla/colección reviews.  
- Relacionar reviews con usuarios, servicios y reservas.  
- Definir estructura de rating y comentario.  

#### Diseño de API / Endpoints
- Definir endpoints del módulo de reseñas.  
- Documentar contratos de request/response.  

#### Backend
- Implementar creación de reseñas.  
- Validar una reseña por reserva.  
- Validar que solo se reseñen reservas completadas.  
- Implementar cálculo automático de promedio de ratings.  

#### Frontend
- Desarrollar formulario de reseñas.  
- Mostrar listado de reseñas en detalle de servicio.  
- Visualizar rating promedio.  
- Implementar componente visual de puntuación.  

#### Testing / Integración
- Testing del flujo reserva → reseña.  
- Integración con módulo de servicios.  

---

### Trabajo Compartido 
- Integración entre reservas y reseñas.  
- Validación del flujo completo cliente → reserva → servicio completado → review.  
- Testing cruzado de ambos módulos.  

---

## Grupo — Usuarios, Roles y Servicios

Responsable del acceso a la plataforma, gestión de identidad y publicación de servicios.

---

### Thiago Alonso — Autenticación, Roles y Perfiles

Será responsable del módulo completo de usuarios y permisos.

#### Diseño y Base de Datos
- Diseñar tabla/colección users.  
- Diseñar tabla/colección profiles.  
- Definir estructura de roles/permisos.  
- Modelar proceso de solicitud de alta profesional.  

#### Diseño de API / Endpoints
- Definir endpoints de autenticación, perfil y roles.  
- Documentar contratos de request/response.  

#### Backend
- Implementar registro/login/logout.  
- Implementar autenticación JWT o sesión.  
- Middleware de autenticación.  
- Middleware de roles/permisos.  
- Implementar lógica de upgrade a cliente-profesional.  
- Implementar CRUD de perfil.  

#### Frontend
- Pantallas login/register.  
- Persistencia de sesión/token.  
- Protección de rutas privadas.  
- Pantalla de perfil de usuario.  
- Formulario de solicitud de alta profesional.  

#### Testing / Integración
- Testing de autenticación.  
- Testing de roles/permisos.  
- Integración con servicios.  

---

### Rodrigo Lopez — Gestión de Servicios

Será responsable del módulo completo de publicación y administración de servicios.

#### Diseño y Base de Datos
- Diseñar tabla/colección services.  
- Definir atributos y relaciones del servicio.  
- Modelar ubicación y rating promedio.  

#### Diseño de API / Endpoints
- Definir endpoints CRUD de servicios.  
- Definir endpoints de búsqueda/filtrado.  
- Documentar contratos de request/response.  

#### Backend
- Implementar CRUD completo de servicios.  
- Asociar servicios al profesional creador.  
- Validar permisos de edición/eliminación.  
- Implementar filtros de búsqueda.  

#### Frontend
- Pantalla de creación/edición de servicios.  
- Vista/listado general de servicios.  
- Cards/detalle de servicio.  
- Formularios de administración.  
- Filtros de búsqueda.  

#### Testing / Integración
- Testing CRUD de servicios.  
- Integración con ratings/reviews.  
- Integración con mapa.  

---

### Trabajo Compartido 
- Integración Auth ↔ Roles ↔ Servicios.  
- Restricción de publicación solo a profesionales.  
- Testing completo del flujo registro → alta profesional → publicación de servicio.  

---

## Trabajo Colaborativo de Todo el Equipo

---

### Geolocalización / Mapas

Debido a su impacto transversal, esta funcionalidad será desarrollada por todo el equipo.

#### Responsabilidades Compartidas
- Integración con Leaflet o Google Maps.  
- Asociación de coordenadas geográficas a servicios.  
- Visualización de servicios en mapa.  
- Implementación de filtros por cercanía.  
- Testing de experiencia geográfica.  

---

### Arquitectura y Setup Inicial
- Definición final de modelo de base de datos.  
- Revisión colectiva de relaciones y normalización.  
- Definición de arquitectura backend/frontend.  
- Configuración inicial del proyecto y repositorio.  

---

### QA / Integración Final
- Testing cruzado entre módulos.  
- Resolución de bugs de integración.  
- Ajustes visuales finales.  
- Preparación de demo / entrega.  

---

# Resumen de Asignación

| Integrante | Módulo Principal | Responsabilidad |
|------------|------------------|-----------------|
| Tati Cortes | Reservas | Sistema completo de bookings |
| Tiago | Reseñas | Sistema de reviews/calificaciones |
| Thiago Alonso | Auth / Roles / Profiles | Gestión de usuarios y permisos |
| Rodrigo Lopez | Servicios | CRUD y búsqueda de servicios |
| Todo el equipo | Geolocalización / QA / Integración | Trabajo transversal compartido |
