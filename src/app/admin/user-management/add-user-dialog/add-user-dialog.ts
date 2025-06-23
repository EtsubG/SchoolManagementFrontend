// src/app/admin/user-management/add-user-dialog/add-user-dialog.component.ts (FULL CONTENT)
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // NEW: ReactiveFormsModule and form related imports
import { CommonModule } from '@angular/common'; // Already there, but good to check

// Angular Material Modules for the form
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog'; // To allow MatDialogClose directive

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Required for FormGroup
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule // Ensure MatDialogModule is imported for dialog functionality
  ],
  templateUrl: './add-user-dialog.html',
  styleUrl: './add-user-dialog.css'
})
export class AddUserDialogComponent implements OnInit { // Changed class name to AddUserDialogComponent
  userForm!: FormGroup; // Define FormGroup

  // Inject MatDialogRef and FormBuilder
  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialize the form with empty values and validators
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], // New users need a password
      role: ['Student', Validators.required] // Default role to 'Student' or your preferred default
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value); // Close dialog and pass form data
    } else {
      // Mark all fields as touched to display validation errors
      this.userForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Close dialog without passing data
  }
}