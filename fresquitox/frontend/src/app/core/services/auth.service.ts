import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const SESSION_KEY = 'fq_admin_session';
const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = 'admin123';
const SESSION_SECRET = 'fq-admin-session-v1';
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const token = sessionStorage.getItem(SESSION_KEY);
    if (!this.isValidSessionToken(token)) {
      this.clearSession();
      return false;
    }
    return true;
  }

  login(username: string, password: string): boolean {
    const valid =
      username.trim() === ADMIN_USER && password === ADMIN_PASSWORD;
    if (valid && isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(SESSION_KEY, this.createSessionToken());
    }
    return valid;
  }

  logout(): void {
    this.clearSession();
  }

  private clearSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }

  private createSessionToken(): string {
    const issuedAt = Date.now();
    return `${issuedAt}.${this.signSession(issuedAt)}`;
  }

  private isValidSessionToken(token: string | null): boolean {
    if (!token) return false;

    const [issuedAtStr, signature] = token.split('.');
    const issuedAt = Number(issuedAtStr);
    if (!issuedAt || !signature) return false;
    if (Date.now() - issuedAt > SESSION_MAX_AGE_MS) return false;

    return signature === this.signSession(issuedAt);
  }

  private signSession(issuedAt: number): string {
    const raw = `${ADMIN_USER}:${issuedAt}:${SESSION_SECRET}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }
}
