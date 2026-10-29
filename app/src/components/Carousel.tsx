import type { ReactNode } from 'react'

export function Carousel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-areia-100 md:text-xl">{title}</h2>
        {action}
      </div>
      <div className="carousel-row">{children}</div>
    </section>
  )
}
