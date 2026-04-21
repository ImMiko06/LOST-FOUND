import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Category } from '../../models/category';
import { ItemPost } from '../../models/item-post';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css'
})
export class BrowseComponent implements OnInit {
  categories: Category[] = [];
  items: ItemPost[] = [];
  search = '';
  selectedCategory = '';
  selectedType = '';
  loading = false;
  errorMessage = '';

  constructor(
    private readonly itemsService: ItemsService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.itemsService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.cdr.detectChanges();
      }
    });
    this.loadItems();
  }

  applyFilters(): void {
    this.loadItems();
  }

  clearFilters(): void {
    this.search = '';
    this.selectedCategory = '';
    this.selectedType = '';
    this.loadItems();
  }

  private loadItems(): void {
    this.loading = true;
    this.itemsService.searchItems(this.search, this.selectedCategory, this.selectedType).subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not load items.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
