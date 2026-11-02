import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Carousel } from '../components/Carousel'
import { CompassRose, DiamondDivider } from '../components/CompassRose'
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
    Api.home().then(setData).catch(() => setError('Não foi possível carregar o acervo.'))
  }, [])

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 pt-[72px] text-center">
        <CompassRose size={44} className="text-neve-600" />
        <p className="font-display text-2xl font-light text-neve-300">{error}</p>
      </div>
    )
  }

  if (!data) return <Skeleton />

  const destaques = data.recent.slice(0, 3)

  return (
    <main>
      {data.hero[0] ? <Hero video={data.hero[0]} /> : null}

      {/* ── Manifesto ─────────────────────────────────────────────── */}
      <section className="relative py-28 md:py-36">
        <div className="container-norte">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">O acervo</p>
            <h2 className="mt-8 font-display text-3xl font-light leading-[1.15] text-white md:text-5xl md:leading-[1.12]">
              A cultura brasileira merece um lugar
              <span className="italic text-neve-300"> à altura da sua profundidade.</span>
            </h2>
            <DiamondDivider className="mt-10" />
            <p className="container-prose mt-10 text-base leading-relaxed text-neve-400 md:text-[1.0625rem] md:leading-[1.85]">
              Reunimos documentários, registros sonoros, manifestações populares e patrimônio
              material e imaterial de todo o país. Um arquivo vivo, organizado com rigor
              editorial e aberto a quem quer compreender o Brasil para além do óbvio.
            </p>
          </div>
        </div>
      </section>

      {/* ── Destaques editoriais ──────────────────────────────────── */}
      {destaques.length > 0 && (
        <section className="pb-28">
          <div className="container-norte">
            <div className="mb-12 flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow mb-4">Seleção da curadoria</p>
                <h2 className="font-display text-3xl font-light text-white md:text-4xl">
                  Três obras para começar
                </h2>
              </div>
              <Link
                to="/explorar"
                className="hidden shrink-0 items-center gap-2 pb-2 text-[0.6875rem] uppercase tracking-[0.18em] text-neve-400 transition-colors hover:text-white md:flex"
              >
                Ver tudo
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
              {destaques.map((v, i) => (
                <Link
                  key={v.id}
                  to={`/video/${v.slug}`}
                  className="group relative flex flex-col bg-noir-950 p-8 transition-colors duration-500 hover:bg-noir-900 md:p-10"
                >
                  <span className="font-mono text-[0.625rem] tracking-[0.2em] text-neve-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-light leading-snug text-white md:text-[1.75rem]">
                    {v.title}
                  </h3>
                  <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-neve-400">
                    {v.short_description || v.description}
                  </p>
                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-[0.625rem] uppercase tracking-[0.16em] text-neve-500">
                      {[v.city?.name, v.year].filter(Boolean).join(' · ')}
                    </span>
                    <span className="text-neve-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" aria-hidden="true">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Carrosséis ────────────────────────────────────────────── */}
      <div className="container-norte">
        {data.recent.length > 0 && (
          <Carousel title="Recém-adicionados" eyebrow="Novidades no acervo">
            {data.recent.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </Carousel>
        )}

        {data.most_watched.length > 0 && (
          <Carousel title="Mais assistidos" eyebrow="Audiência">
            {data.most_watched.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </Carousel>
        )}

        {data.popular.length > 0 && (
          <Carousel title="Populares" eyebrow="Em circulação">
            {data.popular.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </Carousel>
        )}
      </div>

      {/* ── Bloco de chamada ──────────────────────────────────────── */}
      <section className="relative mt-20 overflow-hidden border-y border-white/10">
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-40 top-1/2 -translate-y-1/2" aria-hidden="true">
          <CompassRose size={480} strokeWidth={0.5} className="animate-slow-spin text-white opacity-[0.06]" />
        </div>

        <div className="container-norte relative z-10 flex flex-col items-center gap-10 py-28 text-center md:py-36">
          <CompassRose size={36} className="text-neve-500" withLetters />
          <h2 className="max-w-2xl font-display text-3xl font-light leading-[1.15] text-white md:text-5xl">
            Comece a explorar o Brasil
            <span className="italic text-neve-300"> que não aparece no mapa.</span>
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-neve-400 md:text-base">
            Acesso livre ao acervo. Sem algoritmos, sem ruído — apenas curadoria.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/cadastro" className="btn-invert">Criar conta gratuita</Link>
            <Link to="/explorar" className="btn-ghost">Explorar acervo</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function Skeleton() {
  return (
    <div>
      <div className="flex min-h-[92vh] items-center">
        <div className="container-norte space-y-8">
          <div className="h-3 w-48 animate-pulse bg-noir-800" />
          <div className="space-y-4">
            <div className="h-16 w-3/4 animate-pulse bg-noir-800 md:h-24" />
            <div className="h-16 w-1/2 animate-pulse bg-noir-800 md:h-24" />
          </div>
          <div className="h-4 w-96 animate-pulse bg-noir-800" />
          <div className="flex gap-4">
            <div className="h-12 w-44 animate-pulse bg-noir-800" />
            <div className="h-12 w-44 animate-pulse bg-noir-800" />
          </div>
        </div>
      </div>
      <div className="container-norte py-20">
        <div className="mb-10 h-8 w-64 animate-pulse bg-noir-800" />
        <div className="flex gap-4 overflow-hidden">
          {[0, 1, 2, 3, 4].map((j) => (
            <div key={j} className="h-36 w-64 shrink-0 animate-pulse bg-noir-800" />
          ))}
        </div>
      </div>
    </div>
  )
}
