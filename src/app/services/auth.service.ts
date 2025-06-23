// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth'; // Your backend auth API base URL
  private token: string | null = null;
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  public userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserToken();
  }

  private loadUserToken(): void {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.decodeTokenAndSetRole(this.token);
    }
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, userData).pipe(
      tap(response => {
        this.setToken(response.token);
        this.decodeTokenAndSetRole(response.token);
      }),
      catchError(this.handleError) // We'll implement this later
    );
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.decodeTokenAndSetRole(response.token);
      }),
      catchError(this.handleError) // We'll implement this later
    );
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    this.userRoleSubject.next(null);
    this.router.navigate(['/login']); // Redirect to login after logout
  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return !!this.token; // Returns true if token exists, false otherwise
  }

  hasRole(requiredRole: string): boolean {
    const currentUserRole = this.userRoleSubject.getValue();
    return currentUserRole === requiredRole;
  }

  // A simplified token decoding function (for quick setup)
  private decodeTokenAndSetRole(token: string): void {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1])); // Decode base64 URL
        if (payload && payload.user && payload.user.role) {
          this.userRoleSubject.next(payload.user.role);
          return;
        }
      }
    } catch (e) {
      console.error('Error decoding token:', e);
    }
    this.userRoleSubject.next(null); // Fallback
  }

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error.error); // Log the error to console
    throw error; // Re-throw it so component can handle
  }
}