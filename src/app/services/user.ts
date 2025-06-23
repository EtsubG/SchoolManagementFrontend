// src/app/services/user.ts (or user.service.ts - use the correct filename)
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Ensure correct path for auth.service.ts

// Define the User interface (must match your backend's user object properties)
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  date?: string;
  __v?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api'; // Your backend API base URL

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token found for API request. Redirecting to login or handling error.');
      throw new Error('Authentication token is missing. Please log in again.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getUsers(): Observable<User[]> {
    // Ensure backticks (`) are used here, NOT single or double quotes
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    const dataToSend: Partial<User> = {
        name: userData.name,
        email: userData.email,
        role: userData.role
    };
    // Ensure backticks (`) are used here, NOT single or double quotes
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, dataToSend, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteUser(id: string): Observable<void> {
    // Ensure backticks (`) are used here, NOT single or double quotes
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }
  createUser(userData: Partial<User>): Observable<User> {
    // For creating, we send the whole user object (name, email, password, role)
    // Ensure you don't send _id or __v from frontend here, as backend generates them
    return this.http.post<User>(`${this.apiUrl}/users`, userData, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong; please try again later.';
    if (error.error && error.error.msg) {
      errorMessage = error.error.msg;
    } else if (error.status) {
      errorMessage = `Error ${error.status}: ${error.statusText || 'Server Error'}`;
    }
    console.error('An error occurred:', error);
    return throwError(() => new Error(errorMessage));
  }
}