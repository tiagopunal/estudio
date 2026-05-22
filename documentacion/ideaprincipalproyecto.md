# Idea Principal del Proyecto

## Nombre del proyecto
Marketplace de Servicios Locales

## Descripción
Este proyecto consiste en el desarrollo de una plataforma web donde profesionales pueden ofrecer sus servicios (como plomeros, tutores o diseñadores) y los clientes pueden buscarlos, reservarlos y calificarlos.

## Objetivo
El objetivo es conectar a personas que necesitan un servicio con profesionales disponibles en su zona, facilitando la contratación de servicios de forma rápida y confiable.

## Público objetivo
- Personas que necesitan contratar servicios
- Profesionales independientes que quieren ofrecer su trabajo

## Tecnologías utilizadas
- Backend: (Node.js / Laravel)
- Frontend: ReactJS
- Base de datos: PostgreSQL
- Herramientas: Node.js, APIs de mapas (Google Maps o Leaflet)

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
