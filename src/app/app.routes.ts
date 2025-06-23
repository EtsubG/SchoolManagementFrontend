// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login'; // <-- ADD .component
import { RegisterComponent } from './auth/register/register'; // <-- ADD .component
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard'; 
import { authGuard } from './guards/auth-guard'; // Import authGuard
import { roleGuard } from './guards/role-guard'; // Import roleGuard
// Placeholder components for admin sections (we'll create these next)
import { UserManagementComponent } from './admin/user-management/user-management'; // Will generate
// import { StudentManagementComponent } from './admin/student-management/student-management.component'; // Later
// import { TeacherManagementComponent } from './admin/teacher-management/teacher-management.component'; // Later
 import { SubjectManagementComponent } from './admin/subject-management/subject-management'; // Later



export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard], // Apply both guards
    data: { role: 'Admin' },// Placeholder for now, will add guard later
children: [ 
      { path: 'users', component: UserManagementComponent }, // Path: /admin-dashboard/users
      // { path: 'students', component: StudentManagementComponent },
      // { path: 'teachers', component: TeacherManagementComponent },
      { path: 'subjects', component: SubjectManagementComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' } // Default admin path
    ] }, 
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/login' } // Wildcard route for any other invalid paths
];