import { useEffect, useState } from 'react'
import { Carousel } from '../components/Carousel'
import { Hero } from '../components/Hero'
import { VideoCard } from '../components/VideoCard'
import { Api, type Video } from '../lib/api'

interface HomeData {
  hero: Video[]
  recent: Video[]
  most_watched: Video[]
  popular: Video[]
}

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Api.home().then(setData).catch(() => setError('Não foi possível carregar o catálogo.'))
  }, [])

  if (error) return <p className="container-norte py-20 text-center text-areia-300">{error}</p>
  if (!data) return <Skeleton />

  return (
    <main className="container-norte py-6">
      {data.hero[0] ? <Hero video={data.hero[0]} /> : null}

      <Carousel title="Novos na PlanoNorte">
        {data.recent.map((v) => <VideoCard key={v.id} video={v} />)}
      </Carousel>

      <Carousel title="Mais assistidos">
        {data.most_watched.map((v) => <VideoCard key={v.id} video={v} />)}
      </Carousel>

      <Carousel title="Populares">
        {data.popular.map((v) => <VideoCard key={v.id} video={v} />)}
      </Carousel>
    </main>
  )
}

function Skeleton() {
  return (
    <div className="container-norte py-6">
      <div className="mb-10 h-72 animate-pulse rounded-2xl bg-norte-850 md:h-96" />
      {[0, 1].map((i) => (
        <div key={i} className="mb-8">
          <div className="mb-3 h-6 w-48 animate-pulse rounded bg-norte-850" />
          <div className="flex gap-3 overflow-hidden">
            {[0, 1, 2, 3, 4].map((j) => (
              <div key={j} className="h-40 w-56 shrink-0 animate-pulse rounded-xl bg-norte-850" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
