export type OAuthProvider = 'google' | 'discord'

export type AuthUser = { 
    provider: OAuthProvider;
    providerId: string;
    email: string | null;
    name: string;
    avatar: string | null;
};

export type JwtPayload = { 
    sub: string;
    provider: OAuthProvider;
    email: string | null;
    name: string;
    avatar: string | null;
}