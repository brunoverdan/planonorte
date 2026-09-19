import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Api, type Category, type Video } from '../lib/api'

interface Dashboard {
  users: number
  videos: { total: number; published: number; draft: number; in_review: number; archived: number }
  categories: number
  producers: number
  cities: number
  events: number
  views: { total: number; last_30_days: number }
}

const STATUS_LABEL: Record<string, string> = {
  draft: 'Rascunho',
  in_review: 'Em análise',
  approved: 'Aprovado',
  published: 'Publicado',
  archived: 'Arquivado',
}

export default function Admin() {
  const { user, loading: authLoading } = useAuth()
  const [tab, setTab] = useState<'dashboard' | 'videos'>('dashboard')
  const [dash, setDash] = useState<Dashboard | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [editing, setEditing] = useState<Partial<Video> | null>(null)
  const [msg, setMsg] = useState('')

  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin'

  useEffect(() => {
    if (!isAdmin) return
    Api.adminDashboard().then(setDash).catch(() => {})
    Api.adminVideos().then((r: { data: Video[] }) => setVideos(r.data)).catch(() => {})
    Api.categories().then(setCats).catch(() => {})
  }, [isAdmin])

  if (authLoading) return null
  if (!user) return <Navigate to="/entrar" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  function reload() {
    Api.adminVideos().then((r: { data: Video[] }) => setVideos(r.data)).catch(() => {})
    Api.adminDashboard().then(setDash).catch(() => {})
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    const payload: Record<string, unknown> = {
      title: editing.title,
      description: editing.description,
      short_description: editing.short_description,
      year: editing.year ?? undefined,
      source_type: 'embed',
      embed_provider: editing.embed_provider || 'youtube',
      embed_id: editing.embed_id,
      thumbnail: editing.thumbnail || undefined,
      duration_seconds: editing.duration_seconds ?? undefined,
      status: editing.status || 'draft',
      is_featured: !!editing.is_featured,
      is_free: editing.is_free !== false,
      category_ids: editing.categories?.map((c) => c.id) ?? [],
    }
    try {
      if (editing.id) await Api.adminUpdateVideo(editing.id, payload)
      else await Api.adminCreateVideo(payload)
      setEditing(null)
      setMsg('Vídeo salvo com sucesso.')
      reload()
    } catch {
      setMsg('Erro ao salvar. Verifique os campos obrigatórios.')
    }
  }

  async function review(id: number, status: string) {
    await Api.adminReview(id, status)
    setMsg(`Status alterado para ${STATUS_LABEL[status] || status}.`)
    reload()
  }

  async function remove(id: number) {
    if (!confirm('Remover este vídeo?')) return
    await Api.adminDeleteVideo(id)
    setMsg('Vídeo removido.')
    reload()
  }

  return (
    <main className="container-norte py-8">
      <h1 className="mb-4 font-display text-2xl font-bold text-areia-100">Painel Administrativo</h1>

      <div className="mb-6 flex gap-2">
        <button onClick={() => setTab('dashboard')} className={tabBtn(tab === 'dashboard')}>Dashboard</button>
        <button onClick={() => setTab('videos')} className={tabBtn(tab === 'videos')}>Vídeos</button>
        <button onClick={() => setEditing({ source_type: 'embed', embed_provider: 'youtube', status: 'draft' })} className="ml-auto rounded-lg bg-ambar-500 px-4 py-2 text-sm font-semibold text-norte-950 hover:bg-ambar-400">
          + Novo vídeo
        </button>
      </div>

      {msg ? <p className="mb-4 rounded-lg bg-mata-500/10 px-3 py-2 text-sm text-mata-500">{msg}</p> : null}

      {tab === 'dashboard' && dash ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <Stat label="Usuários" value={dash.users} />
          <Stat label="Vídeos" value={dash.videos.total} />
          <Stat label="Publicados" value={dash.videos.published} />
          <Stat label="Em análise" value={dash.videos.in_review} />
          <Stat label="Rascunhos" value={dash.videos.draft} />
          <Stat label="Categorias" value={dash.categories} />
          <Stat label="Produtores" value={dash.producers} />
          <Stat label="Cidades" value={dash.cities} />
          <Stat label="Eventos" value={dash.events} />
          <Stat label="Views (total)" value={dash.views.total} />
          <Stat label="Views (30d)" value={dash.views.last_30_days} />
        </div>
      ) : null}

      {tab === 'videos' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-norte-800 text-left text-areia-400">
                <th className="py-2 pr-4">Título</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Views</th>
                <th className="py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v.id} className="border-b border-norte-850">
                  <td className="py-2 pr-4 text-areia-100">{v.title}</td>
                  <td className="py-2 pr-4">
                    <span className="rounded bg-norte-800 px-2 py-0.5 text-xs text-areia-200">
                      {STATUS_LABEL[v.status as string] || v.status}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-areia-300">{v.views_count}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-1">
                      <button onClick={() => setEditing(v)} className="rounded border border-norte-700 px-2 py-1 text-xs text-areia-200 hover:bg-norte-800">Editar</button>
                      {v.status === 'draft' || v.status === 'in_review' ? (
                        <button onClick={() => review(v.id, 'published')} className="rounded border border-mata-600 px-2 py-1 text-xs text-mata-500 hover:bg-mata-500/10">Publicar</button>
                      ) : null}
                      {v.status === 'published' ? (
                        <button onClick={() => review(v.id, 'archived')} className="rounded border border-norte-700 px-2 py-1 text-xs text-areia-300 hover:bg-norte-800">Arquivar</button>
                      ) : null}
                      <button onClick={() => remove(v.id)} className="rounded border border-red-800 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {editing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-norte-950/80 p-4">
          <form onSubmit={save} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-norte-800 bg-norte-850 p-6">
            <h2 className="font-display text-xl font-bold text-areia-100">{editing.id ? 'Editar vídeo' : 'Novo vídeo'}</h2>

            <Field label="Título" value={editing.title || ''} onChange={(v) => setEditing({ ...editing, title: v })} required />
            <Field label="Descrição curta" value={editing.short_description || ''} onChange={(v) => setEditing({ ...editing, short_description: v })} />
            <Field label="Descrição" value={editing.description || ''} onChange={(v) => setEditing({ ...editing, description: v })} textarea />

            <div className="mt-4 grid grid-cols-2 gap-4">
              <label className="block text-sm text-areia-300">
                Provedor
                <select
                  value={editing.embed_provider || 'youtube'}
                  onChange={(e) => setEditing({ ...editing, embed_provider: e.target.value as Video['embed_provider'] })}
                  className="mt-1 w-full rounded-lg border border-norte-700 bg-norte-900 px-3 py-2 text-areia-100"
                >
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                </select>
              </label>
              <Field label="ID do vídeo (embed)" value={editing.embed_id || ''} onChange={(v) => setEditing({ ...editing, embed_id: v })} required />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <Field label="Ano" value={String(editing.year ?? '')} onChange={(v) => setEditing({ ...editing, year: v ? Number(v) : undefined })} type="number" />
              <Field label="Duração (segundos)" value={String(editing.duration_seconds ?? '')} onChange={(v) => setEditing({ ...editing, duration_seconds: v ? Number(v) : undefined })} type="number" />
            </div>

            <Field label="Thumbnail (URL)" value={editing.thumbnail || ''} onChange={(v) => setEditing({ ...editing, thumbnail: v })} />

            <label className="mt-4 block text-sm text-areia-300">
              Categoria
              <select
                value={editing.categories?.[0]?.id || ''}
                onChange={(e) => {
                  const c = cats.find((x) => x.id === Number(e.target.value))
                  setEditing({ ...editing, categories: c ? [c] : [] })
                }}
                className="mt-1 w-full rounded-lg border border-norte-700 bg-norte-900 px-3 py-2 text-areia-100"
              >
                <option value="">— Selecione —</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>

            <label className="mt-4 block text-sm text-areia-300">
              Status
              <select
                value={editing.status || 'draft'}
                onChange={(e) => setEditing({ ...editing, status: e.target.value as Video['status'] })}
                className="mt-1 w-full rounded-lg border border-norte-700 bg-norte-900 px-3 py-2 text-areia-100"
              >
                {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>

            <label className="mt-4 flex items-center gap-2 text-sm text-areia-300">
              <input type="checkbox" checked={!!editing.is_featured} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} />
              Destaque na home
            </label>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-norte-700 px-4 py-2 text-sm text-areia-200 hover:bg-norte-800">Cancelar</button>
              <button type="submit" className="rounded-lg bg-ambar-500 px-4 py-2 text-sm font-semibold text-norte-950 hover:bg-ambar-400">Salvar</button>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-norte-800 bg-norte-850 p-4">
      <p className="text-xs uppercase tracking-wide text-areia-400">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-areia-100">{value}</p>
    </div>
  )
}

function Field({
  label, value, onChange, required, textarea, type,
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; textarea?: boolean; type?: string }) {
  const cls = 'mt-1 w-full rounded-lg border border-norte-700 bg-norte-900 px-3 py-2 text-areia-100 focus:border-ambar-500 focus:outline-none'
  return (
    <label className="mt-4 block text-sm text-areia-300">
      {label}
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={cls} />
      ) : (
        <input type={type || 'text'} value={value} required={required} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </label>
  )
}

function tabBtn(active: boolean) {
  return `rounded-lg px-4 py-2 text-sm transition-colors ${
    active ? 'bg-norte-800 text-ambar-400' : 'text-areia-300 hover:bg-norte-800'
  }`
}
