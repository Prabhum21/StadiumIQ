import { getApiUrl } from '../src/lib/api';

describe('getApiUrl', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use NEXT_PUBLIC_API_URL when available', () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.stadiumiq.com';
    expect(getApiUrl('/test')).toBe('https://api.stadiumiq.com/test');
  });

  it('should fallback to localhost when NEXT_PUBLIC_API_URL is missing', () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    expect(getApiUrl('/test')).toBe('http://localhost:8000/test');
  });

  it('should prevent double slashes in paths', () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.stadiumiq.com/';
    expect(getApiUrl('/test')).toBe('https://api.stadiumiq.com/test');
  });
});
