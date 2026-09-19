<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['region_id', 'name', 'slug', 'code', 'description', 'cover_image'])]
class State extends Model
{
    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function cities(): HasMany
    {
        return $this->hasMany(City::class);
    }
}
