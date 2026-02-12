interface Environment {
  production: boolean;
  apiUrl: string;
  apiTimeout: number;
  tokenKey: string;
  userKey: string;
}

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:8000',
  apiTimeout: 30000,
  tokenKey: 'auth_token',
  userKey: 'user_data',
};

export default environment;