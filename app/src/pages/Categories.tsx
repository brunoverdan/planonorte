import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, PageHeader } from '../components/PageHeader'
import { Api, type Category } from '../lib/api'

export default function Categories() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Api.categories().then(setCats).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <main>
      <PageHeader
        eyebrow="Índice temático"
        title="Categorias"
        description="Navegue pelo acervo por campo de conhecimento e expressão cultural."
      />

      <div className="container-norte py-20">
        {loading ? (
          <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 animate-pulse bg-noir-950" />
            ))}
          </div>
        ) : cats.length === 0 ? (
          <EmptyState title="Nenhuma categoria cadastrada" />
        ) : (
          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((c, i) => (
              <Link
                key={c.id}
                to={`/categoria/${c.slug}`}
                className="group relative flex flex-col justify-between bg-noir-950 p-8 transition-colors duration-500 hover:bg-noir-900"
              >
                <span className="font-mono text-[0.625rem] tracking-[0.2em] text-neve-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="mt-10">
                  <h2 className="font-display text-2xl font-light text-white transition-colors duration-300 group-hover:text-neve-200">
                    {c.name}
                  </h2>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-[0.625rem] uppercase tracking-[0.16em] text-neve-500">
                      {c.videos_count ?? 0} {c.videos_count === 1 ? 'obra' : 'obras'}
                    </span>
                    <span className="text-neve-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" aria-hidden="true">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
