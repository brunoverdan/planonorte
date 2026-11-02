<?php

namespace App\Providers;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::define('admin', fn (User $user) => $user->isAdmin());
        Gate::define('reviewer', fn (User $user) => $user->isReviewer());

        // E-mail de redefinição de senha aponta para a SPA (front), não para o back
        ResetPassword::toMailUsing(function (User $user, string $token) {
            return (new ResetPasswordNotification($token))->toMail($user);
        });
    }
}
