import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { VideoCard } from '../components/VideoCard'
import { Api, type Video } from '../lib/api'

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [videos, setVideos] = useState<Video[]>([])
  const [name, setName] = useState('')

  useEffect(() => {
    if (!slug) return
    Api.category(slug).then((c) => setName(c.name)).catch(() => {})
    Api.videos({ category: slug, per_page: 40 }).then((r) => setVideos(r.data)).catch(() => {})
  }, [slug])

  return (
    <main className="container-norte py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-areia-100">{name || 'Categoria'}</h1>
      {videos.length === 0 ? (
        <p className="text-areia-400">Nenhum vídeo nesta categoria ainda.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {videos.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </main>
  )
}
