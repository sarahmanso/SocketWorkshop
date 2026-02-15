import type { User } from "./UserModels";

export interface Order {
  id: number;
  name: string;
  description?: string;
  is_approved: boolean;
  created_at: string;
}

export interface OrderActivityModel {
  id: number;
  user_id: number;
  order_id: number;
  activity_time: string;
  user: User;
  order: Order;
}
