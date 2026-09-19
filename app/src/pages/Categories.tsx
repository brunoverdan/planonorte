import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Api, type Category } from '../lib/api'

export default function Categories() {
  const [cats, setCats] = useState<Category[]>([])
  useEffect(() => { Api.categories().then(setCats).catch(() => {}) }, [])

  return (
    <main className="container-norte py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-areia-100">Categorias</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cats.map((c) => (
          <Link
            key={c.id}
            to={`/categoria/${c.slug}`}
            className="group rounded-xl border border-norte-800 bg-norte-850 p-5 transition-colors hover:border-ambar-600"
          >
            <p className="font-display text-lg font-semibold text-areia-100 group-hover:text-ambar-400">{c.name}</p>
            <p className="mt-1 text-xs text-areia-400">{c.videos_count ?? 0} vídeos</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
