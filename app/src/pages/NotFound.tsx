import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="container-norte flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="font-display text-6xl font-bold text-ambar-500">404</p>
      <p className="text-areia-300">Página não encontrada.</p>
      <Link to="/" className="rounded-lg bg-ambar-500 px-5 py-2.5 text-sm font-semibold text-norte-950 hover:bg-ambar-400">
        Voltar ao início
      </Link>
    </main>
  )
}
