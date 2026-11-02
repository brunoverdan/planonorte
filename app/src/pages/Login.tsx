import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CompassRose } from '../components/CompassRose'
import { useAuth } from '../context/AuthContext'
import { apiErrorMessage } from '../lib/errors'

/** Campo de formulário com estética editorial (linha inferior, sem caixa) */
function Field({
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  required = true,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
  required?: boolean
}) {
  return (
    <label className="group block">
      <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-neve-500 transition-colors group-focus-within:text-neve-300">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2.5 w-full border-0 border-b border-white/15 bg-transparent pb-2.5 text-[0.9375rem] text-white transition-colors duration-300 placeholder:text-neve-600 focus:border-white focus:outline-none"
      />
    </label>
  )
}

export { Field }

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Preencha e-mail e senha.')
      return
    }
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(apiErrorMessage(err, 'E-mail ou senha inválidos.'))
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
          Entrar
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neve-400">
          Acesse sua conta e continue de onde parou.
        </p>

        <form onSubmit={onSubmit} className="mt-12 space-y-8">
          {error && (
            <p role="alert" className="border-l-2 border-white/40 pl-3 text-[0.8125rem] leading-relaxed text-neve-300">{error}</p>
          )}

          <Field label="E-mail" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <Field label="Senha" type="password" value={password} onChange={setPassword} autoComplete="current-password" />

          <div className="-mt-4 text-right">
            <Link
              to="/recuperar-senha"
              className="text-[0.75rem] text-neve-500 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>

          <button type="submit" disabled={loading} className="btn-invert w-full disabled:opacity-50">
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className="mt-12 flex items-center gap-4">
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          <span className="text-[0.5625rem] uppercase tracking-[0.22em] text-neve-600">ou</span>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
        </div>

        <p className="mt-8 text-center text-[0.8125rem] text-neve-400">
          Não tem conta?{' '}
          <Link to="/cadastro" className="border-b border-white/30 pb-0.5 text-white transition-colors hover:border-white">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  )
}
