/**
 * Rosa dos Ventos — motivo de orientação da Plan Norte.
 * Traço fino, geométrico, heráldico. Usada como marca d'água e ícone.
 */
export function CompassRose({
  size = 40,
  className = '',
  strokeWidth = 0.75,
  withLetters = false,
}: {
  size?: number
  className?: string
  strokeWidth?: number
  withLetters?: boolean
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke">
        {/* anéis */}
        <circle cx="100" cy="100" r="96" />
        <circle cx="100" cy="100" r="74" opacity="0.55" />
        <circle cx="100" cy="100" r="42" opacity="0.75" />
        <circle cx="100" cy="100" r="3.5" />

        {/* eixos cardeais longos */}
        <path d="M100 2v196M2 100h196" opacity="0.6" />

        {/* diagonais (colaterais) */}
        <path d="M31 31l138 138M169 31L31 169" opacity="0.3" />

        {/* estrela de 8 pontas — rombos finos */}
        <path d="M100 14 L112 88 L100 100 L88 88 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M100 186 L88 112 L100 100 L112 112 Z" fill="currentColor" fillOpacity="0.04" />
        <path d="M14 100 L88 88 L100 100 L88 112 Z" fill="currentColor" fillOpacity="0.04" />
        <path d="M186 100 L112 112 L100 100 L112 88 Z" fill="currentColor" fillOpacity="0.04" />

        {/* marcas de grau (ticks) */}
        {Array.from({ length: 72 }).map((_, i) => {
          const angle = (i * 5 * Math.PI) / 180
          const isMajor = i % 18 === 0
          const isMid = i % 9 === 0
          const r1 = 96
          const r2 = isMajor ? 84 : isMid ? 88 : 92
          return (
            <line
              key={i}
              x1={100 + Math.sin(angle) * r1}
              y1={100 - Math.cos(angle) * r1}
              x2={100 + Math.sin(angle) * r2}
              y2={100 - Math.cos(angle) * r2}
              opacity={isMajor ? 0.9 : isMid ? 0.5 : 0.22}
              strokeWidth={isMajor ? 1 : 0.5}
            />
          )
        })}

        {withLetters && (
          <g
            fill="currentColor"
            stroke="none"
            fontFamily="Georgia, serif"
            fontSize="13"
            textAnchor="middle"
            opacity="0.85"
          >
            <text x="100" y="24">N</text>
            <text x="100" y="187">S</text>
            <text x="181" y="105">L</text>
            <text x="19" y="105">O</text>
          </g>
        )}
      </g>
    </svg>
  )
}

/** Divisor com losango central — refinamento tipográfico */
export function DiamondDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-white/25" />
      <span className="h-1.5 w-1.5 rotate-45 border border-white/40" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-white/25" />
    </div>
  )
}
