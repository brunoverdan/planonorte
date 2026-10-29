<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['city_id', 'name', 'slug', 'address', 'latitude', 'longitude', 'description'])]
class Venue extends Model
{
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
