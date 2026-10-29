import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Carousel } from '../components/Carousel'
import { VideoCard } from '../components/VideoCard'
import { useAuth } from '../context/AuthContext'
import { Api, type Video } from '../lib/api'

export default function VideoDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const [video, setVideo] = useState<Video | null>(null)
  const [related, setRelated] = useState<Video[]>([])
  const [inList, setInList] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    setVideo(null)
    Api.video(slug)
      .then((r) => {
        setVideo(r.data)
        setRelated(r.related)
        setLikes(r.data.likes_count)
      })
      .catch(() => setNotFound(true))
  }, [slug])

  async function handleList() {
    if (!video || !user) return
    const r = await Api.toggleList(video.id)
    setInList(r.in_list)
  }

  async function handleLike() {
    if (!video || !user) return
    const r = await Api.toggleLike(video.id)
    setLiked(r.liked)
    setLikes(r.likes_count)
  }

  if (notFound) return <p className="container-norte py-20 text-center text-areia-300">Vídeo não encontrado.</p>
  if (!video) return <p className="container-norte py-20 text-center text-areia-400">Carregando…</p>

  const embed = video.embed_url

  return (
    <main className="container-norte py-6">
      <div className="overflow-hidden rounded-2xl bg-black">
        <div className="relative aspect-video w-full">
          {embed ? (
            <iframe
              src={embed}
              title={video.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <div className="grid h-full place-items-center text-areia-300">
              Player indisponível (vídeo sem fonte embed).
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-display text-2xl font-bold text-areia-100 md:text-3xl">{video.title}</h1>
          <p className="mt-1 text-sm text-areia-400">
            {[video.producer?.name, video.city?.name, video.year, `${video.views_count} views`]
              .filter(Boolean)
              .join(' · ')}
          </p>
          <p className="mt-4 text-areia-200">{video.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {video.categories?.map((c) => (
              <Link
                key={c.id}
                to={`/categoria/${c.slug}`}
                className="rounded-full border border-norte-700 px-3 py-1 text-xs text-areia-300 hover:border-ambar-500 hover:text-ambar-400"
              >
                {c.name}
              </Link>
            ))}
            {video.tags?.map((t) => (
              <span key={t.id} className="rounded-full bg-norte-850 px-3 py-1 text-xs text-areia-400">#{t.name}</span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-row gap-2 md:flex-col">
          <button
            onClick={handleLike}
            disabled={!user}
            className={`rounded-lg border px-4 py-2 text-sm transition-colors disabled:opacity-50 ${
              liked ? 'border-ambar-500 bg-ambar-500/10 text-ambar-400' : 'border-norte-700 text-areia-200 hover:bg-norte-800'
            }`}
          >
            ♥ Curtir ({likes})
          </button>
          <button
            onClick={handleList}
            disabled={!user}
            className={`rounded-lg border px-4 py-2 text-sm transition-colors disabled:opacity-50 ${
              inList ? 'border-mata-500 bg-mata-500/10 text-mata-500' : 'border-norte-700 text-areia-200 hover:bg-norte-800'
            }`}
          >
            {inList ? '✓ Na lista' : '+ Minha lista'}
          </button>
          <button
            onClick={() => navigator.share?.({ title: video.title, url: location.href }).catch(() => {})}
            className="rounded-lg border border-norte-700 px-4 py-2 text-sm text-areia-200 hover:bg-norte-800"
          >
            ↗ Compartilhar
          </button>
        </div>
      </div>

      {!user ? (
        <p className="mt-4 text-sm text-areia-400">
          <Link to="/entrar" className="text-ambar-400 hover:underline">Entre</Link> para curtir, salvar na lista e continuar de onde parou.
        </p>
      ) : null}

      {related.length > 0 ? (
        <div className="mt-10">
          <Carousel title="Relacionados">
            {related.map((v) => <VideoCard key={v.id} video={v} />)}
          </Carousel>
        </div>
      ) : null}
    </main>
  )
}
