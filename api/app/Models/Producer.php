<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable([
    'user_id', 'city_id', 'type', 'name', 'slug', 'logo', 'cover_image',
    'bio', 'website', 'social_links', 'email', 'phone', 'is_verified', 'is_active',
])]
class Producer extends Model
{
    protected function casts(): array
    {
        return [
            'social_links' => 'array',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function videos(): HasMany
    {
        return $this->hasMany(Video::class);
    }

    public static function booted(): void
    {
        static::creating(function (self $model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name).'-'.Str::lower(Str::random(4));
            }
        });
    }
}
