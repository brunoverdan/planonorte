<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

#[Fillable([
    'producer_id', 'city_id', 'event_id', 'created_by', 'title', 'slug',
    'description', 'short_description', 'year', 'source_type', 'embed_provider',
    'embed_id', 'embed_url', 'video_path', 'duration_seconds', 'thumbnail',
    'trailer_embed_id', 'status', 'published_at', 'scheduled_at', 'is_featured',
    'is_free', 'credits', 'rights', 'age_rating',
])]
class Video extends Model
{
    use SoftDeletes;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_IN_REVIEW = 'in_review';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_ARCHIVED = 'archived';

    protected function casts(): array
    {
        return [
            'credits' => 'array',
            'rights' => 'array',
            'is_featured' => 'boolean',
            'is_free' => 'boolean',
            'published_at' => 'datetime',
            'scheduled_at' => 'datetime',
        ];
    }

    // ---- Relações ----
    public function producer(): BelongsTo
    {
        return $this->belongsTo(Producer::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'video_categories');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'video_tags');
    }

    public function subtitles(): HasMany
    {
        return $this->hasMany(VideoSubtitle::class);
    }

    public function qualities(): HasMany
    {
        return $this->hasMany(VideoQuality::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ContentReview::class);
    }

    public function views(): HasMany
    {
        return $this->hasMany(VideoView::class);
    }

    // ---- Scopes ----
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PUBLISHED)
            ->where(function (Builder $q) {
                $q->whereNull('published_at')->orWhere('published_at', '<=', now());
            });
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->published()->where('is_featured', true);
    }

    // ---- Helpers ----
    public function getEmbedUrlAttribute(): ?string
    {
        if ($this->source_type !== 'embed' || empty($this->embed_id)) {
            return null;
        }

        return match ($this->embed_provider) {
            'youtube' => "https://www.youtube.com/embed/{$this->embed_id}",
            'vimeo' => "https://player.vimeo.com/video/{$this->embed_id}",
            default => $this->embed_url,
        };
    }

    public static function booted(): void
    {
        static::creating(function (self $model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->title).'-'.Str::lower(Str::random(5));
            }
        });
    }
}
