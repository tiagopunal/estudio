<?php

namespace App\Models;

use App\Enums\Role;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected static function booted(): void
    {
        static::created(function (User $user): void {
            $user->profile()->create([
                'full_name' => $user->name,
            ]);
            $user->wallet()->create([
                'currency' => 'ARS',
            ]);
        });
    }

    public function isClient(): bool
    {
        return $this->role === Role::CLIENT;
    }

    public function isProfessional(): bool
    {
        return $this->role === Role::PROFESSIONAL;
    }

    // RELACIONES GLOBALES

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }
}
