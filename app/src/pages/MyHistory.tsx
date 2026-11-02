import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { EmptyState, PageHeader } from '../components/PageHeader'
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
    <main>
      <PageHeader
        eyebrow="Sua trajetória"
        title="Histórico"
        description="Tudo o que você já assistiu, em ordem de retorno."
      />

      <div className="container-norte py-20">
        {loading ? (
          <p className="eyebrow !text-neve-600">Carregando…</p>
        ) : items.length === 0 ? (
          <EmptyState
            title="Nada por aqui ainda"
            description="Comece a assistir e seu percurso aparecerá aqui."
            action={<Link to="/explorar" className="btn-ghost mt-2">Explorar acervo</Link>}
          />
        ) : (
          <div className="flex flex-wrap gap-x-5 gap-y-10">
            {items.map((h) => <VideoCard key={h.video.id} video={h.video} />)}
          </div>
        )}
      </div>
    </main>
  )
}
