import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CompassRose } from '../components/CompassRose'
import { Api } from '../lib/api'
import { apiErrorMessage } from '../lib/errors'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Informe seu e-mail.')
      return
    }

    setLoading(true)
    try {
      await Api.forgotPassword(email.trim())
      setSent(true)
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível enviar o link agora. Tente novamente.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-[72px]">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 top-1/2 hidden -translate-y-1/2 lg:block"
        aria-hidden="true"
      >
        <CompassRose size={560} strokeWidth={0.5} className="animate-slow-spin text-white opacity-[0.06]" />
      </div>

      <div className="relative z-10 w-full max-w-sm py-20">
        <div className="flex items-center gap-3.5">
          <CompassRose size={14} className="text-neve-600" />
          <p className="eyebrow">Acesso</p>
        </div>

        <h1 className="mt-6 font-display text-4xl font-light leading-tight tracking-tight text-white">
          Recuperar senha
        </h1>

        {sent ? (
          <>
            <p className="mt-3 text-sm leading-relaxed text-neve-400">
              Se este e-mail estiver cadastrado, enviaremos um link de redefinição. O link vale por 60 minutos.
            </p>
            <p className="mt-6 text-[0.8125rem] leading-relaxed text-neve-500">
              Não chegou? Confira a caixa de spam ou{' '}
              <button
                type="button"
                onClick={() => setSent(false)}
                className="border-b border-white/30 pb-0.5 text-white transition-colors hover:border-white"
              >
                enviar novamente
              </button>
              .
            </p>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm leading-relaxed text-neve-400">
              Informe o e-mail da sua conta e enviaremos um link para criar uma nova senha.
            </p>

            <form onSubmit={onSubmit} className="mt-12 space-y-8" noValidate>
              {error && (
                <p role="alert" className="border-l-2 border-white/40 pl-3 text-[0.8125rem] leading-relaxed text-neve-300">
                  {error}
                </p>
              )}

              <label className="group block">
                <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-neve-500 transition-colors group-focus-within:text-neve-300">
                  E-mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2.5 w-full border-0 border-b border-white/15 bg-transparent pb-2.5 text-[0.9375rem] text-white transition-colors duration-300 focus:border-white focus:outline-none"
                />
              </label>

              <button type="submit" disabled={loading} className="btn-invert w-full disabled:opacity-50">
                {loading ? 'Enviando…' : 'Enviar link'}
              </button>
            </form>
          </>
        )}

        <div className="mt-12 flex items-center gap-4">
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          <span className="text-[0.5625rem] uppercase tracking-[0.22em] text-neve-600">ou</span>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
        </div>

        <p className="mt-8 text-center text-[0.8125rem] text-neve-400">
          Lembrou a senha?{' '}
          <Link to="/entrar" className="border-b border-white/30 pb-0.5 text-white transition-colors hover:border-white">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
