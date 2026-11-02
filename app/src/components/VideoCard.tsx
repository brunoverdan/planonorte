import { Link } from 'react-router-dom'
import type { Video } from '../lib/api'

function formatDuration(seconds?: number) {
  if (!seconds) return ''
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function VideoCard({ video, size = 'md' }: { video: Video; size?: 'sm' | 'md' | 'lg' }) {
  const width = size === 'lg' ? 'w-80' : size === 'sm' ? 'w-44' : 'w-64'

  return (
    <Link
      to={`/video/${video.slug}`}
      className={`group ${width} shrink-0`}
      aria-label={`Assistir ${video.title}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden border border-white/10 bg-noir-850 transition-colors duration-500 group-hover:border-white/25">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-80 grayscale-[35%] transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-noir-800 to-noir-950">
            <span className="font-display text-3xl text-white/20">PN</span>
          </div>
        )}

        {/* Vinheta */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-40" />

        {/* Duração */}
        {video.duration_seconds ? (
          <span className="absolute bottom-2 right-2 border border-white/15 bg-black/70 px-1.5 py-0.5 font-mono text-[0.625rem] tracking-wider text-neve-200 backdrop-blur-sm">
            {formatDuration(video.duration_seconds)}
          </span>
        ) : null}

        {/* Destaque */}
        {video.is_featured ? (
          <span className="absolute left-2 top-2 border border-white/30 bg-black/60 px-2 py-0.5 text-[0.5625rem] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-sm">
            Destaque
          </span>
        ) : null}

        {/* Play hover */}
        <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-white/40 bg-black/30 backdrop-blur-sm">
            <svg width="10" height="12" viewBox="0 0 11 12" fill="white">
              <path d="M0 0l11 6-11 6z" />
            </svg>
          </span>
        </span>
      </div>

      {/* Texto */}
      <div className="mt-3">
        <h3 className="line-clamp-2 font-display text-base font-normal leading-snug text-white transition-colors duration-300 group-hover:text-neve-200">
          {video.title}
        </h3>
        <p className="mt-1.5 text-[0.6875rem] uppercase tracking-[0.12em] text-neve-500">
          {[video.producer?.name, video.city?.name, video.year].filter(Boolean).join(' · ')}
        </p>
      </div>
    </Link>
  )
}
