import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import type { OAuthProvider } from './types'

const COPY: Record<OAuthProvider, { label: string; hint: string }> = {
  google: { label: 'Continuar com Google', hint: 'Conta pessoal ou Workspace' },
  discord: { label: 'Continuar com Discord', hint: 'Identify + e-mail' },
}

function Mark({ provider }: { provider: OAuthProvider }) {
  if (provider === 'google') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path
          fill="#ea4335"
          d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.9 2.3 2.8 6.4 2.8 11.5S6.9 20.7 12 20.7c5.2 0 8.6-3.6 8.6-8.7 0-.6 0-1-.1-1.5H12z"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        fill="#5865F2"
        d="M19.3 5.2A17.4 17.4 0 0 0 15 4l-.3.6a15.7 15.7 0 0 1 4 1.6 14.6 14.6 0 0 0-12.4 0A15.6 15.6 0 0 1 6.3 4.6L6 4a17.4 17.4 0 0 0-4.3 1.2C.3 8.3-.2 11.3 0 14.3a17.6 17.6 0 0 0 5.3 2.7l.7-1.1a11.3 11.3 0 0 1-2-1l.4-.3c3.7 1.7 7.7 1.7 11.3 0l.4.3a11.3 11.3 0 0 1-2 1l.7 1.1a17.6 17.6 0 0 0 5.3-2.7c.4-3.5-.3-6.5-1.8-9.1ZM8.5 13.4c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.9.9 1.8 2-.8 2-1.8 2Zm7 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.9.9 1.8 2-.8 2-1.8 2Z"
      />
    </svg>
  )
}

export function LoginPage() {
  const { user, providers, ready, signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (!ready) return <div className="login-boot">abrindo o estúdio…</div>
  if (user) return <Navigate to="/" replace />

  const oauth = (['google', 'discord'] as const).filter((key) => providers[key])

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setPending(true)
    try {
      if (mode === 'register') await signUp(name, email, password)
      else await signIn(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não deu pra entrar')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="login">
      <div className="login-stage" aria-hidden />
      <section className="login-card">
        <p className="login-kicker">reference3d</p>
        <h1>{mode === 'login' ? 'Acesse com uma conta' : 'Cria tua conta.'}</h1>
        <p className="login-lead">
          
        </p>

        <form className="login-form" onSubmit={onSubmit}>
          {mode === 'register' && (
            <label>
              Nome
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={2}
                autoComplete="name"
              />
            </label>
          )}
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={mode === 'register' ? 8 : 1}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />
          </label>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" disabled={pending}>
            {pending ? 'Aguarde…' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <button
          type="button"
          className="login-switch"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError(null)
          }}
        >
          {mode === 'login' ? 'Ainda não possui uma conta? Registre-se!' : 'Já tem uma conta? Entre!'}
        </button>

        {oauth.length > 0 && (
          <>
            <p className="login-or">ou</p>
            <ul className="login-providers">
              {oauth.map((provider) => (
                <li key={provider}>
                  <a className={`login-btn is-${provider}`} href={`/api/auth/${provider}`}>
                    <Mark provider={provider} />
                    <span>
                      <strong>{COPY[provider].label}</strong>
                      <small>{COPY[provider].hint}</small>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  )
}