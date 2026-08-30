<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'description',
        'phone',
        'location',
        'latitude',
        'longitude',
        'avatar',
        'profession',
        'experience_years',
        'skills',
    ];

    protected function casts(): array
    {
        return [
            'experience_years' => 'integer',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
