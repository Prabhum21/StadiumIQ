import { ENV } from '@/config/env';

export function getApiUrl(path: string): string {
  const API_URL = ENV.api.baseUrl;
  if (!API_URL || API_URL.includes('mock')) {
    console.error('Configuration Error: API_URL environment variable is missing.');
    return `http://localhost:8000${path}`;
  }

  // Ensure no double slashes
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const safePath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${safePath}`;
}
