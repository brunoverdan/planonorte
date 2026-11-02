import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { EmptyState, PageHeader } from '../components/PageHeader'
import { VideoCard } from '../components/VideoCard'
import { Api, type City, type Video } from '../lib/api'

export default function CityDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [city, setCity] = useState<City | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    Api.city(slug).then(setCity).catch(() => {})
    Api.videos({ city: slug, per_page: 40 })
      .then((r) => setVideos(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <main>
      <PageHeader
        eyebrow={[city?.state?.name, city?.state?.region?.name].filter(Boolean).join(' · ') || 'Cidade'}
        title={city?.name || 'Cidade'}
        description={city?.description || undefined}
      />

      <div className="container-norte py-20">
        <div className="mb-10 flex items-center gap-4">
          <h2 className="font-display text-2xl font-light text-white">Obras desta cidade</h2>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          <span className="font-mono text-[0.625rem] tracking-[0.18em] text-neve-600">
            {String(videos.length).padStart(2, '0')}
          </span>
        </div>

        {loading ? (
          <p className="eyebrow !text-neve-600">Carregando…</p>
        ) : videos.length === 0 ? (
          <EmptyState
            title="Sem obras registradas"
            description="Ainda não há títulos desta cidade no acervo."
          />
        ) : (
          <div className="flex flex-wrap gap-x-5 gap-y-10">
            {videos.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        )}
      </div>
    </main>
  )
}
