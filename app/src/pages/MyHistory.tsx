import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { VideoCard } from '../components/VideoCard'
import { useAuth } from '../context/AuthContext'
import { Api, type Video } from '../lib/api'

interface HistoryItem { position_seconds: number; completed: boolean; watched_at: string; video: Video }

export default function MyHistory() {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Api.history()
      .then((r: { data: HistoryItem[] }) => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (authLoading) return null
  if (!user) return <Navigate to="/entrar" replace />

  return (
    <main className="container-norte py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-areia-100">Histórico</h1>
      {loading ? (
        <p className="text-areia-400">Carregando…</p>
      ) : items.length === 0 ? (
        <p className="text-areia-400">Você ainda não assistiu nada.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {items.map((h) => <VideoCard key={h.video.id} video={h.video} />)}
        </div>
      )}
    </main>
  )
}
