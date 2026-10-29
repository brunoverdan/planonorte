import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { VideoCard } from '../components/VideoCard'
import { Api, type Producer, type Video } from '../lib/api'

export default function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [videos, setVideos] = useState<Video[]>([])
  const [producers, setProducers] = useState<Producer[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    Api.search(q)
      .then((r) => { setVideos(r.videos); setProducers(r.producers) })
      .finally(() => setLoading(false))
  }, [q])

  return (
    <main className="container-norte py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-areia-100">
        Resultados para “{q}”
      </h1>

      {loading ? <p className="text-areia-400">Buscando…</p> : null}

      {!loading && videos.length === 0 && producers.length === 0 ? (
        <p className="text-areia-400">Nada encontrado. Tente outro termo.</p>
      ) : null}

      {producers.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-lg font-bold text-areia-100">Produtores</h2>
          <div className="flex flex-wrap gap-3">
            {producers.map((p) => (
              <Link key={p.id} to={`/produtor/${p.slug}`} className="rounded-lg border border-norte-800 bg-norte-850 px-4 py-2 text-sm text-areia-200 hover:border-ambar-600">
                {p.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {videos.length > 0 ? (
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-areia-100">Vídeos</h2>
          <div className="flex flex-wrap gap-4">
            {videos.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        </section>
      ) : null}
    </main>
  )
}
