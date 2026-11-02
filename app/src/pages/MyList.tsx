import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { EmptyState, PageHeader } from '../components/PageHeader'
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
    <main>
      <PageHeader
        eyebrow="Sua coleção"
        title="Minha lista"
        description="As obras que você guardou para ver com calma."
      />

      <div className="container-norte py-20">
        {loading ? (
          <p className="eyebrow !text-neve-600">Carregando…</p>
        ) : videos.length === 0 ? (
          <EmptyState
            title="Sua lista está vazia"
            description="Explore o acervo e salve o que quiser rever depois."
            action={<Link to="/explorar" className="btn-ghost mt-2">Explorar acervo</Link>}
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
