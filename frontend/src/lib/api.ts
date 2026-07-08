export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function getApiUrl(path: string): string {
  if (!API_URL) {
    console.error("Configuration Error: NEXT_PUBLIC_API_URL environment variable is missing.");
    // Fallback for local development if forgot to set env var, but warn loudly.
    return `http://localhost:8000${path}`;
  }
  
  // Ensure no double slashes
  const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
  const safePath = path.startsWith("/") ? path : `/${path}`;
  
  return `${baseUrl}${safePath}`;
}
