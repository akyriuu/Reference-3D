import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type Profile } from 'passport-discord';
import type { AuthUser } from './auth.types';



@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow<string>('DISCORD_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('DISCORD_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('DISCORD_CALLBACK_URL'),
      scope: ['identify', 'email'],
    });
  }

  validate(_access: string, _refresh: string, profile: Profile, done: (err: Error | null, user?: AuthUser) => void) {
    const avatar = profile.avatar
      ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
      : null;

    done(null, {
      provider: 'discord',
      providerId: profile.id,
      email: profile.email ?? null,
      name: profile.global_name || profile.username,
      avatar,
    });
  }
}

