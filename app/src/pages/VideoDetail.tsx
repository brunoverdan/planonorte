import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Carousel } from '../components/Carousel'
import { CompassRose, DiamondDivider } from '../components/CompassRose'
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

  if (notFound) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 pt-[72px] text-center">
        <CompassRose size={40} className="text-neve-600" />
        <p className="font-display text-3xl font-light text-neve-300">Obra não encontrada</p>
        <Link to="/explorar" className="btn-ghost">Explorar acervo</Link>
      </main>
    )
  }

  if (!video) {
    return (
      <main className="pt-[72px]">
        <div className="aspect-video w-full animate-pulse bg-noir-900" />
        <div className="container-norte py-14">
          <div className="h-10 w-2/3 animate-pulse bg-noir-850" />
          <div className="mt-4 h-4 w-1/3 animate-pulse bg-noir-850" />
        </div>
      </main>
    )
  }

  const embed = video.embed_url

  return (
    <main>
      {/* ── Player ────────────────────────────────────────────────── */}
      <section className="relative bg-black pt-[72px]">
        <div className="relative mx-auto aspect-video w-full max-w-[1600px]">
          {embed ? (
            <iframe
              src={embed}
              title={video.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <div className="grid h-full place-items-center">
              <div className="text-center">
                <CompassRose size={44} className="mx-auto text-neve-700" />
                <p className="mt-6 text-sm text-neve-500">Player indisponível para esta obra.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Metadados ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="pointer-events-none absolute -right-40 -top-20 hidden md:block"
          aria-hidden="true"
        >
          <CompassRose size={420} strokeWidth={0.5} className="text-white opacity-[0.05]" />
        </div>

        <div className="container-norte relative z-10 py-16 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div className="min-w-0">
              {/* Eyebrow */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <CompassRose size={13} className="text-neve-600" />
                {video.categories?.[0] ? (
                  <Link
                    to={`/categoria/${video.categories[0].slug}`}
                    className="eyebrow transition-colors hover:!text-white"
                  >
                    {video.categories[0].name}
                  </Link>
                ) : (
                  <span className="eyebrow">Obra</span>
                )}
                {video.year && (
                  <>
                    <span className="h-3 w-px bg-white/15" aria-hidden="true" />
                    <span className="font-mono text-[0.625rem] tracking-[0.2em] text-neve-600">{video.year}</span>
                  </>
                )}
              </div>

              {/* Título */}
              <h1 className="mt-6 font-display text-4xl font-light leading-[1.06] tracking-tight text-white md:text-6xl">
                {video.title}
              </h1>

              {/* Linha de crédito */}
              <p className="mt-6 text-[0.6875rem] uppercase tracking-[0.16em] text-neve-500">
                {[video.producer?.name, video.city?.name].filter(Boolean).join(' · ')}
                {video.views_count ? ` · ${video.views_count} visualizações` : ''}
              </p>

              <DiamondDivider className="mt-10 !justify-start" />

              {/* Sinopse */}
              <p className="container-prose mt-10 text-base leading-[1.85] text-neve-300 md:text-[1.0625rem]">
                {video.description || video.short_description}
              </p>

              {/* Tags e categorias */}
              {(video.tags?.length || (video.categories?.length ?? 0) > 1) && (
                <div className="mt-10 flex flex-wrap gap-2.5">
                  {video.categories?.map((c) => (
                    <Link
                      key={c.id}
                      to={`/categoria/${c.slug}`}
                      className="border border-white/12 px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.12em] text-neve-300 transition-colors duration-300 hover:border-white/40 hover:text-white"
                    >
                      {c.name}
                    </Link>
                  ))}
                  {video.tags?.map((t) => (
                    <span
                      key={t.id}
                      className="border border-white/8 px-3 py-1.5 text-[0.6875rem] text-neve-500"
                    >
                      #{t.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Ações */}
            <aside className="flex shrink-0 flex-col gap-3 lg:w-56">
              <button
                onClick={handleLike}
                disabled={!user}
                className={`group flex items-center justify-between border px-5 py-4 text-[0.6875rem] uppercase tracking-[0.16em] transition-all duration-300 disabled:opacity-40 ${
                  liked
                    ? 'border-white bg-white text-black'
                    : 'border-white/15 text-neve-200 hover:border-white/40 hover:bg-white/5'
                }`}
              >
                <span>{liked ? 'Curtido' : 'Curtir'}</span>
                <span className="font-mono tracking-normal">{likes}</span>
              </button>

              <button
                onClick={handleList}
                disabled={!user}
                className={`flex items-center justify-between border px-5 py-4 text-[0.6875rem] uppercase tracking-[0.16em] transition-all duration-300 disabled:opacity-40 ${
                  inList
                    ? 'border-white/40 bg-white/5 text-white'
                    : 'border-white/15 text-neve-200 hover:border-white/40 hover:bg-white/5'
                }`}
              >
                <span>{inList ? 'Na lista' : 'Minha lista'}</span>
                <span aria-hidden="true">{inList ? '✓' : '+'}</span>
              </button>

              <button
                onClick={() => navigator.share?.({ title: video.title, url: location.href }).catch(() => {})}
                className="flex items-center justify-between border border-white/15 px-5 py-4 text-[0.6875rem] uppercase tracking-[0.16em] text-neve-200 transition-all duration-300 hover:border-white/40 hover:bg-white/5"
              >
                <span>Compartilhar</span>
                <span aria-hidden="true">↗</span>
              </button>

              {!user && (
                <p className="mt-2 text-[0.75rem] leading-relaxed text-neve-500">
                  <Link to="/entrar" className="border-b border-white/30 pb-0.5 text-neve-200 hover:border-white">
                    Entre
                  </Link>{' '}
                  para curtir e salvar na lista.
                </p>
              )}

              {video.duration_seconds ? (
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-[0.5625rem] uppercase tracking-[0.22em] text-neve-600">Duração</span>
                  <span className="font-mono text-[0.75rem] text-neve-300">
                    {Math.floor(video.duration_seconds / 60)} min
                  </span>
                </div>
              ) : null}

              {video.is_free ? (
                <div className="flex items-center justify-between">
                  <span className="text-[0.5625rem] uppercase tracking-[0.22em] text-neve-600">Acesso</span>
                  <span className="text-[0.75rem] text-neve-300">Livre</span>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      {/* ── Relacionados ──────────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="container-norte py-20">
          <Carousel title="Continue explorando" eyebrow="Relacionados">
            {related.map((v) => <VideoCard key={v.id} video={v} />)}
          </Carousel>
        </div>
      )}
    </main>
  )
}
