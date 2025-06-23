// src/app/admin/subject-management/add-subject-dialog/add-subject-dialog.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select'; // For dropdown
import { MatOptionModule } from '@angular/material/core'; // For dropdown options
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Optional: for loading indicator

import { UserService, User } from '../../../services/user'; // To fetch teachers
import { SubjectService } from '../../../services/subject'; // To create subject
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-subject-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressBarModule, // Ensure this is in the imports array
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './add-subject-dialog.html',
  styleUrls: ['./add-subject-dialog.css']
})
export class AddSubjectDialogComponent implements OnInit {
  addSubjectForm: FormGroup;
  teachers: User[] = []; // To store users with 'Teacher' role
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddSubjectDialogComponent>,
    private userService: UserService, // Inject UserService
    private subjectService: SubjectService // Inject SubjectService
  ) {
    this.addSubjectForm = new FormGroup({
      name: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      teacher: new FormControl('', Validators.required) // Store teacher's _id
    });
  }

  ngOnInit(): void {
    this.fetchTeachers();
  }

  fetchTeachers(): void {
    // Set isLoading to true, wrapped in setTimeout
    setTimeout(() => {
      this.isLoading = true;
      this.errorMessage = null;
    }, 0);

    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.teachers = users.filter(user => user.role === 'Teacher');
        if (this.teachers.length === 0) {
          this.errorMessage = 'No teachers found. Please ensure teacher accounts exist.';
        }
        // Set isLoading to false on success, wrapped in setTimeout
        setTimeout(() => {
          this.isLoading = false;
        }, 0);
      },
      error: (err: HttpErrorResponse) => {
        // Set isLoading to false on error, wrapped in setTimeout
        setTimeout(() => {
          this.isLoading = false;
          this.errorMessage = err.error?.msg || 'Failed to fetch teachers.';
        }, 0);
        console.error('Error fetching teachers:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.addSubjectForm.valid) {
      // Set isLoading to true, wrapped in setTimeout
      setTimeout(() => {
        this.isLoading = true;
        this.errorMessage = null;
      }, 0);

      this.subjectService.createSubject(this.addSubjectForm.value).subscribe({
        next: (newSubject) => {
          // Set isLoading to false on success, wrapped in setTimeout
          setTimeout(() => {
            this.isLoading = false;
          }, 0);
          this.dialogRef.close(newSubject); // Close dialog and pass the new subject
        },
        error: (err: HttpErrorResponse) => {
          // Already had this one, but confirming it's correct
          setTimeout(() => {
            this.isLoading = false;
            this.errorMessage = err.error?.msg || 'Failed to add subject. Please try again.';
          }, 0);
          console.error('Error adding subject:', err);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Close dialog without returning data
  }
}