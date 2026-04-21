import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api.config';
import { Category } from '../models/category';
import { ClaimRequest } from '../models/claim-request';
import { ItemPost } from '../models/item-post';

@Injectable({ providedIn: 'root' })
export class ItemsService {
  constructor(private readonly http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API_BASE_URL}/categories/`);
  }

  searchItems(query = '', category = '', itemType = ''): Observable<ItemPost[]> {
    let params = new HttpParams().set('q', query);
    if (category) {
      params = params.set('category', category);
    }
    if (itemType) {
      params = params.set('item_type', itemType);
    }
    return this.http.get<ItemPost[]>(`${API_BASE_URL}/items/search/`, { params });
  }

  getItems(): Observable<ItemPost[]> {
    return this.http.get<ItemPost[]>(`${API_BASE_URL}/items/`);
  }

  getMyItems(): Observable<ItemPost[]> {
    return this.http.get<ItemPost[]>(`${API_BASE_URL}/my-items/`);
  }

  getItem(id: number): Observable<ItemPost> {
    return this.http.get<ItemPost>(`${API_BASE_URL}/items/${id}/`);
  }

  createItem(payload: FormData): Observable<ItemPost> {
    return this.http.post<ItemPost>(`${API_BASE_URL}/items/`, payload);
  }

  updateItem(id: number, payload: FormData): Observable<ItemPost> {
    return this.http.put<ItemPost>(`${API_BASE_URL}/items/${id}/`, payload);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/items/${id}/`);
  }

  getClaims(): Observable<ClaimRequest[]> {
    return this.http.get<ClaimRequest[]>(`${API_BASE_URL}/claims/`);
  }

  createClaim(item: number, message: string, contact_info: string): Observable<ClaimRequest> {
    return this.http.post<ClaimRequest>(`${API_BASE_URL}/claims/`, { item, message, contact_info });
  }
}
