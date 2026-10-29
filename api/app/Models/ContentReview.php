<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['video_id', 'reviewer_id', 'from_status', 'to_status', 'notes'])]
class ContentReview extends Model
{
    public function video(): BelongsTo
    {
        return $this->belongsTo(Video::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
