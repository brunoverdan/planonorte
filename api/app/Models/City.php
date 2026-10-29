<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['state_id', 'name', 'slug', 'description', 'cover_image', 'latitude', 'longitude'])]
class City extends Model
{
    public function state(): BelongsTo
    {
        return $this->belongsTo(State::class);
    }

    public function venues(): HasMany
    {
        return $this->hasMany(Venue::class);
    }

    public function videos(): HasMany
    {
        return $this->hasMany(Video::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
