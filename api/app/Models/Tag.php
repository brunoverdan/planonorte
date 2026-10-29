<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name', 'slug'])]
class Tag extends Model
{
    public function videos(): BelongsToMany
    {
        return $this->belongsToMany(Video::class, 'video_tags');
    }
}
