import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CompassRose } from '../components/CompassRose'
import { Api } from '../lib/api'
import { apiErrorMessage } from '../lib/errors'

const MIN_PASSWORD = 8

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const emailFromUrl = params.get('email') || ''

  const [email, setEmail] = useState(emailFromUrl)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const tooShort = password.length > 0 && password.length < MIN_PASSWORD
  const mismatch = confirm.length > 0 && confirm !== password

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Informe seu e-mail.')
      return
    }
    if (password.length < MIN_PASSWORD) {
      setError(`A senha precisa ter no mínimo ${MIN_PASSWORD} caracteres.`)
      return
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    try {
      await Api.resetPassword(token, email.trim(), password, confirm)
      setDone(true)
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível redefinir a senha. Solicite um novo link.'))
    } finally {
      setLoading(false)
    }
  }

  const invalidLink = !token

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-[72px]">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-40 top-1/2 hidden -translate-y-1/2 lg:block"
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
          Nova senha
        </h1>

        {invalidLink ? (
          <>
            <p className="mt-3 text-sm leading-relaxed text-neve-400">
              Este link está incompleto ou expirou. Solicite um novo para redefinir sua senha.
            </p>
            <Link to="/recuperar-senha" className="btn-invert mt-10 block w-full text-center">
              Solicitar novo link
            </Link>
          </>
        ) : done ? (
          <>
            <p className="mt-3 text-sm leading-relaxed text-neve-400">
              Sua senha foi redefinida. Entre com a nova senha para continuar.
            </p>
            <Link to="/entrar" className="btn-invert mt-10 block w-full text-center">
              Entrar
            </Link>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm leading-relaxed text-neve-400">Crie uma nova senha para sua conta.</p>

            <form onSubmit={onSubmit} className="mt-12 space-y-8" noValidate>
              {error && (
                <p role="alert" className="border-l-2 border-white/40 pl-3 text-[0.8125rem] leading-relaxed text-neve-300">
                  {error}{' '}
                  {error.includes('expirou') && (
                    <Link to="/recuperar-senha" className="border-b border-white/30 pb-0.5 text-white hover:border-white">
                      Pedir novo link
                    </Link>
                  )}
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

              <div>
                <label className="group block">
                  <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-neve-500 transition-colors group-focus-within:text-neve-300">
                    Nova senha
                  </span>
                  <input
                    type={show ? 'text' : 'password'}
                    required
                    value={password}
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={tooShort || undefined}
                    className={`mt-2.5 w-full border-0 border-b bg-transparent pb-2.5 text-[0.9375rem] text-white transition-colors duration-300 focus:outline-none ${
                      tooShort ? 'border-red-400/70 focus:border-red-400' : 'border-white/15 focus:border-white'
                    }`}
                  />
                </label>
                <span className={`mt-2 block text-[0.75rem] leading-relaxed ${tooShort ? 'text-red-400/90' : 'text-neve-500'}`}>
                  Mínimo de {MIN_PASSWORD} caracteres. Dica: combine letras, números e símbolos.
                </span>
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="mt-2 text-[0.6875rem] uppercase tracking-[0.18em] text-neve-500 transition-colors hover:text-white"
                >
                  {show ? 'Ocultar senha' : 'Mostrar senha'}
                </button>
              </div>

              <div>
                <label className="group block">
                  <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-neve-500 transition-colors group-focus-within:text-neve-300">
                    Confirmar senha
                  </span>
                  <input
                    type={show ? 'text' : 'password'}
                    required
                    value={confirm}
                    autoComplete="new-password"
                    onChange={(e) => setConfirm(e.target.value)}
                    aria-invalid={mismatch || undefined}
                    className={`mt-2.5 w-full border-0 border-b bg-transparent pb-2.5 text-[0.9375rem] text-white transition-colors duration-300 focus:outline-none ${
                      mismatch ? 'border-red-400/70 focus:border-red-400' : 'border-white/15 focus:border-white'
                    }`}
                  />
                </label>
                {mismatch && <span className="mt-2 block text-[0.75rem] text-red-400/90">As senhas não coincidem.</span>}
              </div>

              <button type="submit" disabled={loading} className="btn-invert w-full disabled:opacity-50">
                {loading ? 'Salvando…' : 'Redefinir senha'}
              </button>
            </form>
          </>
        )}

        <p className="mt-10 text-center text-[0.8125rem] text-neve-400">
          <Link to="/entrar" className="border-b border-white/30 pb-0.5 text-white transition-colors hover:border-white">
            Voltar para entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
