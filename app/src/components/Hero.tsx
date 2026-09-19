import { Link } from 'react-router-dom'
import type { Video } from '../lib/api'

export function Hero({ video }: { video: Video }) {
  return (
    <section className="relative mb-10 overflow-hidden rounded-2xl border border-norte-800">
      <div className="absolute inset-0 bg-gradient-to-br from-norte-800 via-norte-900 to-norte-950" />
      {video.thumbnail ? (
        <img src={video.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-norte-950 via-norte-950/60 to-transparent" />

      <div className="relative z-10 flex min-h-[380px] flex-col justify-end gap-4 p-6 md:min-h-[460px] md:p-10">
        <span className="w-fit rounded-full border border-ambar-600/50 bg-ambar-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ambar-400">
          Em destaque
        </span>
        <h1 className="max-w-2xl font-display text-3xl font-bold leading-tight text-areia-100 md:text-5xl">
          {video.title}
        </h1>
        <p className="max-w-xl text-sm text-areia-300 md:text-base">
          {video.short_description || video.description}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/video/${video.slug}`}
            className="rounded-lg bg-ambar-500 px-5 py-2.5 text-sm font-semibold text-norte-950 hover:bg-ambar-400"
          >
            ▶ Assistir agora
          </Link>
          {video.categories?.[0] ? (
            <span className="rounded-lg border border-norte-700 px-3 py-2 text-sm text-areia-300">
              {video.categories[0].name}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  )
}
