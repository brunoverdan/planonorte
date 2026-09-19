<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role', 'avatar', 'cultural_preferences', 'is_active'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    public const ROLE_USER = 'usuario';
    public const ROLE_PRODUCER = 'produtor';
    public const ROLE_REVIEWER = 'revisor';
    public const ROLE_ADMIN = 'admin';
    public const ROLE_SUPER_ADMIN = 'super-admin';

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'cultural_preferences' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function producer(): HasOne
    {
        return $this->hasOne(Producer::class);
    }

    public function watchHistory(): HasMany
    {
        return $this->hasMany(WatchHistory::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function hasRole(string ...$roles): bool
    {
        return in_array($this->role, $roles, true);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(self::ROLE_ADMIN, self::ROLE_SUPER_ADMIN);
    }

    public function isReviewer(): bool
    {
        return $this->hasRole(self::ROLE_REVIEWER, self::ROLE_ADMIN, self::ROLE_SUPER_ADMIN);
    }
}
