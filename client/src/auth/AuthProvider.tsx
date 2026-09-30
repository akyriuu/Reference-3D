import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AuthProviders, AuthUser } from './types'

type Credentials = {
  email: string
  password: string
  name?: string
}

type AuthState = {
  user: AuthUser | null
  providers: AuthProviders
  ready: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

const EMPTY: AuthProviders = { google: false, discord: false }

async function submit(path: 'login' | 'register', body: Credentials) {
  const res = await fetch(`/api/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = Array.isArray(data.message) ? data.message[0] : data.message
    throw new Error(typeof message === 'string' ? message : 'Não deu pra entrar')
  }
  return data as AuthUser
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [providers, setProviders] = useState<AuthProviders>(EMPTY)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      fetch('/api/auth/providers').then((res) =>
        res.ok ? (res.json() as Promise<AuthProviders>) : EMPTY,
      ),
      fetch('/api/auth/me').then((res) => (res.ok ? (res.json() as Promise<AuthUser>) : null)),
    ])
      .then(([nextProviders, nextUser]) => {
        if (cancelled) return
        setProviders(nextProviders)
        setUser(nextUser)
      })
      .catch(() => {
        if (!cancelled) {
          setProviders(EMPTY)
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setUser(await submit('login', { email, password }))
  }

  const signUp = async (name: string, email: string, password: string) => {
    setUser(await submit('register', { name, email, password }))
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, providers, ready, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth precisa do AuthProvider')
  return value
}