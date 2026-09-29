import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import type { AuthUser, JwtPayload } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { 
    constructor(config: ConfigService) { 
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req.cookies?.access_token ?? null,
            ]),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
        });
    }

    validate(payload: JwtPayload): AuthUser { 
        const [provider, providerId] = payload.sub.split(':');
        return { 
            provider: provider as AuthUser['provider'],
            providerId,
            email: payload.email,
            name: payload.name,
            avatar: payload.avatar,
        };
    }
}