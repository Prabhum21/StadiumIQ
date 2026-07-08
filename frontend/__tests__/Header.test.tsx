import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../src/components/dashboard/Header';

describe('Header Component', () => {
  it('renders the header with the title', () => {
    const dummyUser = { uid: "1", email: "test@test.com", displayName: "Tester", role: "Fan" as const, isGuest: false };
    render(<Header sidebarOpen={false} setSidebarOpen={() => {}} activeIncidents={0} user={dummyUser} logout={() => {}} />);
    expect(screen.getByText(/Live Dashboard/i)).toBeInTheDocument();
  });
});
