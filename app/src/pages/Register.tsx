import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CompassRose } from '../components/CompassRose'
import { useAuth } from '../context/AuthContext'
import { apiErrorMessage } from '../lib/errors'

const MIN_PASSWORD = 8

/** Campo de formulário com estética editorial (linha inferior, sem caixa) */
function Field({
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  hint,
  invalid,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
  hint?: React.ReactNode
  invalid?: boolean
}) {
  return (
    <label className="group block">
      <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-neve-500 transition-colors group-focus-within:text-neve-300">
        {label}
      </span>
      <input
        type={type}
        required
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        className={`mt-2.5 w-full border-0 border-b bg-transparent pb-2.5 text-[0.9375rem] text-white transition-colors duration-300 focus:outline-none ${
          invalid ? 'border-red-400/70 focus:border-red-400' : 'border-white/15 focus:border-white'
        }`}
      />
      {hint && <span className="mt-2 block text-[0.75rem] leading-relaxed text-neve-500">{hint}</span>}
    </label>
  )
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  const tooShort = form.password.length > 0 && form.password.length < MIN_PASSWORD
  const mismatch = form.confirm.length > 0 && form.confirm !== form.password

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) {
      setError('Informe seu nome.')
      return
    }
    if (!form.email.trim()) {
      setError('Informe seu e-mail.')
      return
    }
    if (form.password.length < MIN_PASSWORD) {
      setError(`A senha precisa ter no mínimo ${MIN_PASSWORD} caracteres.`)
      return
    }
    if (form.password !== form.confirm) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.confirm)
      navigate('/')
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível criar a conta. Tente novamente.'))
    } finally {
      setLoading(false)
    }
  }

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
          <p className="eyebrow">Começar</p>
        </div>

        <h1 className="mt-6 font-display text-4xl font-light leading-tight tracking-tight text-white">
          Criar conta
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neve-400">
          Acesso livre ao acervo. Sem custo, sem ruído.
        </p>

        <form onSubmit={onSubmit} className="mt-12 space-y-8" noValidate>
          {error && (
            <p role="alert" className="border-l-2 border-white/40 pl-3 text-[0.8125rem] leading-relaxed text-neve-300">
              {error}
              {error.includes('já está cadastrado') && (
                <>
                  {' '}
                  <Link
                    to="/recuperar-senha"
                    className="border-b border-white/30 pb-0.5 text-white transition-colors hover:border-white"
                  >
                    Recuperar senha
                  </Link>
                </>
              )}
            </p>
          )}

          <Field label="Nome" value={form.name} onChange={(v) => set('name', v)} autoComplete="name" />
          <Field label="E-mail" type="email" value={form.email} onChange={(v) => set('email', v)} autoComplete="email" />

          <div>
            <Field
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(v) => set('password', v)}
              autoComplete="new-password"
              invalid={tooShort}
              hint={
                <span className={tooShort ? 'text-red-400/90' : undefined}>
                  Mínimo de {MIN_PASSWORD} caracteres. Dica: combine letras, números e símbolos para uma senha mais forte.
                </span>
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="mt-2 text-[0.6875rem] uppercase tracking-[0.18em] text-neve-500 transition-colors hover:text-white"
            >
              {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            </button>
          </div>

          <Field
            label="Confirmar senha"
            type={showPassword ? 'text' : 'password'}
            value={form.confirm}
            onChange={(v) => set('confirm', v)}
            autoComplete="new-password"
            invalid={mismatch}
            hint={mismatch ? <span className="text-red-400/90">As senhas não coincidem.</span> : undefined}
          />

          <button type="submit" disabled={loading} className="btn-invert w-full disabled:opacity-50">
            {loading ? 'Criando…' : 'Criar conta'}
          </button>
        </form>

        <div className="mt-12 flex items-center gap-4">
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          <span className="text-[0.5625rem] uppercase tracking-[0.22em] text-neve-600">ou</span>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
        </div>

        <p className="mt-8 text-center text-[0.8125rem] text-neve-400">
          Já tem conta?{' '}
          <Link to="/entrar" className="border-b border-white/30 pb-0.5 text-white transition-colors hover:border-white">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
