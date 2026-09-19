import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Api, type City } from '../lib/api'

export default function Cities() {
  const [cities, setCities] = useState<City[]>([])
  useEffect(() => { Api.cities().then(setCities).catch(() => {}) }, [])

  return (
    <main className="container-norte py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-areia-100">Cidades</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((c) => (
          <Link
            key={c.id}
            to={`/cidade/${c.slug}`}
            className="flex items-center justify-between rounded-xl border border-norte-800 bg-norte-850 p-5 hover:border-ambar-600"
          >
            <div>
              <p className="font-display text-lg font-semibold text-areia-100">{c.name}</p>
              <p className="text-xs text-areia-400">{c.state?.name} · {c.state?.region?.name}</p>
            </div>
            <span className="text-areia-400">›</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
