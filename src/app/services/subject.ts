// src/app/services/subject.service.ts (FULL CONTENT)
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Make sure AuthService is correctly imported

// Define the Subject interface for type safety
export interface Subject {
  _id: string;
  name: string;
  code: string;
  description: string;
  // The 'teacher' field here reflects how it comes from the backend after population
  teacher: { _id: string, name: string, email: string };
  date?: string; // Optional, as it's auto-generated
  __v?: number; // Optional, for Mongoose versioning
}

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
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

  /**
   * Fetches all subjects from the backend.
   * @returns An Observable of an array of Subject objects.
   */
  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/subjects`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Creates a new subject on the backend.
   * @param subjectData An object containing the new subject's name, code, description, and the teacher's ID.
   * The teacher property here is a string (the ID), not the full User object.
   * @returns An Observable of the newly created Subject object (which will include populated teacher info).
   */
  createSubject(subjectData: Omit<Subject, '_id' | 'date' | '__v' | 'teacher'> & { teacher: string }): Observable<Subject> {
    return this.http.post<Subject>(`${this.apiUrl}/subjects`, subjectData, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // We will add update and delete methods here in later steps

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred.
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      if (error.error && error.error.msg) {
        errorMessage = error.error.msg; // Specific message from your backend
      } else if (error.status) {
        errorMessage = `Error ${error.status}: ${error.statusText || 'Server Error'}`;
      }
    }
    console.error('An error occurred in SubjectService:', error);
    return throwError(() => new Error(errorMessage));
  }
}