import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/my-posts']);
      },
      error: () => {
        this.errorMessage = 'Login failed. Check your username and password.';
        this.loading = false;
      }
    });
  }
}
