import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, PageHeader } from '../components/PageHeader'
import { Api, type City } from '../lib/api'

export default function Cities() {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Api.cities().then(setCities).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <main>
      <PageHeader
        eyebrow="Geografia cultural"
        title="Cidades"
        description="O acervo por território. Cada cidade guarda um repertório próprio de memória, som e imagem."
      />

      <div className="container-norte py-20">
        {loading ? (
          <div className="grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse bg-noir-950" />
            ))}
          </div>
        ) : cities.length === 0 ? (
          <EmptyState title="Nenhuma cidade cadastrada" />
        ) : (
          <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <Link
                key={c.id}
                to={`/cidade/${c.slug}`}
                className="group flex items-center justify-between gap-4 bg-noir-950 p-7 transition-colors duration-500 hover:bg-noir-900"
              >
                <div className="min-w-0">
                  <h2 className="truncate font-display text-xl font-light text-white">{c.name}</h2>
                  <p className="mt-2 text-[0.625rem] uppercase tracking-[0.16em] text-neve-500">
                    {[c.state?.name, c.state?.region?.name].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <span className="shrink-0 text-neve-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
