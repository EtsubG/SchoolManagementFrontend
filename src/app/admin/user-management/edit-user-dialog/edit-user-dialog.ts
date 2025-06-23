
// src/app/admin/user-management/edit-user-dialog/edit-user-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'; // For role selection
import { MatDialogModule } from '@angular/material/dialog';
// Define the User interface (must match your other User interface exactly)
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule, // Import MatDialogModule for dialog functionality
    MatSelectModule,// Add MatSelectModule
    
  ],
  templateUrl: './edit-user-dialog.html',
  styleUrls: ['./edit-user-dialog.css']
})
export class EditUserDialogComponent implements OnInit {
  editUserForm!: FormGroup; // Form group for user data

  // Available roles (adjust as per your backend roles)
  roles: string[] = ['Admin', 'Teacher', 'Student'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User // Inject the user data passed to the dialog
  ) { }

  ngOnInit(): void {
    // Initialize the form with the injected user data
    this.editUserForm = this.fb.group({
      name: [this.data.name, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      role: [this.data.role, Validators.required]
      // Password field is typically handled separately for security
    });
  }

  onSave(): void {
    if (this.editUserForm.valid) {
      // Return the updated user object (including the _id for backend update)
      this.dialogRef.close({ ...this.data, ...this.editUserForm.value });
    } else {
      this.editUserForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Close dialog without returning data
  }
}
