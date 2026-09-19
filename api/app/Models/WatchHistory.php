<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'video_id', 'position_seconds', 'duration_seconds', 'completed', 'watched_at'])]
class WatchHistory extends Model
{
    protected $table = 'watch_history';

    protected function casts(): array
    {
        return [
            'completed' => 'boolean',
            'watched_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function video(): BelongsTo
    {
        return $this->belongsTo(Video::class);
    }
}
