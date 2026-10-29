import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { VideoCard } from '../components/VideoCard'
import { Api, type City, type Video } from '../lib/api'

export default function CityDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [city, setCity] = useState<City | null>(null)
  const [videos, setVideos] = useState<Video[]>([])

  useEffect(() => {
    if (!slug) return
    Api.city(slug).then(setCity).catch(() => {})
    Api.videos({ city: slug, per_page: 40 }).then((r) => setVideos(r.data)).catch(() => {})
  }, [slug])

  return (
    <main className="container-norte py-8">
      <h1 className="font-display text-2xl font-bold text-areia-100">
        {city?.name || 'Cidade'}
      </h1>
      {city?.state ? (
        <p className="mt-1 text-sm text-areia-400">
          {city.state.name} · {city.state.region?.name}
        </p>
      ) : null}
      {city?.description ? <p className="mt-4 max-w-3xl text-areia-300">{city.description}</p> : null}

      <h2 className="mb-4 mt-8 font-display text-lg font-bold text-areia-100">Vídeos desta cidade</h2>
      {videos.length === 0 ? (
        <p className="text-areia-400">Sem vídeos cadastrados ainda.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {videos.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </main>
  )
}
