import { Link } from 'react-router-dom'
import { CompassRose } from '../components/CompassRose'

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden pt-[72px]">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        <CompassRose size={620} strokeWidth={0.5} className="animate-slow-spin text-white opacity-[0.05]" />
      </div>

      <div className="container-norte relative z-10 text-center">
        <CompassRose size={30} className="mx-auto text-neve-500" />
        <p className="mt-8 font-mono text-[0.6875rem] uppercase tracking-[0.3em] text-neve-600">
          Fora do mapa
        </p>
        <h1 className="mt-6 font-display text-6xl font-light tracking-tight text-white md:text-8xl">
          404
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-neve-400 md:text-base">
          Esta coordenada não existe no acervo. A página pode ter sido movida ou nunca existiu.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn-invert">Voltar ao início</Link>
          <Link to="/explorar" className="btn-ghost">Explorar acervo</Link>
        </div>
      </div>
    </main>
  )
}
