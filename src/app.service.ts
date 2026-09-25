import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): {status: string; uptime: number} { 
    return { status: 'ok', uptime: process.uptime() };
  }
 }