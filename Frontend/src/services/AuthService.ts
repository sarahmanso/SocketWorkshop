import axios, { type AxiosInstance } from 'axios';
import environment from '../config/environment';
import type { LoginCredentials,AuthResponse,RegisterData,UserData,DecodedToken } from '../models/AuthModels';

const API_BASE_URL = environment.apiUrl;


class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: environment.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', credentials);
      const { access_token, token_type } = response.data;
      
      localStorage.setItem(environment.tokenKey, access_token);
      localStorage.setItem('token_type', token_type);

      const userData = this.decodeToken(access_token);
      if (userData) {
        localStorage.setItem(environment.userKey, JSON.stringify(userData));
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Login failed');
      }
      throw new Error('Login failed');
    }
  }

  async register(registerData: RegisterData): Promise<{ id: number; username: string; role: string }> {
    try {
      const response = await this.api.post('/auth/register', registerData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Registration failed');
      }
      throw new Error('Registration failed');
    }
  }

  logout(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem('token_type');
    localStorage.removeItem(environment.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const userData = this.decodeToken(token);
    if (!userData) return false;

    const currentTime = Date.now() / 1000;
    const isValid = userData.exp > currentTime;    
    return isValid;
}

  getCurrentUser(): UserData | null {
    const userStr = localStorage.getItem(environment.userKey);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as DecodedToken;
    } catch {
      return null;
    }
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }

  getApi(): AxiosInstance {
    return this.api;
  }
}

export const authService = new AuthService();
export default authService;