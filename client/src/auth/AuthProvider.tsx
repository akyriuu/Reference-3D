import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AuthProviders, AuthUser } from './types'

type AuthState = {
  user: AuthUser | null
  providers: AuthProviders
  ready: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

const EMPTY: AuthProviders = { google: false, discord: false, apple: false }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [providers, setProviders] = useState<AuthProviders>(EMPTY)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      fetch('/api/auth/providers').then((res) => res.json() as Promise<AuthProviders>),
      fetch('/api/auth/me').then((res) => (res.ok ? (res.json() as Promise<AuthUser>) : null)),
    ])
      .then(([nextProviders, nextUser]) => {
        if (cancelled) return
        setProviders(nextProviders)
        setUser(nextUser)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, providers, ready, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth precisa do AuthProvider')
  return value
}