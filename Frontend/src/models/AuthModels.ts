export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserData {
  username: string;
  role: string;
}

export interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
  iat?: number;
}
