import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ItemPost } from '../../models/item-post';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  recentItems: ItemPost[] = [];
  errorMessage = '';

  constructor(private readonly itemsService: ItemsService) {}

  ngOnInit(): void {
    this.itemsService.getItems().subscribe({
      next: (items) => {
        this.recentItems = items.slice(0, 4);
      },
      error: () => {
        this.errorMessage = 'Could not load recent items.';
      }
    });
  }
}
