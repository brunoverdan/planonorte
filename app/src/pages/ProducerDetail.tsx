import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { VideoCard } from '../components/VideoCard'
import { Api, type Producer, type Video } from '../lib/api'

export default function ProducerDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [producer, setProducer] = useState<Producer | null>(null)
  const [videos, setVideos] = useState<Video[]>([])

  useEffect(() => {
    if (!slug) return
    Api.producer(slug)
      .then((r) => { setProducer(r.data); setVideos(r.videos) })
      .catch(() => {})
  }, [slug])

  return (
    <main className="container-norte py-8">
      <h1 className="font-display text-2xl font-bold text-areia-100">{producer?.name || 'Produtor'}</h1>
      <p className="text-xs uppercase tracking-wide text-areia-400">{producer?.type}</p>
      {producer?.bio ? <p className="mt-4 max-w-3xl text-areia-300">{producer.bio}</p> : null}
      {producer?.website ? (
        <a href={producer.website} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-ambar-400 hover:underline">
          {producer.website}
        </a>
      ) : null}

      <h2 className="mb-4 mt-8 font-display text-lg font-bold text-areia-100">Produções</h2>
      {videos.length === 0 ? (
        <p className="text-areia-400">Nenhum vídeo publicado.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {videos.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </main>
  )
}
