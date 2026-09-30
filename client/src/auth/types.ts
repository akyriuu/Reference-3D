export type AuthProviderName = 'local' | 'google' | 'discord'

export type OAuthProvider = 'google' | 'discord'

export type AuthUser = {
  id: string
  provider: AuthProviderName
  email: string | null
  name: string
  avatar: string | null
}

export type AuthProviders = {
  google: boolean
  discord: boolean
}