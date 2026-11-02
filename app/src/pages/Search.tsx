import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { EmptyState } from '../components/PageHeader'
import { VideoCard } from '../components/VideoCard'
import { CompassRose } from '../components/CompassRose'
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

  const total = videos.length + producers.length

  return (
    <main className="pt-[72px]">
      <header className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
        <div className="container-norte relative z-10 py-20 md:py-24">
          <div className="flex items-center gap-3.5">
            <CompassRose size={14} className="text-neve-600" />
            <p className="eyebrow">Busca no acervo</p>
          </div>
          <h1 className="mt-6 font-display text-4xl font-light leading-[1.08] tracking-tight text-white md:text-6xl">
            “{q}”
          </h1>
          {!loading && (
            <p className="mt-5 text-[0.6875rem] uppercase tracking-[0.18em] text-neve-600">
              {total} {total === 1 ? 'resultado' : 'resultados'}
            </p>
          )}
        </div>
      </header>

      <div className="container-norte py-20">
        {loading ? (
          <p className="eyebrow !text-neve-600">Buscando…</p>
        ) : total === 0 ? (
          <EmptyState
            title="Nada encontrado"
            description="Nenhuma obra ou produtor corresponde a este termo. Tente outras palavras."
            action={<Link to="/explorar" className="btn-ghost mt-2">Explorar acervo</Link>}
          />
        ) : (
          <>
            {producers.length > 0 && (
              <section className="mb-20">
                <div className="mb-8 flex items-center gap-4">
                  <h2 className="font-display text-2xl font-light text-white">Produtores</h2>
                  <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
                  <span className="font-mono text-[0.625rem] tracking-[0.18em] text-neve-600">
                    {String(producers.length).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {producers.map((p) => (
                    <Link
                      key={p.id}
                      to={`/produtor/${p.slug}`}
                      className="border border-white/12 px-4 py-2.5 text-[0.8125rem] text-neve-200 transition-colors duration-300 hover:border-white/35 hover:bg-white/5 hover:text-white"
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {videos.length > 0 && (
              <section>
                <div className="mb-8 flex items-center gap-4">
                  <h2 className="font-display text-2xl font-light text-white">Obras</h2>
                  <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
                  <span className="font-mono text-[0.625rem] tracking-[0.18em] text-neve-600">
                    {String(videos.length).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-10">
                  {videos.map((v) => <VideoCard key={v.id} video={v} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  )
}
