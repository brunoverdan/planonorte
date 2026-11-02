import type { ReactNode } from 'react'

export function Carousel({
  title,
  eyebrow,
  children,
  action,
}: {
  title: string
  eyebrow?: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <section className="mb-20">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          {eyebrow && (
            <p className="eyebrow mb-3">{eyebrow}</p>
          )}
          <h2 className="font-display text-3xl font-light leading-tight text-white md:text-4xl">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-4 pb-1">
          {action}
        </div>
      </div>
      <div className="carousel-row">{children}</div>
    </section>
  )
}
