{{ config('app.name') }} — Redefinir sua senha

Recebemos um pedido para redefinir a senha da conta {{ ($user ?? null)->email ?? '' }}.
O link é válido por 60 minutos e só pode ser usado uma vez.

{{ $url }}

Se você não pediu a redefinição, ignore este e-mail.
