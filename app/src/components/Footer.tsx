import { Link } from 'react-router-dom'
import { CompassRose } from './CompassRose'

const COLUNAS = [
  {
    titulo: 'Acervo',
    links: [
      { to: '/explorar', label: 'Explorar tudo' },
      { to: '/categorias', label: 'Categorias' },
      { to: '/cidades', label: 'Cidades' },
      { to: '/produtores', label: 'Produtores' },
    ],
  },
  {
    titulo: 'Conta',
    links: [
      { to: '/entrar', label: 'Entrar' },
      { to: '/cadastro', label: 'Criar conta' },
      { to: '/minha-lista', label: 'Minha lista' },
      { to: '/historico', label: 'Histórico' },
    ],
  },
  {
    titulo: 'Instituto',
    links: [
      { to: '/sobre', label: 'Sobre' },
      { to: '/contato', label: 'Contato' },
      { to: '/termos', label: 'Termos de uso' },
      { to: '/privacidade', label: 'Privacidade' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-white/10 bg-noir-950">
      {/* Marca d'água */}
      <div className="pointer-events-none absolute -bottom-1/2 left-1/2 -translate-x-1/2" aria-hidden="true">
        <CompassRose size={560} strokeWidth={0.5} className="text-white opacity-[0.045]" />
      </div>

      <div className="container-norte relative z-10">
        {/* Bloco superior: logo grande + colunas */}
        <div className="grid gap-14 py-20 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-10">
          <div>
            <img
              src="/logo-planonorte.png"
              alt="Plan Norte"
              className="h-8 w-auto select-none opacity-95"
              draggable={false}
            />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-neve-400">
              Preservando e democratizando a cultura brasileira — documentários, música,
              folclore, patrimônio e gastronomia.
            </p>
            <div className="mt-8 flex items-center gap-3" aria-hidden="true">
              <span className="h-1 w-1 rotate-45 border border-white/30" />
              <span className="h-px w-12 bg-white/15" />
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.24em] text-neve-600">
                Est. 2026
              </span>
            </div>
          </div>

          {COLUNAS.map((col) => (
            <nav key={col.titulo} aria-label={col.titulo}>
              <h3 className="eyebrow mb-5">{col.titulo}</h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-neve-400 transition-colors duration-300 hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Divisor */}
        <div className="hairline" />

        {/* Base */}
        <div className="flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-neve-600">
            © {new Date().getFullYear()} Plan Norte · Todos os direitos reservados
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://planeventus.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.6875rem] uppercase tracking-[0.16em] text-neve-600 transition-colors hover:text-neve-300"
            >
              planeventus.com.br
            </a>
            <span className="h-3 w-px bg-white/10" aria-hidden="true" />
            <span className="font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-neve-600">
              Brasil
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
