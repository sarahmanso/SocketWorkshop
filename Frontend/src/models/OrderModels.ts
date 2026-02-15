export interface OrderCreate {
  name: string;
  description: string;
}

export interface OrderResponse {
  id: number;
  name: string;
  description: string;
  user_id: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}
