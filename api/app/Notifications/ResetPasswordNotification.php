<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

/**
 * E-mail de redefinição de senha com a identidade visual do PlanoNorte.
 * A URL aponta para a SPA (/redefinir-senha?token=...&email=...).
 */
class ResetPasswordNotification extends ResetPassword
{
    protected function resetUrl($notifiable)
    {
        $base = rtrim((string) config('app.frontend_url', config('app.url')), '/');

        return $base.'/redefinir-senha?'.http_build_query([
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ]);
    }

    public function toMail($notifiable)
    {
        $url = $this->resetUrl($notifiable);

        return (new MailMessage)
            ->subject('Redefinir sua senha — '.config('app.name'))
            ->view('emails.reset-password', [
                'url' => $url,
                'user' => $notifiable,
            ])
            ->line('Se você não pediu a redefinição, ignore este e-mail — sua senha continua a mesma.');
    }
}
