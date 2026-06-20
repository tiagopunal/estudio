# Testing - Sistema de Reseñas y Calificaciones

## Estructura de Tests

Los tests deben ubicarse en `tests/Feature/ReviewTest.php` y cubrir todos los flujos del módulo.

## Tests de Backend (PHP/Pest)

### Configuración Inicial

```php
<?php

namespace Tests\Feature;

use App\Models\Review;
use App\Models\User;
use App\Models\Service;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected User $serviceCreator;
    protected Service $service;
    protected Booking $booking;
    protected Booking $completedBooking;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Crear usuarios
        $this->user = User::factory()->create();
        $this->serviceCreator = User::factory()->create();
        
        // Crear servicio
        $this->service = Service::factory()
            ->for($this->serviceCreator)
            ->create();
        
        // Crear reservas (una pendiente, una completada)
        $this->booking = Booking::factory()
            ->for($this->user)
            ->for($this->service)
            ->create(['status' => 'pendiente']);
            
        $this->completedBooking = Booking::factory()
            ->for($this->user)
            ->for($this->service)
            ->create(['status' => 'completada']);
    }
}
```

---

## Tests de Endpoints Públicos

### 1. GET /api/reviews - Listar todas las reseñas

```php
/** @test */
public function can_list_all_reviews()
{
    // Crear reseñas
    $reviews = Review::factory(3)
        ->create(['service_id' => $this->service->id]);
    
    // Request
    $response = $this->getJson('/api/reviews');
    
    // Assertions
    $response->assertStatus(200)
        ->assertJson(['success' => true])
        ->assertJsonCount(3, 'data');
}

/** @test */
public function can_filter_reviews_by_service()
{
    $service1 = Service::factory()->create();
    $service2 = Service::factory()->create();
    
    Review::factory(2)->create(['service_id' => $service1->id]);
    Review::factory(3)->create(['service_id' => $service2->id]);
    
    $response = $this->getJson("/api/reviews?service_id={$service1->id}");
    
    $response->assertStatus(200)
        ->assertJsonCount(2, 'data');
}

/** @test */
public function returns_reviews_with_relationships()
{
    $review = Review::factory()
        ->create(['service_id' => $this->service->id]);
    
    $response = $this->getJson('/api/reviews');
    
    $response->assertStatus(200)
        ->assertJsonPath('data.0.user.name', $review->user->name)
        ->assertJsonPath('data.0.service.title', $review->service->title);
}
```

### 2. GET /api/reviews/service/{serviceId} - Reseñas de un servicio

```php
/** @test */
public function can_get_service_reviews_with_average_rating()
{
    Review::factory(3)->create([
        'service_id' => $this->service->id,
        'rating' => 5,
    ]);
    Review::factory(1)->create([
        'service_id' => $this->service->id,
        'rating' => 3,
    ]);
    
    $response = $this->getJson("/api/reviews/service/{$this->service->id}");
    
    $response->assertStatus(200)
        ->assertJsonPath('data.average_rating', 4.5)
        ->assertJsonCount(4, 'data.reviews');
}

/** @test */
public function returns_404_for_nonexistent_service()
{
    $response = $this->getJson('/api/reviews/service/99999');
    
    $response->assertStatus(404);
}
```

### 3. GET /api/reviews/{id} - Obtener una reseña

```php
/** @test */
public function can_get_single_review()
{
    $review = Review::factory()->create();
    
    $response = $this->getJson("/api/reviews/{$review->id}");
    
    $response->assertStatus(200)
        ->assertJson(['success' => true])
        ->assertJsonPath('data.id', $review->id)
        ->assertJsonPath('data.rating', $review->rating);
}

/** @test */
public function returns_404_for_nonexistent_review()
{
    $response = $this->getJson('/api/reviews/99999');
    
    $response->assertStatus(404)
        ->assertJson(['success' => false]);
}
```

---

## Tests de Endpoints Protegidos - Crear Reseña

### 4. POST /api/reviews - Crear reseña

```php
/** @test */
public function authenticated_user_can_create_review_for_completed_booking()
{
    $response = $this->actingAs($this->user)
        ->postJson('/api/reviews', [
            'booking_id' => $this->completedBooking->id,
            'rating' => 5,
            'comment' => 'Excelente servicio',
        ]);
    
    $response->assertStatus(201)
        ->assertJson(['success' => true])
        ->assertJsonPath('data.rating', 5)
        ->assertJsonPath('data.comment', 'Excelente servicio');
    
    // Verificar en BD
    $this->assertDatabaseHas('reviews', [
        'booking_id' => $this->completedBooking->id,
        'user_id' => $this->user->id,
        'rating' => 5,
    ]);
}

/** @test */
public function review_requires_rating_between_1_and_5()
{
    $response = $this->actingAs($this->user)
        ->postJson('/api/reviews', [
            'booking_id' => $this->completedBooking->id,
            'rating' => 0,
            'comment' => 'Test',
        ]);
    
    $response->assertStatus(400)
        ->assertJson(['success' => false]);
    
    // Rating 6 también falla
    $response = $this->actingAs($this->user)
        ->postJson('/api/reviews', [
            'booking_id' => $this->completedBooking->id,
            'rating' => 6,
            'comment' => 'Test',
        ]);
    
    $response->assertStatus(400);
}

/** @test */
public function cannot_create_review_for_pending_booking()
{
    $response = $this->actingAs($this->user)
        ->postJson('/api/reviews', [
            'booking_id' => $this->booking->id,  // pendiente
            'rating' => 5,
            'comment' => 'Test',
        ]);
    
    $response->assertStatus(400)
        ->assertJsonPath('message', 'Solo se pueden reseñar reservas completadas');
}

/** @test */
public function cannot_create_duplicate_review_for_same_booking()
{
    // Primera reseña
    $this->actingAs($this->user)
        ->postJson('/api/reviews', [
            'booking_id' => $this->completedBooking->id,
            'rating' => 5,
            'comment' => 'Primera',
        ]);
    
    // Segunda reseña del mismo booking
    $response = $this->actingAs($this->user)
        ->postJson('/api/reviews', [
            'booking_id' => $this->completedBooking->id,
            'rating' => 4,
            'comment' => 'Segunda',
        ]);
    
    $response->assertStatus(400)
        ->assertJsonPath('message', 'Ya existe una reseña para esta reserva');
}

/** @test */
public function cannot_review_booking_not_owned_by_user()
{
    $otherUser = User::factory()->create();
    $otherBooking = Booking::factory()
        ->for($otherUser)
        ->for($this->service)
        ->create(['status' => 'completada']);
    
    $response = $this->actingAs($this->user)
        ->postJson('/api/reviews', [
            'booking_id' => $otherBooking->id,
            'rating' => 5,
            'comment' => 'Test',
        ]);
    
    $response->assertStatus(403)
        ->assertJsonPath('message', 'No tienes permiso para reseñar esta reserva');
}

/** @test */
public function unauthenticated_user_cannot_create_review()
{
    $response = $this->postJson('/api/reviews', [
        'booking_id' => $this->completedBooking->id,
        'rating' => 5,
        'comment' => 'Test',
    ]);
    
    $response->assertStatus(401);
}

/** @test */
public function creates_review_with_optional_comment()
{
    $response = $this->actingAs($this->user)
        ->postJson('/api/reviews', [
            'booking_id' => $this->completedBooking->id,
            'rating' => 4,
            // Sin comentario
        ]);
    
    $response->assertStatus(201)
        ->assertJsonPath('data.comment', null);
}

/** @test */
public function comment_cannot_exceed_1000_characters()
{
    $longComment = str_repeat('a', 1001);
    
    $response = $this->actingAs($this->user)
        ->postJson('/api/reviews', [
            'booking_id' => $this->completedBooking->id,
            'rating' => 5,
            'comment' => $longComment,
        ]);
    
    $response->assertStatus(400);
}

/** @test */
public function creates_review_and_updates_service_average_rating()
{
    // Rating actual: 0
    $this->assertEquals(0, $this->service->average_rating);
    
    $this->actingAs($this->user)
        ->postJson('/api/reviews', [
            'booking_id' => $this->completedBooking->id,
            'rating' => 5,
        ]);
    
    // Verificar que se actualizó
    $this->service->refresh();
    $this->assertEquals(5, $this->service->average_rating);
}
```

---

## Tests de Endpoints Protegidos - Actualizar Reseña

### 5. PUT /api/reviews/{id} - Actualizar reseña

```php
/** @test */
public function user_can_update_own_review()
{
    $review = Review::factory()->create([
        'user_id' => $this->user->id,
        'rating' => 3,
        'comment' => 'Original',
    ]);
    
    $response = $this->actingAs($this->user)
        ->putJson("/api/reviews/{$review->id}", [
            'rating' => 5,
            'comment' => 'Actualizado',
        ]);
    
    $response->assertStatus(200)
        ->assertJsonPath('data.rating', 5)
        ->assertJsonPath('data.comment', 'Actualizado');
    
    $this->assertDatabaseHas('reviews', [
        'id' => $review->id,
        'rating' => 5,
        'comment' => 'Actualizado',
    ]);
}

/** @test */
public function user_cannot_update_other_users_review()
{
    $review = Review::factory()->create([
        'user_id' => $this->serviceCreator->id,
    ]);
    
    $response = $this->actingAs($this->user)
        ->putJson("/api/reviews/{$review->id}", [
            'rating' => 1,
        ]);
    
    $response->assertStatus(403)
        ->assertJsonPath('message', 'No tienes permiso para editar esta reseña');
}

/** @test */
public function can_update_partial_fields_in_review()
{
    $review = Review::factory()->create([
        'user_id' => $this->user->id,
        'rating' => 3,
        'comment' => 'Original',
    ]);
    
    // Solo actualizar rating
    $response = $this->actingAs($this->user)
        ->putJson("/api/reviews/{$review->id}", [
            'rating' => 5,
        ]);
    
    $response->assertStatus(200)
        ->assertJsonPath('data.rating', 5)
        ->assertJsonPath('data.comment', 'Original'); // Se mantiene
}

/** @test */
public function updating_review_recalculates_service_average()
{
    Review::factory(2)->create([
        'service_id' => $this->service->id,
        'rating' => 4,
    ]);
    
    $review = Review::factory()->create([
        'service_id' => $this->service->id,
        'user_id' => $this->user->id,
        'rating' => 2,
    ]);
    
    // Promedio actual: (4 + 4 + 2) / 3 = 3.33
    
    $this->actingAs($this->user)
        ->putJson("/api/reviews/{$review->id}", [
            'rating' => 5,
        ]);
    
    // Promedio nuevo: (4 + 4 + 5) / 3 = 4.33
    $this->service->refresh();
    $this->assertEquals(4.33, round($this->service->average_rating, 2));
}
```

---

## Tests de Endpoints Protegidos - Eliminar Reseña

### 6. DELETE /api/reviews/{id} - Eliminar reseña

```php
/** @test */
public function user_can_delete_own_review()
{
    $review = Review::factory()->create([
        'user_id' => $this->user->id,
    ]);
    
    $response = $this->actingAs($this->user)
        ->deleteJson("/api/reviews/{$review->id}");
    
    $response->assertStatus(200)
        ->assertJson(['success' => true]);
    
    $this->assertDatabaseMissing('reviews', [
        'id' => $review->id,
    ]);
}

/** @test */
public function user_cannot_delete_other_users_review()
{
    $review = Review::factory()->create([
        'user_id' => $this->serviceCreator->id,
    ]);
    
    $response = $this->actingAs($this->user)
        ->deleteJson("/api/reviews/{$review->id}");
    
    $response->assertStatus(403);
}

/** @test */
public function deleting_review_recalculates_service_average()
{
    Review::factory(2)->create([
        'service_id' => $this->service->id,
        'rating' => 5,
    ]);
    
    $review = Review::factory()->create([
        'service_id' => $this->service->id,
        'user_id' => $this->user->id,
        'rating' => 1,
    ]);
    
    // Promedio actual: (5 + 5 + 1) / 3 = 3.67
    
    $this->actingAs($this->user)
        ->deleteJson("/api/reviews/{$review->id}");
    
    // Promedio nuevo: (5 + 5) / 2 = 5
    $this->service->refresh();
    $this->assertEquals(5, $this->service->average_rating);
}
```

---

## Tests de GET /api/reviews/user/me

### 7. Obtener mis reseñas

```php
/** @test */
public function authenticated_user_can_get_own_reviews()
{
    Review::factory(3)->create(['user_id' => $this->user->id]);
    Review::factory(2)->create(); // De otros usuarios
    
    $response = $this->actingAs($this->user)
        ->getJson('/api/reviews/user/me');
    
    $response->assertStatus(200)
        ->assertJsonCount(3, 'data');
}

/** @test */
public function unauthenticated_user_cannot_get_my_reviews()
{
    $response = $this->getJson('/api/reviews/user/me');
    
    $response->assertStatus(401);
}
```

---

## Tests de Validación

### 8. Form Request Validations

```php
/** @test */
public function review_store_request_requires_booking_id()
{
    $response = $this->actingAs($this->user)
        ->postJson('/api/reviews', [
            'rating' => 5,
        ]);
    
    $response->assertStatus(400);
}

/** @test */
public function review_store_request_requires_valid_booking()
{
    $response = $this->actingAs($this->user)
        ->postJson('/api/reviews', [
            'booking_id' => 99999,
            'rating' => 5,
        ]);
    
    $response->assertStatus(400);
}

/** @test */
public function review_update_allows_partial_updates()
{
    $review = Review::factory()->create([
        'user_id' => $this->user->id,
    ]);
    
    // Solo enviar rating
    $response = $this->actingAs($this->user)
        ->putJson("/api/reviews/{$review->id}", [
            'rating' => 3,
        ]);
    
    $response->assertStatus(200);
}
```

---

## Tests de Integración

### 9. Flujo Completo: Reserva → Reseña → Rating

```php
/** @test */
public function complete_flow_booking_to_review_to_rating()
{
    // Paso 1: Verificar booking completada
    $this->assertEquals('completada', $this->completedBooking->status);
    
    // Paso 2: Crear reseña
    $response = $this->actingAs($this->user)
        ->postJson('/api/reviews', [
            'booking_id' => $this->completedBooking->id,
            'rating' => 5,
            'comment' => 'Excelente',
        ]);
    
    $this->assertEquals(201, $response->status());
    $review = Review::latest()->first();
    
    // Paso 3: Verificar que el rating se actualizó
    $this->service->refresh();
    $this->assertEquals(5, $this->service->average_rating);
    
    // Paso 4: Obtener reseñas del servicio
    $response = $this->getJson("/api/reviews/service/{$this->service->id}");
    $this->assertCount(1, $response['data']['reviews']);
    $this->assertEquals(5, $response['data']['average_rating']);
}

/** @test */
public function multiple_reviews_calculate_correct_average()
{
    $ratings = [5, 4, 3, 2, 1];
    
    foreach ($ratings as $index => $rating) {
        $booking = Booking::factory()
            ->for($this->service)
            ->create(['status' => 'completada']);
        
        $user = User::factory()->create();
        
        $this->actingAs($user)
            ->postJson('/api/reviews', [
                'booking_id' => $booking->id,
                'rating' => $rating,
            ]);
    }
    
    $this->service->refresh();
    // (5 + 4 + 3 + 2 + 1) / 5 = 3
    $this->assertEquals(3, $this->service->average_rating);
}
```

---

## Ejecutar los Tests

```bash
# Ejecutar todos los tests de reviews
php artisan test tests/Feature/ReviewTest.php

# Ejecutar un test específico
php artisan test tests/Feature/ReviewTest.php --filter="can_create_review"

# Con coverage
php artisan test tests/Feature/ReviewTest.php --coverage

# Modo watch (Pest)
pest --watch
```

---

## Cobertura de Tests

### Backend
- ✅ Endpoints públicos (GET)
- ✅ Endpoints protegidos (POST, PUT, DELETE)
- ✅ Validaciones (Form Requests)
- ✅ Reglas de negocio (una reseña por booking, reserva completada)
- ✅ Autorización (solo dueños pueden editar/eliminar)
- ✅ Cálculo automático de promedio
- ✅ Manejo de errores

### Frontend (Jest/Vitest)
```typescript
// tests/components/rating-stars.test.tsx
// tests/components/review-card.test.tsx
// tests/components/review-form.test.tsx
// tests/components/review-list.test.tsx
// tests/hooks/useReviews.test.ts
```

---

## Consideraciones

1. **Factories**: Usar `Review::factory()` para crear datos de test
2. **Auth**: Usar `$this->actingAs($user)` para simular usuario autenticado
3. **Database**: `RefreshDatabase` limpia BD entre tests
4. **Assertions**: JSON assertions para validar respuestas API
5. **Edge Cases**: Probar valores límite (ratings 0, 6, comments 1001 chars, etc)
