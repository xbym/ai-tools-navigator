import { refreshToken, isTokenExpired } from '@/lib/auth';

async function getToken(): Promise<string | null> {
  let token = localStorage.getItem('token');
  if (!token) return null;

  if (isTokenExpired(token)) {
    try {
      token = await refreshToken(token);
      localStorage.setItem('token', token);
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  }

  return token;
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getToken();
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token is invalid or expired
    localStorage.removeItem('token');
    // Redirect to login page or handle unauthorized access
    window.location.href = '/login';
  }

  return response;
}