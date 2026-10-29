import { Link } from 'react-router-dom'
import type { Video } from '../lib/api'

function formatDuration(seconds?: number) {
  if (!seconds) return ''
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function VideoCard({ video, size = 'md' }: { video: Video; size?: 'sm' | 'md' | 'lg' }) {
  const width = size === 'lg' ? 'w-72' : size === 'sm' ? 'w-40' : 'w-56'

  return (
    <Link
      to={`/video/${video.slug}`}
      className={`group ${width} shrink-0`}
      aria-label={`Assistir ${video.title}`}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-norte-850">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-norte-800 to-norte-900">
            <span className="text-3xl text-ambar-500/70">▶</span>
          </div>
        )}
        {video.duration_seconds ? (
          <span className="absolute bottom-2 right-2 rounded bg-norte-950/80 px-1.5 py-0.5 text-xs text-areia-200">
            {formatDuration(video.duration_seconds)}
          </span>
        ) : null}
        {video.is_featured ? (
          <span className="absolute left-2 top-2 rounded bg-ambar-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-norte-950">
            Destaque
          </span>
        ) : null}
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-medium text-areia-100 group-hover:text-ambar-400">
        {video.title}
      </h3>
      <p className="text-xs text-areia-400">
        {video.producer?.name || video.city?.name || video.year || ''}
        {video.views_count ? ` · ${video.views_count} views` : ''}
      </p>
    </Link>
  )
}
