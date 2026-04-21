import { AppUser } from './user';

export interface ClaimRequest {
  id: number;
  item: number;
  item_title: string;
  user: AppUser;
  message: string;
  contact_info: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
