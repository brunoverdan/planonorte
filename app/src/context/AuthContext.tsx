import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Api, getToken, setToken } from '../lib/api'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, confirm: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }
    Api.me()
      .then((u) => setUser(u as AuthUser))
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const { user, token } = await Api.login(email, password)
    setToken(token)
    setUser(user as AuthUser)
  }

  async function register(name: string, email: string, password: string, confirm: string) {
    const { user, token } = await Api.register(name, email, password, confirm)
    setToken(token)
    setUser(user as AuthUser)
  }

  async function logout() {
    try {
      await Api.logout()
    } catch {
      /* ignore */
    }
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
