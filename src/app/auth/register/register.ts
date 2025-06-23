// src/app/auth/register/register.component.ts (or register.ts)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../../services/auth.service'; // Adjust path if needed

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Add ReactiveFormsModule here
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './register.html', // Make sure this matches your HTML file name
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup; // Use definite assignment assertion

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required], // <-- ADD THIS LINE for 'name'
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const { name, email, password } = this.registrationForm.value; // <-- DESTUCTURE 'name'
const userData = this.registrationForm.value;
this.authService.register(userData).subscribe({ // <-- PASS 'name'
        next: (response) => {
          console.log('Registration successful', response);
          // Optionally, you might want to log the user in immediately or redirect to login
          this.router.navigate(['/login']); // Redirect to login page after successful registration
        },
        error: (err) => {
          console.error('Registration failed', err);
          // Handle registration error (e.g., show a message to the user)
          alert('Registration failed: ' + (err.error.message || 'Please try again.'));
        }
      });
    } else {
      // Mark all fields as touched to display validation errors
      this.registrationForm.markAllAsTouched();
    }
  }
}