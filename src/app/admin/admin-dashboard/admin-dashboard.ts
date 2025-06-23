// src/app/admin/admin-dashboard/admin-dashboard.component.ts (or admin-dashboard.ts)
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav'; // For the sidebar
import { MatListModule } from '@angular/material/list';     // For navigation links
import { MatToolbarModule } from '@angular/material/toolbar'; // For a top bar inside dashboard
import { MatIconModule } from '@angular/material/icon';     // For icons next to list items
import { MatButtonModule } from '@angular/material/button'; // If you need buttons
import { RouterLink, RouterOutlet, Router } from '@angular/router'; // For nested routing

import { AuthService } from '../../services/auth.service'; // Adjust path if needed

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './admin-dashboard.html', // Make sure this matches your HTML file name
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  title = 'Admin Dashboard';
  isHandset$: boolean = false; // You can make this responsive later
  authService = inject(AuthService); // Inject AuthService for logout

  constructor(public router: Router) {}

  ngOnInit(): void {
    // Optional: Implement logic here if needed on dashboard load
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}