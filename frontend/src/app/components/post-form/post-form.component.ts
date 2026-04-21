import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Category } from '../../models/category';
import { ItemPost, ItemPostPayload } from '../../models/item-post';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent implements OnInit {
  private readonly maxFileSizeMb = 5;
  private readonly maxImageDimension = 1600;
  private readonly jpegQuality = 0.82;
  categories: Category[] = [];
  itemId: number | null = null;
  loading = false;
  pageTitle = 'Create a new item post';
  errorMessage = '';
  selectedFile: File | null = null;
  selectedFileLabel = '';
  payload: ItemPostPayload = {
    title: '',
    description: '',
    item_type: 'found',
    location: '',
    event_date: '',
    contact_info: '',
    status: 'active',
    category: null
  };

  constructor(
    private readonly itemsService: ItemsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.itemId = id ? Number(id) : null;
    this.pageTitle = this.itemId ? 'Edit your item post' : 'Create a new item post';
    this.loading = true;

    const data$ = this.itemId
      ? forkJoin({
          categories: this.itemsService.getCategories(),
          item: this.itemsService.getItem(this.itemId)
        })
      : forkJoin({
          categories: this.itemsService.getCategories()
        });

    data$.subscribe({
      next: (result) => {
        this.categories = result.categories;
        if ('item' in result) {
          const item = result.item as ItemPost;
          this.payload = {
            title: item.title,
            description: item.description,
            item_type: item.item_type,
            location: item.location,
            event_date: item.event_date,
            contact_info: item.contact_info,
            status: item.status,
            category: item.category
          };
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not load form data.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  save(): void {
    this.errorMessage = '';

    if (this.payload.category === null) {
      this.errorMessage = 'Please choose a category before saving the post.';
      return;
    }

    this.loading = true;
    const formData = this.buildFormData();

    const request$ = this.itemId
      ? this.itemsService.updateItem(this.itemId, formData)
      : this.itemsService.createItem(formData);

    request$.subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/my-posts']);
      },
      error: () => {
        this.errorMessage = 'Could not save the post. Check the form and try again.';
        this.loading = false;
      }
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.selectedFile = null;
      this.selectedFileLabel = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please choose an image file.';
      this.selectedFile = null;
      this.selectedFileLabel = '';
      input.value = '';
      return;
    }

    if (file.size > this.maxFileSizeMb * 1024 * 1024) {
      this.errorMessage = `Image is too large. Please choose a file under ${this.maxFileSizeMb} MB.`;
      this.selectedFile = null;
      this.selectedFileLabel = '';
      input.value = '';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const compressed = await this.compressImage(file);
      this.selectedFile = compressed;
      const originalMb = (file.size / (1024 * 1024)).toFixed(2);
      const compressedMb = (compressed.size / (1024 * 1024)).toFixed(2);
      this.selectedFileLabel = `${compressed.name} (${originalMb} MB -> ${compressedMb} MB)`;
    } catch {
      this.selectedFile = file;
      this.selectedFileLabel = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
    } finally {
      this.loading = false;
    }
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    formData.append('title', this.payload.title);
    formData.append('description', this.payload.description);
    formData.append('item_type', this.payload.item_type);
    formData.append('location', this.payload.location);
    formData.append('event_date', this.payload.event_date);
    formData.append('contact_info', this.payload.contact_info);
    formData.append('status', this.payload.status);
    if (this.payload.category !== null) {
      formData.append('category', String(this.payload.category));
    }
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    return formData;
  }

  private async compressImage(file: File): Promise<File> {
    if (file.type === 'image/gif') {
      return file;
    }

    const dataUrl = await this.readFileAsDataUrl(file);
    const image = await this.loadImage(dataUrl);
    const { width, height } = this.getScaledDimensions(image.width, image.height);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      return file;
    }

    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', this.jpegQuality);
    });

    if (!blob || blob.size >= file.size) {
      return file;
    }

    const fileName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], fileName, { type: 'image/jpeg' });
  }

  private getScaledDimensions(width: number, height: number): { width: number; height: number } {
    const longestSide = Math.max(width, height);
    if (longestSide <= this.maxImageDimension) {
      return { width, height };
    }

    const scale = this.maxImageDimension / longestSide;
    return {
      width: Math.round(width * scale),
      height: Math.round(height * scale)
    };
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }
}
