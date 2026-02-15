import environment from "../config/environment";
import type { ApiError, OrderCreate, OrderResponse } from "../models/OrderModels";

const API_BASE_URL = environment.apiUrl;

class OrderService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('auth_token'); 
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        detail: errorData.detail || 'An error occurred',
        status_code: response.status,
      } as ApiError;
    }

    return response.json();
  }

  async createOrder(orderData: OrderCreate): Promise<OrderResponse> {
    return this.makeRequest<OrderResponse>('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }
}

export const orderService = new OrderService();
