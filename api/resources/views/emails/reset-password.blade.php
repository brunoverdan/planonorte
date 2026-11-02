@php($brand = config('app.name', 'PlanoNorte'))
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $brand }}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e5e5e5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
                    <tr>
                        <td style="padding-bottom:28px;">
                            <span style="font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#8a8a8a;">{{ $brand }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="border-top:1px solid #262626;padding-top:32px;">
                            <h1 style="margin:0 0 16px;font-size:24px;font-weight:300;color:#ffffff;">Redefinir sua senha</h1>
                            <p style="margin:0 0 12px;font-size:14px;line-height:1.65;color:#b3b3b3;">
                                Recebemos um pedido para redefinir a senha da conta <strong style="color:#e5e5e5;">{{ ($user ?? null)->email ?? (request()->input('email') ?? '') }}</strong>.
                            </p>
                            <p style="margin:0 0 28px;font-size:14px;line-height:1.65;color:#b3b3b3;">O link é válido por 60 minutos e só pode ser usado uma vez.</p>

                            <a href="{{ $url }}" style="display:inline-block;background:#ffffff;color:#0a0a0a;text-decoration:none;padding:14px 28px;font-size:13px;font-weight:500;letter-spacing:0.04em;">Redefinir senha</a>

                            <p style="margin:28px 0 0;font-size:12px;line-height:1.6;color:#6f6f6f;">
                                Se o botão não funcionar, copie e cole este endereço no navegador:<br>
                                <span style="color:#8a8a8a;word-break:break-all;">{{ $url }}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="border-top:1px solid #262626;padding-top:20px;margin-top:32px;">
                            <p style="margin:0;font-size:12px;line-height:1.6;color:#6f6f6f;">
                                Se você não pediu a redefinição, ignore este e-mail — sua senha continua a mesma.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
