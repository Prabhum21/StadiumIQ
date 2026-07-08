import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import Page from '../src/app/page';

// Mock the components that might use Leaflet or canvas which fail in JSDOM
jest.mock('../src/components/map/StadiumMap', () => {
  return function DummyMap() {
    return <div data-testid="map-component">Map</div>;
  };
});

jest.mock('chart.js', () => ({
  Chart: jest.fn(),
  register: jest.fn(),
}));

jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: '123' },
    loading: false,
    loginWithGoogle: jest.fn(),
    loginAsGuest: jest.fn(),
    logout: jest.fn(),
  })
}));

jest.mock('../src/hooks/useFirestore', () => ({
  useCrowd: () => ({ data: [], loading: false }),
  useIncidents: () => ({ data: [], loading: false }),
  useVolunteers: () => ({ data: [], loading: false }),
  useTransport: () => ({ data: [], loading: false }),
  useAlerts: () => ({ data: [], loading: false }),
  useVenue: () => ({ data: [], loading: false }),
}));

describe('Home Page', () => {
  it('renders without crashing', async () => {
    // Basic render test
    await act(async () => {
      render(<Page />);
    });
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
