import { useEffect, useState } from 'react'
import { VideoCard } from '../components/VideoCard'
import { Api, type Video } from '../lib/api'

export default function Explore() {
  const [videos, setVideos] = useState<Video[]>([])
  const [sort, setSort] = useState('recent')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Api.videos({ sort, per_page: 40 })
      .then((r) => setVideos(r.data))
      .finally(() => setLoading(false))
  }, [sort])

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
          <option value="recent">Mais recentes</option>
          <option value="views">Mais assistidos</option>
          <option value="likes">Mais curtidos</option>
          <option value="title">Título (A-Z)</option>
        </select>
      </div>

      {loading ? (
        <p className="text-areia-400">Carregando…</p>
      ) : videos.length === 0 ? (
        <p className="text-areia-400">Nenhum vídeo encontrado.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {videos.map((v) => <VideoCard key={v.id} video={v} size="md" />)}
        </div>
      )}
    </main>
  )
}
