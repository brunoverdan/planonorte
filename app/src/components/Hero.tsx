import { Link } from 'react-router-dom'
import type { Video } from '../lib/api'
import { CompassRose } from './CompassRose'

export function Hero({ video }: { video: Video }) {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden pt-[72px]">
      {/* ── Camadas de fundo ──────────────────────────────────────── */}
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />

      {/* Imagem de fundo, muito escurecida */}
      {video.thumbnail && (
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src={video.thumbnail}
            alt=""
            className="h-full w-full object-cover opacity-[0.18] grayscale"
          />
        </div>
      )}

      {/* Gradientes de contenção */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-noir-950 via-noir-950/70 to-noir-950"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/40 to-transparent"
        aria-hidden="true"
      />

      {/* Rosa dos ventos — marca d'água girando lentamente */}
      <div
        className="pointer-events-none absolute -right-[18%] top-1/2 hidden -translate-y-1/2 md:block"
        aria-hidden="true"
      >
        <CompassRose
          size={720}
          strokeWidth={0.6}
          className="animate-slow-spin text-white opacity-[0.07]"
        />
      </div>

      {/* ── Conteúdo ──────────────────────────────────────────────── */}
      <div className="container-norte relative z-10 py-20">
        <div className="max-w-3xl">
          {/* Eyebrow com coordenadas */}
          <div className="animate-fade-up flex items-center gap-4" style={{ animationDelay: '80ms' }}>
            <CompassRose size={18} className="text-neve-500" />
            <span className="eyebrow">Acervo Cultural Brasileiro</span>
            <span className="hidden h-px w-12 bg-white/20 sm:block" aria-hidden="true" />
            <span className="hidden font-mono text-[0.625rem] tracking-[0.2em] text-neve-600 sm:block">
              23°S · 46°O
            </span>
          </div>

          {/* Título principal — serifada branca pura */}
          <h1
            className="animate-fade-up text-hero mt-8"
            style={{ animationDelay: '160ms' }}
          >
            {video.title}
          </h1>

          {/* Divisor com losango */}
          <div
            className="animate-fade-up mt-8 flex items-center gap-4"
            style={{ animationDelay: '240ms' }}
          >
            <span className="h-1.5 w-1.5 rotate-45 border border-white/40" aria-hidden="true" />
            <span className="h-px w-20 bg-white/20" aria-hidden="true" />
          </div>

          {/* Subtexto */}
          <p
            className="animate-fade-up mt-8 max-w-xl text-base leading-relaxed text-neve-300 md:text-lg md:leading-relaxed"
            style={{ animationDelay: '320ms' }}
          >
            {video.short_description || video.description}
          </p>

          {/* Metadados */}
          <div
            className="animate-fade-up mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.75rem] uppercase tracking-[0.14em] text-neve-500"
            style={{ animationDelay: '400ms' }}
          >
            {video.categories?.[0] && <span>{video.categories[0].name}</span>}
            {video.city?.name && (
              <>
                <span className="h-3 w-px bg-white/15" aria-hidden="true" />
                <span>{video.city.name}</span>
              </>
            )}
            {video.year && (
              <>
                <span className="h-3 w-px bg-white/15" aria-hidden="true" />
                <span>{video.year}</span>
              </>
            )}
            {video.producer?.name && (
              <>
                <span className="h-3 w-px bg-white/15" aria-hidden="true" />
                <span className="normal-case tracking-normal text-neve-400">{video.producer.name}</span>
              </>
            )}
          </div>

          {/* CTAs */}
          <div
            className="animate-fade-up mt-12 flex flex-wrap items-center gap-4"
            style={{ animationDelay: '480ms' }}
          >
            <Link to={`/video/${video.slug}`} className="btn-invert group">
              <svg width="11" height="12" viewBox="0 0 11 12" fill="currentColor" className="transition-transform duration-300 group-hover:translate-x-0.5">
                <path d="M0 0l11 6-11 6z" />
              </svg>
              Assistir agora
            </Link>
            <Link to="/explorar" className="btn-ghost">
              Explorar acervo
            </Link>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex" aria-hidden="true">
        <span className="text-[0.5625rem] uppercase tracking-[0.3em] text-neve-600">Role</span>
        <span className="h-10 w-px bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  )
}
