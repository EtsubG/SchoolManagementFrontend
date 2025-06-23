// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for ngIf
import { RouterLink, RouterOutlet, Router } from '@angular/router'; // For routing capabilities

// Angular Material Modules for app.component.html
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from './services/auth.service'; // Our custom auth service

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, // Allows routes to be displayed
    RouterLink,   // Allows routerLink directive in HTML
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'School Management Frontend';
  isLoggedIn: boolean = false;
  userRole: string | null = null;

  constructor(public authService: AuthService, private router: Router) {} // Make authService public for template access

  ngOnInit(): void {
    // Subscribe to authentication status changes
    this.authService.userRole$.subscribe(role => {
      this.userRole = role;
      this.isLoggedIn = this.authService.isLoggedIn(); // Update login status based on service
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}