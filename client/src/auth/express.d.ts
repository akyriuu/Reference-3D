import type { AuthUser } from './auth.types';

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}

export {};