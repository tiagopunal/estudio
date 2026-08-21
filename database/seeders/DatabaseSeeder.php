<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear vendedor de ejemplo
        $seller = User::updateOrCreate(
            ['email' => 'seller@example.com'],
            [
                'name' => 'Seller User',
                'password' => bcrypt('password'),
                'role' => 'professional',
            ]
        );

        $seller->profile()->updateOrCreate(
            ['user_id' => $seller->id],
            [
                'description' => 'Proveedor de ejemplo — experiencia demostrativa y atención personalizada.',
            ]
        );

        // Crear usuario comprador para explorar servicios
        $buyer = User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'role' => 'client',
            ]
        );

        // Crear servicios de ejemplo para el marketplace
        $servicesData = [
            [
                'id' => 2,
                'title' => 'Servicio de prueba',
                'description' => 'Descripción breve del servicio de prueba.',
                'price' => 49.99,
                'category' => 'hogar',
                'latitude' => 19.432608,
                'longitude' => -99.133209,
            ],
            [
                'id' => 3,
                'title' => 'Limpieza profunda',
                'description' => 'Limpieza a fondo con productos eco-friendly.',
                'price' => 79.0,
                'category' => 'hogar',
                'latitude' => 19.432608,
                'longitude' => -99.133209,
            ],
            [
                'id' => 4,
                'title' => 'Clases de guitarra',
                'description' => 'Clases particulares para todos los niveles.',
                'price' => 30.0,
                'category' => 'clases',
                'latitude' => 19.432608,
                'longitude' => -99.133209,
            ],
            [
                'id' => 5,
                'title' => 'Reparación eléctrica',
                'description' => 'Servicio técnico eléctrico rápido y seguro.',
                'price' => 65.0,
                'category' => 'servicios',
                'latitude' => 19.432608,
                'longitude' => -99.133209,
            ],
            [
                'id' => 6,
                'title' => 'Entrenamiento personal',
                'description' => 'Rutinas personalizadas y seguimiento.',
                'price' => 40.0,
                'category' => 'salud',
                'latitude' => 19.432608,
                'longitude' => -99.133209,
            ],
        ];

        foreach ($servicesData as $s) {
            Service::updateOrCreate(
                ['id' => $s['id']],
                array_merge($s, ['user_id' => $seller->id])
            );
        }

        $reviewSamples = [
            ['service_id' => 2, 'rating' => 5, 'comment' => 'Excelente servicio, muy profesional.'],
            ['service_id' => 3, 'rating' => 4, 'comment' => 'Quedó muy bien, llegaron puntual.'],
            ['service_id' => 4, 'rating' => 5, 'comment' => 'Aprendí mucho en pocas clases.'],
            ['service_id' => 5, 'rating' => 3, 'comment' => 'Solucionaron el problema, precio correcto.'],
            ['service_id' => 6, 'rating' => 4, 'comment' => 'Buen seguimiento y resultados visibles.'],
        ];

        foreach ($reviewSamples as $idx => $sample) {
            $booking = Booking::firstOrCreate(
                [
                    'user_id' => $buyer->id,
                    'service_id' => $sample['service_id'],
                ],
                [
                    'date' => now()->subDays($idx + 1),
                    'status' => 'completed',
                ]
            );

            Review::updateOrCreate(
                ['booking_id' => $booking->id],
                [
                    'user_id' => $buyer->id,
                    'service_id' => $sample['service_id'],
                    'rating' => $sample['rating'],
                    'comment' => $sample['comment'],
                ]
            );

            $average = Review::where('service_id', $sample['service_id'])->average('rating') ?? 0;
            Service::where('id', $sample['service_id'])->update([
                'average_rating' => $average,
                'total_reviews' => Review::where('service_id', $sample['service_id'])->count(),
            ]);
        }
    }
}
