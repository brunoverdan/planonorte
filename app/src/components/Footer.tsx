export default function Footer() {
  return (
    <footer className="mt-16 border-t border-norte-800 bg-norte-950">
      <div className="container-norte flex flex-col gap-4 py-8 text-sm text-areia-400 md:flex-row md:items-center md:justify-between">
        <div>
          <img
            src="/logo-planonorte.png"
            alt="Plan Norte"
            className="h-7 w-auto select-none"
            draggable={false}
          />
          <p className="mt-1">Preservando e democratizando a cultura brasileira.</p>
        </div>
        <p>© {new Date().getFullYear()} Plan Norte · planeventus.com.br</p>
      </div>
    </footer>
  )
}
