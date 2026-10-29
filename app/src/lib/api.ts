import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { Accept: 'application/json' },
})

const TOKEN_KEY = 'planonorte_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401) {
      setToken(null)
    }
    return Promise.reject(error)
  },
)

// ---------- Types ----------
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  children?: Category[]
  videos_count?: number
}

export interface City {
  id: number
  name: string
  slug: string
  description?: string
  cover_image?: string
  state?: { id: number; name: string; slug: string; code?: string; region?: { id: number; name: string; slug: string } }
}

export interface Producer {
  id: number
  type: string
  name: string
  slug: string
  logo?: string
  website?: string
  bio?: string
  is_verified?: boolean
  city?: City
  videos_count?: number
}

export interface Video {
  id: number
  title: string
  slug: string
  short_description?: string
  description?: string
  year?: number
  duration_seconds?: number
  thumbnail?: string
  source_type: 'embed' | 'upload'
  embed_provider?: 'youtube' | 'vimeo'
  embed_id?: string
  embed_url?: string
  status?: 'draft' | 'in_review' | 'approved' | 'published' | 'archived'
  is_featured: boolean
  is_free: boolean
  views_count: number
  likes_count: number
  credits?: Record<string, unknown>
  categories?: Category[]
  tags?: { id: number; name: string; slug: string }[]
  producer?: Producer
  city?: City
  subtitles?: { id: number; language: string; label?: string; is_default: boolean }[]
}

export interface Paginated<T> {
  data: T[]
  meta?: { current_page: number; last_page: number; total: number }
}

// ---------- Endpoints ----------
export const Api = {
  home: () => api.get<{ hero: Video[]; recent: Video[]; most_watched: Video[]; popular: Video[] }>('/home').then((r) => r.data),
  videos: (params?: Record<string, unknown>) => api.get<{ data: Video[]; meta: unknown }>('/videos', { params }).then((r) => r.data),
  video: (idOrSlug: string | number) => api.get<{ data: Video; related: Video[] }>(`/videos/${idOrSlug}`).then((r) => r.data),
  categories: () => api.get<{ data: Category[] }>('/categories').then((r) => r.data.data),
  category: (slug: string) => api.get<{ data: Category }>(`/categories/${slug}`).then((r) => r.data.data),
  cities: () => api.get<{ data: City[] }>('/cities').then((r) => r.data.data),
  city: (slug: string) => api.get<{ data: City }>(`/cities/${slug}`).then((r) => r.data.data),
  events: (params?: Record<string, unknown>) => api.get<{ data: unknown[] }>('/events', { params }).then((r) => r.data.data),
  producers: (params?: Record<string, unknown>) => api.get<{ data: Producer[] }>('/producers', { params }).then((r) => r.data.data),
  producer: (slug: string) => api.get<{ data: Producer; videos: Video[] }>(`/producers/${slug}`).then((r) => r.data),
  search: (q: string) => api.get<{ query: string; videos: Video[]; producers: Producer[] }>('/search', { params: { q } }).then((r) => r.data),

  login: (email: string, password: string) => api.post<{ user: unknown; token: string }>('/auth/login', { email, password }).then((r) => r.data),
  register: (name: string, email: string, password: string, password_confirmation: string) =>
    api.post<{ user: unknown; token: string }>('/auth/register', { name, email, password, password_confirmation }).then((r) => r.data),
  me: () => api.get('/me').then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),

  myList: () => api.get<{ data: Video[] }>('/me/list').then((r) => r.data.data),
  toggleList: (videoId: number) => api.post<{ in_list: boolean }>(`/videos/${videoId}/list`).then((r) => r.data),
  history: () => api.get('/me/history').then((r) => r.data),
  progress: (videoId: number, position_seconds: number, duration_seconds?: number) =>
    api.post(`/videos/${videoId}/progress`, { position_seconds, duration_seconds }).then((r) => r.data),
  toggleLike: (videoId: number) => api.post<{ liked: boolean; likes_count: number }>(`/videos/${videoId}/like`).then((r) => r.data),
  rate: (videoId: number, rating: number) => api.post(`/videos/${videoId}/rating`, { rating }).then((r) => r.data),
  recommendations: () => api.get<{ data: Video[] }>('/me/recommendations').then((r) => r.data.data),

  adminDashboard: () => api.get('/admin/dashboard').then((r) => r.data),
  adminVideos: (params?: Record<string, unknown>) => api.get('/admin/videos', { params }).then((r) => r.data),
  adminCreateVideo: (payload: Record<string, unknown>) => api.post('/admin/videos', payload).then((r) => r.data),
  adminUpdateVideo: (id: number, payload: Record<string, unknown>) => api.put(`/admin/videos/${id}`, payload).then((r) => r.data),
  adminDeleteVideo: (id: number) => api.delete(`/admin/videos/${id}`).then((r) => r.data),
  adminReview: (id: number, status: string, notes?: string) => api.post(`/admin/videos/${id}/review`, { status, notes }).then((r) => r.data),
}
