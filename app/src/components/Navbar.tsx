import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/', label: 'Início' },
  { to: '/explorar', label: 'Explorar' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/cidades', label: 'Cidades' },
  { to: '/produtores', label: 'Produtores' },
  { to: '/minha-lista', label: 'Minha Lista' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    if (q.trim()) navigate(`/busca?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-norte-800 bg-norte-950/90 backdrop-blur">
      <div className="container-norte flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/logo-planonorte.png"
            alt="Plan Norte"
            className="h-8 w-auto select-none"
            draggable={false}
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                location.pathname === item.to
                  ? 'bg-norte-800 text-ambar-400'
                  : 'text-areia-300 hover:bg-norte-800 hover:text-areia-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={onSearch} className="ml-auto hidden md:flex items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar vídeos, artistas, cidades…"
            aria-label="Buscar"
            className="w-64 rounded-lg border border-norte-700 bg-norte-850 px-3 py-2 text-sm text-areia-100 placeholder:text-areia-400 focus:border-ambar-500 focus:outline-none"
          />
        </form>

        <div className="ml-auto md:ml-0 flex items-center gap-2">
          {user ? (
            <>
              {user.role === 'admin' || user.role === 'super-admin' ? (
                <Link to="/admin" className="hidden sm:block rounded-lg border border-norte-700 px-3 py-2 text-sm text-areia-200 hover:bg-norte-800">
                  Admin
                </Link>
              ) : null}
              <span className="hidden sm:block text-sm text-areia-300">{user.name.split(' ')[0]}</span>
              <button
                onClick={() => { logout(); navigate('/') }}
                className="rounded-lg bg-norte-800 px-3 py-2 text-sm text-areia-200 hover:bg-norte-700"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/entrar" className="rounded-lg px-3 py-2 text-sm text-areia-200 hover:bg-norte-800">
                Entrar
              </Link>
              <Link to="/cadastro" className="rounded-lg bg-ambar-500 px-3 py-2 text-sm font-semibold text-norte-950 hover:bg-ambar-400">
                Criar conta
              </Link>
            </>
          )}
          <button
            className="lg:hidden rounded-lg p-2 text-areia-200 hover:bg-norte-800"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-norte-800 bg-norte-950 px-4 pb-4">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-areia-200 hover:bg-norte-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
