import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { EmptyState, PageHeader } from '../components/PageHeader'
import { VideoCard } from '../components/VideoCard'
import { CompassRose } from '../components/CompassRose'
import { Api, type Producer, type Video } from '../lib/api'

export default function ProducerDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [producer, setProducer] = useState<Producer | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    Api.producer(slug)
      .then((r) => { setProducer(r.data); setVideos(r.videos) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <main>
      <PageHeader
        eyebrow={[producer?.type, producer?.city?.name].filter(Boolean).join(' · ') || 'Produtor'}
        title={producer?.name || 'Produtor'}
        description={producer?.bio || undefined}
      >
        <div className="flex flex-wrap items-center gap-6">
          {producer?.is_verified && (
            <span className="flex items-center gap-2.5 border border-white/20 px-3 py-1.5 text-[0.5625rem] uppercase tracking-[0.18em] text-neve-300">
              <CompassRose size={11} className="text-neve-300" />
              Perfil verificado
            </span>
          )}
          {producer?.website && (
            <a
              href={producer.website}
              target="_blank"
              rel="noreferrer"
              className="border-b border-white/25 pb-0.5 text-[0.8125rem] text-neve-300 transition-colors hover:border-white hover:text-white"
            >
              {producer.website.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </PageHeader>

      <div className="container-norte py-20">
        <div className="mb-10 flex items-center gap-4">
          <h2 className="font-display text-2xl font-light text-white">Produções</h2>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          <span className="font-mono text-[0.625rem] tracking-[0.18em] text-neve-600">
            {String(videos.length).padStart(2, '0')}
          </span>
        </div>

        {loading ? (
          <p className="eyebrow !text-neve-600">Carregando…</p>
        ) : videos.length === 0 ? (
          <EmptyState title="Nenhuma obra publicada" description="Este produtor ainda não tem títulos no ar." />
        ) : (
          <div className="flex flex-wrap gap-x-5 gap-y-10">
            {videos.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        )}
      </div>
    </main>
  )
}
