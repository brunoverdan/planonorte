import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('E-mail ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container-norte flex min-h-[70vh] items-center justify-center py-10">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-norte-800 bg-norte-850 p-6">
        <h1 className="font-display text-2xl font-bold text-areia-100">Entrar</h1>
        <p className="mt-1 text-sm text-areia-400">Acesse sua conta PlanoNorte.</p>

        {error ? <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p> : null}

        <label className="mt-4 block text-sm text-areia-300">
          E-mail
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-norte-700 bg-norte-900 px-3 py-2 text-areia-100 focus:border-ambar-500 focus:outline-none"
          />
        </label>

        <label className="mt-4 block text-sm text-areia-300">
          Senha
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-norte-700 bg-norte-900 px-3 py-2 text-areia-100 focus:border-ambar-500 focus:outline-none"
          />
        </label>

        <button
          type="submit" disabled={loading}
          className="mt-6 w-full rounded-lg bg-ambar-500 py-2.5 font-semibold text-norte-950 hover:bg-ambar-400 disabled:opacity-60"
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>

        <p className="mt-4 text-center text-sm text-areia-400">
          Não tem conta? <Link to="/cadastro" className="text-ambar-400 hover:underline">Criar conta</Link>
        </p>
      </form>
    </main>
  )
}
