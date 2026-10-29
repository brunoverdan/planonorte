<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug', 'code', 'description', 'cover_image'])]
class Country extends Model
{
    public function regions(): HasMany
    {
        return $this->hasMany(Region::class);
    }
}
