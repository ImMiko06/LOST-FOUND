import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.successMessage = 'Account created. You can log in now.';
        this.loading = false;
        setTimeout(() => void this.router.navigate(['/login']), 800);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(error);
        this.loading = false;
      }
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const data = error.error as Record<string, unknown> | null;
    if (!data) {
      return 'Registration failed. Please try again.';
    }

    const usernameErrors = data['username'];
    if (Array.isArray(usernameErrors) && usernameErrors.length > 0) {
      return String(usernameErrors[0]);
    }

    const passwordErrors = data['password'];
    if (Array.isArray(passwordErrors) && passwordErrors.length > 0) {
      return String(passwordErrors[0]);
    }

    const detail = data['detail'];
    if (typeof detail === 'string' && detail.trim()) {
      return detail;
    }

    return 'Registration failed. Please check username and password.';
  }
}
