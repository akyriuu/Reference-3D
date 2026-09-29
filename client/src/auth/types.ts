export type OAuthProvider = 'google' | 'discord' | 'apple'

export type AuthUser = {
  id: string
  provider: OAuthProvider
  email: string | null
  name: string
  avatar: string | null
}

export type AuthProviders = Record<OAuthProvider, boolean>