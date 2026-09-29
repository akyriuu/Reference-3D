import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthUser, OAuthProvider } from './auth.types';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('providers')
  providers() {
    return this.auth.enabledProviders();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request) {
    return this.auth.toPublic(req.user as AuthUser);
  }

  @Post('logout')
  logout(@Res({ passthrough: false }) res: Response) {
    this.auth.clearSession(res);
    res.json({ ok: true });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  google() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: Request, @Res() res: Response) {
    return this.finish(req, res, 'google');
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  discord() {}

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  discordCallback(@Req() req: Request, @Res() res: Response) {
    return this.finish(req, res, 'discord');
  }

  private finish(req: Request, res: Response, provider: OAuthProvider) {
    this.auth.attachSession(res, req.user as AuthUser);
    res.redirect(this.auth.clientRedirect(provider));
  }
}