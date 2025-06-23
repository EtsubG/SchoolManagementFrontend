// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule for ngModel
import { CommonModule } from '@angular/common'; // <-- Import CommonModule

// Angular Material Imports (Directly into component)
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';
import { RouterLink, Router } from '@angular/router'; // <-- RouterLink for template and Router for programmatic navigation

@Component({
  selector: 'app-login',
  standalone: true, // This is already there if you used --standalone
  imports: [ // <-- This is the key difference for standalone components
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    RouterLink // For routerLink in template
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.errorMessage = null; // Clear previous errors
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/']); // Navigate to home or dashboard after login
      },
      error: (err) => {
        console.error('Login failed', err);
        // Check if err.error exists and has a msg property, otherwise use a generic message
        this.errorMessage = err.error && err.error.msg ? err.error.msg : 'Login failed. Please check your credentials.';
      }
    });
  }
}