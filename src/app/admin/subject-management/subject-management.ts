// src/app/admin/subject-management/subject-management.component.ts (FULL CORRECTED CONTENT)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

// Corrected path for SubjectService
import { SubjectService, Subject } from '../../services/subject';
// Corrected import path for AddSubjectDialogComponent (added .component)
import { AddSubjectDialogComponent } from './add-subject-dialog/add-subject-dialog';
@Component({
  selector: 'app-subject-management',
  standalone: true, // Keep this if your Angular version supports standalone components generally
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule // Ensure MatDialogModule is here
  ],
  templateUrl: './subject-management.html', // Ensure this points to .html
  styleUrls: ['./subject-management.css']
})
export class SubjectManagementComponent implements OnInit {
  subjects: Subject[] = [];
  displayedColumns: string[] = ['name', 'code', 'description', 'teacher', 'actions'];

  constructor(
    private subjectService: SubjectService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchSubjects();
  }

  fetchSubjects(): void {
    this.subjectService.getSubjects().subscribe({
      next: (data: Subject[]) => {
        this.subjects = data;
        console.log('Fetched subjects:', this.subjects);
        if (this.subjects.length === 0) {
          console.warn('No subjects were fetched, or the array is empty.');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching subjects:', err);
        alert('Failed to fetch subjects. Please check console for details.');
      }
    });
  }

  openAddSubjectDialog(): void {
    const dialogRef = this.dialog.open(AddSubjectDialogComponent, {
      width: '500px', // Set a reasonable width for the dialog
      disableClose: true // Prevent closing by clicking outside
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // If result exists, a new subject was added
        this.fetchSubjects(); // Re-fetch the list to ensure data consistency
        alert('Subject added successfully!');
      }
    });
  }

  openEditSubjectDialog(subject: Subject): void {
    console.log('Open Edit Subject Dialog - not yet implemented');
  }

  deleteSubject(id: string): void {
    console.log('Delete Subject - not yet implemented');
  }
}