import { getApiUrl } from '../src/lib/api';
import { ENV } from '../src/config/env';

jest.mock('../src/config/env', () => ({
  ENV: {
    api: {
      baseUrl: 'http://localhost:8000',
    },
  },
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

  it('should throw an error when NEXT_PUBLIC_API_URL is missing or invalid', () => {
    ENV.api.baseUrl = 'mock';
    expect(() => getApiUrl('/test')).toThrow(
      'Configuration Error: NEXT_PUBLIC_API_URL environment variable is missing or invalid.'
    );
  });

  it('should prevent double slashes in paths', () => {
    ENV.api.baseUrl = 'https://api.stadiumiq.com/';
    expect(getApiUrl('/test')).toBe('https://api.stadiumiq.com/test');
  });
});
