import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { API_BASE_URL } from '../core/api.config';
import { AppUser } from '../models/user';

interface AuthResponse {
  access: string;
  refresh: string;
  user: AppUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessKey = 'lostfound_access';
  private readonly refreshKey = 'lostfound_refresh';
  private readonly userKey = 'lostfound_user';
  private readonly currentUserSubject = new BehaviorSubject<AppUser | null>(this.readUser());

  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  register(username: string, password: string): Observable<{ user: AppUser }> {
    return this.http.post<{ user: AppUser }>(`${API_BASE_URL}/register/`, { username, password });
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/login/`, { username, password }).pipe(
      tap((response) => {
        localStorage.setItem(this.accessKey, response.access);
        localStorage.setItem(this.refreshKey, response.refresh);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): Observable<void> {
    const refresh = localStorage.getItem(this.refreshKey);
    return this.http.post<void>(`${API_BASE_URL}/logout/`, { refresh }).pipe(
      tap(() => this.forceLogout())
    );
  }

  forceLogout(): void {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return Boolean(this.getAccessToken());
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessKey);
  }

  getCurrentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }

  private readUser(): AppUser | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AppUser;
    } catch {
      return null;
    }
  }
}
