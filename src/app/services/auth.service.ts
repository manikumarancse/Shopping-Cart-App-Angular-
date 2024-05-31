import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sessionIdKey = 'sessionId';

  constructor() {}

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.sessionIdKey);
  }

  // Retrieve the session ID
  getSessionId(): string | null {
    return localStorage.getItem(this.sessionIdKey);
  }

  // Mock login method - generate a session ID
  login(): void {
    const sessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(this.sessionIdKey, sessionId);
  }

  // Mock logout method
  logout(): void {
    localStorage.removeItem(this.sessionIdKey);
  }
}
