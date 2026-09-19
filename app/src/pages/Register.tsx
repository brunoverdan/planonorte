import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('As senhas não coincidem.')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.confirm)
      navigate('/')
    } catch {
      setError('Não foi possível criar a conta. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container-norte flex min-h-[70vh] items-center justify-center py-10">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-norte-800 bg-norte-850 p-6">
        <h1 className="font-display text-2xl font-bold text-areia-100">Criar conta</h1>
        <p className="mt-1 text-sm text-areia-400">Descubra e salve a cultura brasileira.</p>

        {error ? <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p> : null}

        {[
          ['name', 'Nome', 'text'],
          ['email', 'E-mail', 'email'],
          ['password', 'Senha', 'password'],
          ['confirm', 'Confirmar senha', 'password'],
        ].map(([key, label, type]) => (
          <label key={key} className="mt-4 block text-sm text-areia-300">
            {label}
            <input
              type={type} required value={form[key as keyof typeof form]}
              onChange={(e) => set(key, e.target.value)}
              className="mt-1 w-full rounded-lg border border-norte-700 bg-norte-900 px-3 py-2 text-areia-100 focus:border-ambar-500 focus:outline-none"
            />
          </label>
        ))}

        <button
          type="submit" disabled={loading}
          className="mt-6 w-full rounded-lg bg-ambar-500 py-2.5 font-semibold text-norte-950 hover:bg-ambar-400 disabled:opacity-60"
        >
          {loading ? 'Criando…' : 'Criar conta'}
        </button>

        <p className="mt-4 text-center text-sm text-areia-400">
          Já tem conta? <Link to="/entrar" className="text-ambar-400 hover:underline">Entrar</Link>
        </p>
      </form>
    </main>
  )
}
