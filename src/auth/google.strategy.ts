import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type Profile, type VerifyCallback } from 'passport-google-oauth20';
import type { AuthUser } from './auth.types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') { 
    constructor(config: ConfigService) { 
        super({
            clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
            clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        });
    }

    validate(_access: string, _refresh: string, profile: Profile, done: VerifyCallback) {
        const user: AuthUser = { 
            provider: 'google',
            providerId: profile.id,
            email: profile.emails?.[0]?.value ?? null,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value ?? null,
        };
        done(null, user);
    }
}