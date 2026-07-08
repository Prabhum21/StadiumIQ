import { renderHook, act } from '@testing-library/react';
import { useCollection } from '../src/hooks/useFirestore';
import { collection, onSnapshot, query } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
  db: {},
}));

describe('useFirestore hook', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should initialize with loading state', () => {
    (onSnapshot as jest.Mock).mockImplementation(() => jest.fn());
    
    const { result } = renderHook(() => useCollection('users'));
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should update data on snapshot', () => {
    const mockData = [{ id: '1', name: 'John' }];
    (onSnapshot as jest.Mock).mockImplementation((q, callback) => {
      callback({
        docs: mockData.map(doc => ({
          id: doc.id,
          data: () => doc
        }))
      });
      return jest.fn();
    });

    const { result } = renderHook(() => useCollection('users'));
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
  });

  it('should handle errors', () => {
    const mockError = new Error('Test error');
    (onSnapshot as jest.Mock).mockImplementation((q, callback, errorCallback) => {
      errorCallback(mockError);
      return jest.fn();
    });

    const { result } = renderHook(() => useCollection('users'));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(mockError);
  });
});
