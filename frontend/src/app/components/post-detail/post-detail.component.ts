import { CommonModule } from '@angular/common';
import { HttpBackend, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ClaimRequest } from '../../models/claim-request';
import { ItemPost } from '../../models/item-post';
import { API_BASE_URL } from '../../core/api.config';
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  item: ItemPost | null = null;
  claims: ClaimRequest[] = [];
  claimMessage = '';
  claimContact = '';
  errorMessage = '';
  claimFeedback = '';
  loading = true;
  private readonly publicHttp: HttpClient;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    httpBackend: HttpBackend,
    private readonly itemsService: ItemsService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.publicHttp = new HttpClient(httpBackend);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id) || id <= 0) {
      this.loading = false;
      this.errorMessage = 'Invalid post id.';
      return;
    }
    this.loadItem(id);
  }

  get isOwner(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return Boolean(currentUser && this.item && currentUser.id === this.item.owner_id);
  }

  get canClaim(): boolean {
    return this.authService.isLoggedIn() && !!this.item && !this.isOwner;
  }

  deletePost(): void {
    if (!this.item) {
      return;
    }

    this.itemsService.deleteItem(this.item.id).subscribe({
      next: () => {
        void this.router.navigate(['/my-posts']);
      },
      error: () => {
        this.errorMessage = 'Could not delete the post.';
      }
    });
  }

  sendClaim(): void {
    if (!this.item) {
      return;
    }

    this.itemsService.createClaim(this.item.id, this.claimMessage, this.claimContact).subscribe({
      next: () => {
        this.claimFeedback = 'Claim request sent successfully.';
        this.claimMessage = '';
        this.claimContact = '';
        this.loadClaims();
      },
      error: () => {
        this.claimFeedback = 'Could not send the claim request.';
      }
    });
  }

  private loadItem(id: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.publicHttp.get<ItemPost>(`${API_BASE_URL}/items/${id}/`).subscribe({
      next: (item) => {
        this.item = item;
        this.loading = false;
        this.cdr.detectChanges();
        if (this.authService.isLoggedIn() && this.authService.getCurrentUser()?.id === item.owner_id) {
          this.loadClaims();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(error, 'Could not load this item.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadClaims(): void {
    this.itemsService.getClaims().subscribe({
      next: (claims) => {
        this.claims = claims;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(error, 'Could not load claim requests.');
        this.cdr.detectChanges();
      }
    });
  }

  private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    if (error.error?.detail) {
      return String(error.error.detail);
    }

    return `${fallback} Status: ${error.status}`;
  }
}
