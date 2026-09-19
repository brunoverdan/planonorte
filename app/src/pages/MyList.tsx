import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { VideoCard } from '../components/VideoCard'
import { useAuth } from '../context/AuthContext'
import { Api, type Video } from '../lib/api'

export default function MyList() {
  const { user, loading: authLoading } = useAuth()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Api.myList().then(setVideos).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  if (authLoading) return null
  if (!user) return <Navigate to="/entrar" replace />

  return (
    <main className="container-norte py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-areia-100">Minha Lista</h1>
      {loading ? (
        <p className="text-areia-400">Carregando…</p>
      ) : videos.length === 0 ? (
        <p className="text-areia-400">Sua lista está vazia. Explore o catálogo e salve seus favoritos.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {videos.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </main>
  )
}
