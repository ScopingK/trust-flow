import apiClient from './client';

export interface LoginRequest {
  customerId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    name: string;
    account: string;
    balance: number;
  };
}

/**
 * Authenticate against the TrustFlow backend.
 *
 * On success the JWT is stored in localStorage so that `apiClient`
 * interceptors automatically attach it to subsequent requests.
 */
export async function login(req: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/api/v1/auth/login', req);

  // Persist token for apiClient interceptor
  localStorage.setItem('tf_auth_token', data.token);

  return data;
}

/**
 * Clear the stored auth token.
 */
export function logout(): void {
  localStorage.removeItem('tf_auth_token');
}
