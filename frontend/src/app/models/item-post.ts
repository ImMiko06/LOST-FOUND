import { AppUser } from './user';

export interface ItemPost {
  id: number;
  title: string;
  description: string;
  item_type: 'lost' | 'found';
  location: string;
  event_date: string;
  image: string | null;
  image_url: string;
  contact_info: string;
  status: 'active' | 'returned';
  created_at: string;
  updated_at: string;
  category: number;
  category_name: string;
  owner: AppUser;
  owner_id: number;
}

export interface ItemPostPayload {
  title: string;
  description: string;
  item_type: 'lost' | 'found';
  location: string;
  event_date: string;
  contact_info: string;
  status: 'active' | 'returned';
  category: number | null;
}
