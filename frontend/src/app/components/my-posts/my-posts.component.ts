import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ItemPost } from '../../models/item-post';
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.css'
})
export class MyPostsComponent implements OnInit {
  items: ItemPost[] = [];
  errorMessage = '';
  username = '';

  constructor(
    private readonly itemsService: ItemsService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getCurrentUser()?.username ?? '';
    this.itemsService.getMyItems().subscribe({
      next: (items) => {
        this.items = items;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(error);
        this.cdr.detectChanges();
      }
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    if (error.error?.detail) {
      return String(error.error.detail);
    }

    return `Could not load your posts. Status: ${error.status}`;
  }
}
