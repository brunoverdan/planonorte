<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['video_id', 'label', 'width', 'height', 'bitrate_kbps', 'file_path', 'mime_type'])]
class VideoQuality extends Model
{
    public function video(): BelongsTo
    {
        return $this->belongsTo(Video::class);
    }
}
