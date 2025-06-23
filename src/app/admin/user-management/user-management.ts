import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog'; // <-- This import is correct

// Ensure this path is correct based on your actual file name (user.ts or user.service.ts)
import { UserService } from '../../services/user'; // Assuming 'user.ts'
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog'; // Ensure .component is here

// Define the User interface (must match your backend's user object properties)
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  // Add other properties if your backend sends them and you use them (e.g., date, __v)
  date?: string;
  __v?: number;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './user-management.html', // Ensure this path is correct
  styleUrls: ['./user-management.css']   // Ensure this path is correct
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  // Ensure these column names exactly match the matColumnDef names in your HTML
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        console.log('Fetched users and assigned to this.users:', this.users); // Added this log for verification
        if (this.users.length === 0) {
            console.warn('No users were fetched, or the array is empty.');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching users:', err);
        alert('Failed to fetch users. Please check console for details.');
      }
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',
      data: { ...user } // Pass a copy of the user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog closed with data to save:', result);
        this.userService.updateUser(result._id, result).subscribe({
          next: (updatedUser: User) => {
            console.log('User updated successfully:', updatedUser);
            this.fetchUsers(); // Refresh the list after successful update
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error updating user:', err);
            alert('Failed to update user: ' + (err.error?.message || 'Server error.'));
          }
        });
      } else {
        console.log('Dialog closed without data (canceled)');
      }
    });
  }
  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          console.log('User deleted successfully');
          this.fetchUsers(); // Refresh the list after deletion
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user: ' + (err.error?.message || 'Server error.'));
        }
      });
    }
  }
 openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px', // You can adjust the width as needed
      // No data passed initially for adding a new user
    });

 dialogRef.afterClosed().subscribe(newUser => {
      if (newUser) {
        console.log('Dialog closed with new user data:', newUser);
        // NEW: Call the createUser service method
        this.userService.createUser(newUser).subscribe({
          next: (createdUser) => {
            console.log('User created successfully:', createdUser);
            this.fetchUsers(); // Refresh the list to show the new user
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error creating user:', err);
            alert('Failed to create user: ' + (err.error?.message || 'Server error.'));
          }
        });
      } else {
        console.log('Add User dialog canceled.');
      }
    });
  } 
}