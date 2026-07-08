import { getApiUrl } from '../src/lib/api';
import { ENV } from '../src/config/env';

jest.mock('../src/config/env', () => ({
  ENV: {
    api: {
      baseUrl: 'http://localhost:8000',
    }
  }
}));

describe('getApiUrl', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    ENV.api.baseUrl = 'http://localhost:8000';
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should use NEXT_PUBLIC_API_URL when available', () => {
    ENV.api.baseUrl = 'https://api.stadiumiq.com';
    expect(getApiUrl('/test')).toBe('https://api.stadiumiq.com/test');
  });

  it('should fallback to localhost when NEXT_PUBLIC_API_URL is missing', () => {
    ENV.api.baseUrl = 'mock';
    expect(getApiUrl('/test')).toBe('http://localhost:8000/test');
  });

  it('should prevent double slashes in paths', () => {
    ENV.api.baseUrl = 'https://api.stadiumiq.com/';
    expect(getApiUrl('/test')).toBe('https://api.stadiumiq.com/test');
  });
});
