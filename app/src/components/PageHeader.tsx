import type { ReactNode } from 'react'
import { CompassRose } from './CompassRose'

/**
 * Cabeçalho editorial para páginas internas.
 * Tipografia serifada, espaço negativo generoso, motivo de bússola.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <header className="relative overflow-hidden border-b border-white/10 pt-[72px]">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-32 -top-32 hidden md:block"
        aria-hidden="true"
      >
        <CompassRose size={420} strokeWidth={0.5} className="text-white opacity-[0.06]" />
      </div>

      <div className="container-norte relative z-10 py-20 md:py-24">
        {eyebrow && (
          <div className="flex items-center gap-3.5">
            <CompassRose size={14} className="text-neve-600" />
            <p className="eyebrow">{eyebrow}</p>
          </div>
        )}

        <h1 className="mt-6 max-w-3xl font-display text-4xl font-light leading-[1.08] tracking-tight text-white md:text-6xl">
          {title}
        </h1>

        {description && (
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-neve-400 md:text-base md:leading-[1.8]">
            {description}
          </p>
        )}

        {children && <div className="mt-10">{children}</div>}
      </div>
    </header>
  )
}

/** Estado vazio elegante */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-28 text-center">
      <CompassRose size={40} className="text-neve-600" />
      <div>
        <p className="font-display text-2xl font-light text-neve-300">{title}</p>
        {description && (
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neve-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
