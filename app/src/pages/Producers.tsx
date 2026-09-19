import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Api, type Producer } from '../lib/api'

export default function Producers() {
  const [items, setItems] = useState<Producer[]>([])
  useEffect(() => { Api.producers().then(setItems).catch(() => {}) }, [])

  return (
    <main className="container-norte py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-areia-100">Produtores</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/produtor/${p.slug}`}
            className="rounded-xl border border-norte-800 bg-norte-850 p-5 hover:border-ambar-600"
          >
            <p className="font-display text-lg font-semibold text-areia-100">
              {p.name} {p.is_verified ? <span className="text-ambar-400" title="Verificado">✓</span> : null}
            </p>
            <p className="text-xs uppercase tracking-wide text-areia-400">{p.type}</p>
            {p.city ? <p className="mt-1 text-xs text-areia-400">{p.city.name}</p> : null}
            <p className="mt-2 text-sm text-areia-300">{p.videos_count ?? 0} vídeos</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
