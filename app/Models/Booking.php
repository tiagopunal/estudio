<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'service_id',
        'date',
        'status',
    ];

    // 🔥 reserva pertenece a usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 🔥 reserva pertenece a servicio
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
