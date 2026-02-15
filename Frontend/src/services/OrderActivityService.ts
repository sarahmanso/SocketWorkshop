import authService from './AuthService';

interface User {
  id: number;
  username: string;
  role: string;
}

interface Order {
  id: number;
  name: string;
  description?: string;
  is_approved: boolean;
  created_at: string;
}

interface OrderActivity {
  id: number;
  user_id: number;
  order_id: number;
  activity_time: string;
  user: User;
  order: Order;
}

class OrderActivityService {
  async getAllActivities(skip: number = 0, limit: number = 100): Promise<OrderActivity[]> {
    const response = await authService.getApi().get('/order-activities/', {
      params: { skip, limit }
    });
    return response.data;
  }
}

export default new OrderActivityService();