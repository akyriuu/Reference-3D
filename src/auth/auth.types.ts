export type AuthProvider = 'local' | 'google' | 'discord';

export type AuthUser = {
  provider: AuthProvider;
  providerId: string;
  email: string | null;
  name: string;
  avatar: string | null;
};

export type JwtPayload = {
  sub: string;
  provider: AuthProvider;
  email: string | null;
  name: string;
  avatar: string | null;
};