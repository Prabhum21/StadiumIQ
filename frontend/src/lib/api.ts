import { ENV } from '@/config/env';

export function getApiUrl(path: string): string {
  const API_URL = ENV.api.baseUrl;
  if (!API_URL || API_URL.includes('mock')) {
    throw new Error(
      'Configuration Error: NEXT_PUBLIC_API_URL environment variable is missing or invalid.'
    );
  }

  // Ensure no double slashes
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const safePath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${safePath}`;
}
