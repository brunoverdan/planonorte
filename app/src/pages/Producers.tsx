import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, PageHeader } from '../components/PageHeader'
import { Api, type Producer } from '../lib/api'

export default function Producers() {
  const [items, setItems] = useState<Producer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Api.producers().then(setItems).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <main>
      <PageHeader
        eyebrow="Quem produz"
        title="Produtores"
        description="Realizadores, institutos, coletivos e pesquisadores responsáveis pelo acervo."
      />

      <div className="container-norte py-20">
        {loading ? (
          <div className="grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse bg-noir-950" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="Nenhum produtor cadastrado" />
        ) : (
          <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <Link
                key={p.id}
                to={`/produtor/${p.slug}`}
                className="group flex flex-col justify-between bg-noir-950 p-8 transition-colors duration-500 hover:bg-noir-900"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-xl font-light leading-snug text-white">{p.name}</h2>
                    {p.is_verified && (
                      <span
                        className="mt-1 shrink-0 border border-white/25 px-1.5 py-0.5 text-[0.5rem] uppercase tracking-[0.14em] text-neve-300"
                        title="Verificado"
                      >
                        Verificado
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-[0.625rem] uppercase tracking-[0.16em] text-neve-500">
                    {p.type}
                    {p.city ? ` · ${p.city.name}` : ''}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-[0.625rem] uppercase tracking-[0.16em] text-neve-500">
                    {p.videos_count ?? 0} {p.videos_count === 1 ? 'obra' : 'obras'}
                  </span>
                  <span className="text-neve-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" aria-hidden="true">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
