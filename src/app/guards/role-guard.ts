// src/app/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role']; // Get the expected role from route data

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']); // Not logged in, redirect to login
    return false;
  }

  if (authService.hasRole(expectedRole)) {
    return true; // User has the required role, allow access
  } else {
    // Optionally, navigate to a 'forbidden' page or dashboard based on user's actual role
    console.warn(`Access denied. User role: <span class="math-inline">\{authService\.userRole</span>.value}, Required role: ${expectedRole}`);
    // Example: Redirect to home or a generic dashboard
    router.navigate(['/']); // Redirect to home/login if role doesn't match
    return false;
  }
};
