<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable([
    'city_id', 'venue_id', 'organizer_producer_id', 'created_by', 'name', 'slug',
    'description', 'start_date', 'end_date', 'start_time', 'address', 'cover_image',
    'schedule', 'organizers', 'status',
])]
class Event extends Model
{
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'schedule' => 'array',
            'organizers' => 'array',
        ];
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(Producer::class, 'organizer_producer_id');
    }

    public function videos(): HasMany
    {
        return $this->hasMany(Video::class);
    }

    public static function booted(): void
    {
        static::creating(function (self $model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name).'-'.Str::lower(Str::random(5));
            }
        });
    }
}
