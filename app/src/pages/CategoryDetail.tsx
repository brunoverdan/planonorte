import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { EmptyState, PageHeader } from '../components/PageHeader'
import { VideoCard } from '../components/VideoCard'
import { Api, type Video } from '../lib/api'

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [videos, setVideos] = useState<Video[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    Api.category(slug)
      .then((c) => { setName(c.name); setDescription(c.description ?? '') })
      .catch(() => {})
    Api.videos({ category: slug, per_page: 40 })
      .then((r) => setVideos(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <main>
      <PageHeader eyebrow="Categoria" title={name || 'Categoria'} description={description || undefined} />

      <div className="container-norte py-20">
        {loading ? (
          <p className="eyebrow !text-neve-600">Carregando acervo…</p>
        ) : videos.length === 0 ? (
          <EmptyState
            title="Ainda não há obras aqui"
            description="Esta categoria está em curadoria. Volte em breve."
          />
        ) : (
          <>
            <p className="mb-10 text-[0.6875rem] uppercase tracking-[0.18em] text-neve-600">
              {videos.length} {videos.length === 1 ? 'obra' : 'obras'}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-10">
              {videos.map((v) => <VideoCard key={v.id} video={v} />)}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
