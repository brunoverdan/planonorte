<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

class PasswordResetController extends Controller
{
    /**
     * Envia o link de redefinição de senha por e-mail.
     * Responde 200 mesmo quando o e-mail não existe (evita enumerar contas).
     */
    public function sendResetLink(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $status = Password::sendResetLink(['email' => $data['email']]);

        if ($status === Password::INVALID_USER) {
            return response()->json([
                'message' => 'Se este e-mail estiver cadastrado, enviaremos um link de redefinição.',
            ]);
        }

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => ['Não foi possível enviar o e-mail agora. Tente novamente em alguns minutos.'],
            ]);
        }

        return response()->json([
            'message' => 'Link enviado. Confira sua caixa de entrada (e o spam).',
        ]);
    }

    /**
     * Redefine a senha usando token + e-mail.
     */
    public function reset(Request $request)
    {
        $data = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
        ]);

        $status = Password::reset(
            $data,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                // Encerra sessões/tokens antigos por segurança
                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Senha redefinida. Você já pode entrar com a nova senha.']);
        }

        $message = match ($status) {
            Password::INVALID_TOKEN => 'Este link de redefinição expirou ou já foi usado. Solicite um novo.',
            Password::INVALID_USER => 'Não encontramos uma conta com este e-mail.',
            default => 'Não foi possível redefinir a senha. Tente novamente.',
        };

        throw ValidationException::withMessages(['email' => [$message]]);
    }
}
