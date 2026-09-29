import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import type { AuthUser, JwtPayload, OAuthProvider } from './auth.types';

const COOKIE = 'access_token';
const WEEK = 7 * 24 * 60 * 60;

@Injectable()
export class AuthService { 
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) {}

    enabledProviders() { 
        return { 
            google: Boolean(this.config.get('GOOGLE_CLIENT_ID')),
            discord: Boolean(this.config.get('DISCORD_CLIENT_ID')),
        };
    }

    toPublic(user: AuthUser) { 
        return { 
            id: `${user.provider}:${user.providerId}`,
            provider: user.provider,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
        };
    }

    attachSession(res: Response, user: AuthUser) { 
        const token = this.jwt.sign({
            sub: `${user.provider}:${user.providerId}`,
            provider: user.provider,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
        } satisfies JwtPayload);

        res.cookie(COOKIE, token, { 
            httpOnly: true,
            sameSite: 'lax',
            secure:  this.config.get('NODE_ENV') === 'production',
            maxAge: WEEK * 1000,
            path: '/',
        });
    }

    clearSession(res: Response) { 
        res.clearCookie(COOKIE, { path: '/' });
    }

    clientRedirect(provider?: OAuthProvider) { 
        const base = this.config.get<string>('CLIENT_URL') ?? 'http://localhost:5173';
        return provider ? `${base}/?auth=${provider}` : `${base}/`;
    }
}