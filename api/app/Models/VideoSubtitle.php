<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['video_id', 'language', 'label', 'file_path', 'format', 'is_default'])]
class VideoSubtitle extends Model
{
    protected function casts(): array
    {
        return ['is_default' => 'boolean'];
    }

    public function video(): BelongsTo
    {
        return $this->belongsTo(Video::class);
    }
}
