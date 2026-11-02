import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/PageHeader'
import { VideoCard } from '../components/VideoCard'
import { Api, type Category, type Video } from '../lib/api'

const SORTS = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'views', label: 'Mais assistidos' },
  { value: 'likes', label: 'Mais curtidos' },
  { value: 'title', label: 'Título (A–Z)' },
]

export default function Explore() {
  const [videos, setVideos] = useState<Video[]>([])
  const [categorias, setCategorias] = useState<Category[]>([])
  const [sort, setSort] = useState('recent')
  const [cat, setCat] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Api.videos({ sort, per_page: 40 })
      .then((r) => setVideos(r.data))
      .finally(() => setLoading(false))
  }, [sort])

  useEffect(() => {
    Api.categories().then(setCategorias).catch(() => {})
  }, [])

  const activeLabel = SORTS.find((s) => s.value === sort)?.label ?? ''

  // Filtro por categoria aplicado sobre o grupo de vídeos
  const filtered = useMemo(() => {
    if (cat === 'all') return videos
    return videos.filter((v) => (v.categories ?? []).some((c) => c.slug === cat))
  }, [videos, cat])

  return (
    <main className="container-norte py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-areia-100">Explorar</h1>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-norte-700 bg-norte-850 px-3 py-2 text-sm text-areia-100"
          aria-label="Ordenar por"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Filtro por categoria — fica junto do grupo de vídeos */}
      {categorias.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-x-5 gap-y-3">
          <button
            onClick={() => setCat('all')}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              cat === 'all'
                ? 'bg-norte-800 text-ambar-400'
                : 'text-areia-300 hover:bg-norte-800 hover:text-areia-100'
            }`}
          >
            Todas
          </button>
          {categorias.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCat(c.slug)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                cat === c.slug
                  ? 'bg-norte-800 text-ambar-400'
                  : 'text-areia-300 hover:bg-norte-800 hover:text-areia-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-areia-400">Carregando…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma obra neste recorte"
          description={`Não há títulos com o filtro "${activeLabel}". Tente outra categoria ou ordenação.`}
        />
      ) : (
        <>
          <p className="mb-6 text-xs uppercase tracking-wider text-areia-400">
            {filtered.length} {filtered.length === 1 ? 'obra' : 'obras'} · {activeLabel}
          </p>
          <div className="flex flex-wrap gap-4">
            {filtered.map((v) => <VideoCard key={v.id} video={v} size="md" />)}
          </div>
        </>
      )}

      <div className="mt-16 border-t border-norte-800 pt-6">
        <Link to="/categorias" className="text-sm text-areia-300 hover:text-areia-100">
          Ver todas as categorias →
        </Link>
      </div>
    </main>
  )
}
