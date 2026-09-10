<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoMarketplaceSeeder extends Seeder
{
    public function run(): void
    {
        $imageMap = [
            'Electricidad' => 'images/services/electricidad-1.jpg',
            'Plomería' => 'images/services/extra/plomeria-1.jpg',
            'Limpieza' => 'images/services/extra/limpieza-1.jpg',
            'Jardinería' => 'images/services/extra/jardineria-1.jpg',
            'Educación' => 'images/services/extra/educacion-1.jpg',
            'Clases particulares' => 'images/services/extra/educacion-1.jpg',
            'Tecnología' => 'images/services/extra/tecnologia-1.jpg',
            'Soporte técnico' => 'images/services/extra/tecnologia-1.jpg',
            'Diseño' => 'images/services/casa-1.jpg',
            'Diseño gráfico' => 'images/services/casa-1.jpg',
            'Pintura' => 'images/services/extra/pintura-1.jpg',
            'Mascotas' => 'images/services/extra/perros-1.jpg',
            'Cuidado de mascotas' => 'images/services/extra/perros-1.jpg',
            'Construcción' => 'images/services/extra/construccion-1.jpg',
            'Belleza' => 'images/services/extra/belleza-1.jpg',
            'Fotografía' => 'images/services/extra/tecnologia-1.jpg',
            'Administración' => 'images/services/extra/tecnologia-1.jpg',
            'Climatización' => 'images/services/extra/climatizacion-1.jpg',
            'Entrenamiento' => 'images/services/extra/belleza-1.jpg',
            'Entrenamiento personal' => 'images/services/extra/belleza-1.jpg',
        ];

        $professionals = [
            ['Mariana López', 'mariana.lopez@demo.prolink.com', 'Plomería', 'Rosario, Santa Fe', 'Reparación de pérdidas y cañerías', 'Soluciono pérdidas, destapaciones y problemas de presión con atención rápida y materiales de primera calidad.', 28000, 'Plomería', -32.9468, -60.6393, 5],
            ['Lucas Fernández', 'lucas.fernandez@demo.prolink.com', 'Electricidad', 'Córdoba Capital, Córdoba', 'Electricista matriculado a domicilio', 'Instalaciones, tableros, cortocircuitos y mantenimiento eléctrico para hogares y comercios.', 35000, 'Electricidad', -31.4201, -64.1888, 5],
            ['Carlos Aguirre', 'carlos.aguirre@demo.prolink.com', 'Electricidad', 'Mendoza Capital, Mendoza', 'Reparación de cables eléctricos', 'Diagnóstico, aislamiento y reparación de cables, tomacorrientes y puntos eléctricos con seguridad y materiales.', 28000, 'Electricidad', -32.8895, -68.8458, 5],
            ['Juan Cruz García', 'juan.garcia@demo.prolink.com', 'Electricidad', 'San Isidro, Buenos Aires', 'Instalación de cableado y tomacorrientes', 'Cableado nuevo, cambio de enchufes, tomas y puntos de luz para viviendas, locales y pequeños comercios.', 45000, 'Electricidad', -34.4704, -58.5388, 5],
            ['Manuel Rojas', 'manuel.rojas@demo.prolink.com', 'Electricidad', 'La Rioja, La Rioja', 'Diagnóstico de fallas eléctricas', 'Revisión de tablero, corte de corriente y reparación de cableado con atención rápida y presupuesto claro.', 32000, 'Electricidad', -29.4100, -66.8500, 4],
            ['Sofía Méndez', 'sofia.mendez@demo.prolink.com', 'Limpieza', 'Mendoza Capital, Mendoza', 'Limpieza profunda de hogares', 'Limpieza integral de cocinas, baños y ambientes con productos incluidos y turnos coordinados.', 42000, 'Limpieza', -32.8895, -68.8458, 4],
            ['Mateo González', 'mateo.gonzalez@demo.prolink.com', 'Jardinería', 'La Plata, Buenos Aires', 'Mantenimiento de jardines', 'Corte de césped, poda, limpieza de canteros y mantenimiento periódico de espacios verdes.', 30000, 'Jardinería', -34.9205, -57.9536, 5],
            ['Valentina Ruiz', 'valentina.ruiz@demo.prolink.com', 'Educación', 'San Miguel de Tucumán, Tucumán', 'Clases particulares de matemática', 'Apoyo para nivel secundario e ingreso universitario con material personalizado y seguimiento semanal.', 12000, 'Clases particulares', -26.8083, -65.2176, 5],
            ['Joaquín Pereyra', 'joaquin.pereyra@demo.prolink.com', 'Tecnología', 'Neuquén Capital, Neuquén', 'Soporte técnico para computadoras', 'Diagnóstico, optimización, instalación de programas y solución de problemas en PC y notebooks.', 25000, 'Soporte técnico', -38.9516, -68.0591, 4],
            ['Camila Acosta', 'camila.acosta@demo.prolink.com', 'Diseño', 'Salta Capital, Salta', 'Diseño gráfico para emprendimientos', 'Identidad visual, piezas para redes sociales, menús, flyers y presentaciones para marcas argentinas.', 45000, 'Diseño gráfico', -24.7821, -65.4232, 5],
            ['Tomás Herrera', 'tomas.herrera@demo.prolink.com', 'Pintura', 'Mar del Plata, Buenos Aires', 'Pintura interior y exterior', 'Preparación de superficies y pintura prolija de casas, departamentos, locales y frentes.', 85000, 'Pintura', -38.0055, -57.5426, 4],
            ['Julieta Romero', 'julieta.romero@demo.prolink.com', 'Mascotas', 'Santa Fe Capital, Santa Fe', 'Paseos y cuidado de mascotas', 'Paseos individuales, visitas a domicilio y cuidado responsable de perros y gatos.', 9000, 'Cuidado de mascotas', -31.6333, -60.7000, 5],
            ['Nicolás Silva', 'nicolas.silva@demo.prolink.com', 'Construcción', 'San Juan Capital, San Juan', 'Albañilería y reparaciones', 'Arreglos generales, revoques, colocación de cerámicos y pequeñas reformas con presupuesto previo.', 70000, 'Construcción', -31.5375, -68.5364, 4],
            ['Agustina Castro', 'agustina.castro@demo.prolink.com', 'Belleza', 'Posadas, Misiones', 'Maquillaje social profesional', 'Maquillaje para eventos, graduaciones y sesiones fotográficas adaptado a cada estilo.', 38000, 'Belleza', -27.3621, -55.9009, 5],
            ['Federico Ortiz', 'federico.ortiz@demo.prolink.com', 'Fotografía', 'Ushuaia, Tierra del Fuego', 'Fotografía de eventos y productos', 'Cobertura fotográfica y contenido profesional para eventos, gastronomía y tiendas online.', 95000, 'Fotografía', -54.8019, -68.3030, 5],
            ['Carolina Vega', 'carolina.vega@demo.prolink.com', 'Administración', 'Paraná, Entre Ríos', 'Asistencia administrativa remota', 'Organización de agenda, carga de datos, presupuestos y soporte administrativo para profesionales.', 18000, 'Administración', -31.7413, -60.5115, 4],
            ['Bruno Molina', 'bruno.molina@demo.prolink.com', 'Climatización', 'Resistencia, Chaco', 'Instalación y service de aire acondicionado', 'Limpieza, mantenimiento e instalación de equipos split con revisión general del funcionamiento.', 55000, 'Climatización', -27.4514, -58.9867, 5],
            ['Paula Benítez', 'paula.benitez@demo.prolink.com', 'Entrenamiento', 'Bariloche, Río Negro', 'Entrenamiento personal funcional', 'Planes presenciales o al aire libre según objetivos, condición física y disponibilidad semanal.', 16000, 'Entrenamiento personal', -41.1335, -71.3103, 5],
        ];

        $reviewer = User::updateOrCreate(
            ['email' => 'cliente.demo@prolink.com'],
            ['name' => 'Cliente Demo', 'password' => Hash::make('ProLink123!'), 'role' => 'client'],
        );

        foreach ($professionals as $index => [$name, $email, $profession, $location, $title, $description, $price, $category, $latitude, $longitude, $rating]) {
            $user = User::updateOrCreate(
                ['email' => $email],
                ['name' => $name, 'password' => Hash::make('ProLink123!'), 'role' => 'professional'],
            );

            $user->profile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'full_name' => $name,
                    'description' => "Profesional de {$profession} con experiencia, atención responsable y presupuestos claros.",
                    'phone' => '+54 9 11 '.str_pad((string) (10000000 + $index), 8, '0', STR_PAD_LEFT),
                    'location' => $location,
                    'latitude' => $latitude,
                    'longitude' => $longitude,
                    'profession' => $profession,
                    'experience_years' => 3 + ($index % 12),
                    'skills' => "Atención personalizada, puntualidad, experiencia en {$profession}",
                ],
            );

            $service = Service::updateOrCreate(
                ['user_id' => $user->id, 'title' => $title],
                [
                    'description' => $description,
                    'price' => $price,
                    'category' => $category,
                    'image_url' => $imageMap[$category] ?? 'images/services/casa-1.jpg',
                    'location' => $location,
                    'latitude' => $latitude,
                    'longitude' => $longitude,
                    'status' => 'active',
                ],
            );

            $booking = Booking::updateOrCreate(
                ['user_id' => $reviewer->id, 'service_id' => $service->id],
                ['date' => now()->subDays($index + 2), 'status' => 'completed'],
            );

            Review::updateOrCreate(
                ['booking_id' => $booking->id],
                ['user_id' => $reviewer->id, 'service_id' => $service->id, 'rating' => $rating, 'comment' => 'Muy buena experiencia. Cumplió con lo acordado y respondió con profesionalismo.'],
            );

            $service->update(['average_rating' => $service->reviews()->avg('rating') ?: 0, 'total_reviews' => $service->reviews()->count()]);
        }
    }
}
