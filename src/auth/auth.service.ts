import {
    ConflictException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { JwtService } from '@nestjs/jwt';
  import { compare, hash } from 'bcryptjs';
  import type { Response } from 'express';
  import { PrismaService } from '../prisma/prisma.service';
  import type { AuthProvider, AuthUser, JwtPayload } from './auth.types';
  import { LoginDto } from './dto/login.dto';
  import { RegisterDto } from './dto/register.dto';
  
  const COOKIE = 'access_token';
  const WEEK = 7 * 24 * 60 * 60;
  const ROUNDS = 12;
  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly jwt: JwtService,
      private readonly config: ConfigService,
      private readonly prisma: PrismaService,
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
        secure: this.config.get('NODE_ENV') === 'production',
        maxAge: WEEK * 1000,
        path: '/',
      });
    }
  
    clearSession(res: Response) {
      res.clearCookie(COOKIE, { path: '/' });
    }
  
    clientRedirect(provider?: AuthProvider) {
      const base = this.config.get<string>('CLIENT_URL') ?? 'http://localhost:5173';
      return provider ? `${base}/?auth=${provider}` : `${base}/`;
    }
  
    private fromLocal(user: { id: string; email: string; name: string }): AuthUser {
      return {
        provider: 'local',
        providerId: user.id,
        email: user.email,
        name: user.name,
        avatar: null,
      };
    }
  
    async register(dto: RegisterDto): Promise<AuthUser> {
      const email = dto.email.trim().toLowerCase();
      const exists = await this.prisma.user.findUnique({ where: { email } });
      if (exists) throw new ConflictException('Este e-mail já tem conta');
  
      const created = await this.prisma.user.create({
        data: {
          email,
          name: dto.name.trim(),
          passwordHash: await hash(dto.password, ROUNDS),
        },
      });
  
      return this.fromLocal(created);
    }
  
    async login(dto: LoginDto): Promise<AuthUser> {
      const email = dto.email.trim().toLowerCase();
      const user = await this.prisma.user.findUnique({ where: { email } });
      const ok = user ? await compare(dto.password, user.passwordHash) : false;
      if (!user || !ok) {
        throw new UnauthorizedException('E-mail ou senha inválidos');
      }
      return this.fromLocal(user);
    }
  }