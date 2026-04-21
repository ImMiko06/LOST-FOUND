import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AppUser } from './models/user';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  currentUser: AppUser | null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        void this.router.navigate(['/']);
      },
      error: () => {
        this.authService.forceLogout();
        void this.router.navigate(['/']);
      }
    });
  }
}
