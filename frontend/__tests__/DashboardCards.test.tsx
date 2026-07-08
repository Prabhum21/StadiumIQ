import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardCards } from '../src/components/dashboard/DashboardCards';

describe('DashboardCards Component', () => {
  it('renders correct count values for metrics', () => {
    render(
      <DashboardCards
        totalAttendance={45000}
        activeIncidents={3}
        avgQueueTime={12}
        availableVolunteers={85}
      />
    );
    expect(screen.getByText('45,000')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('12m')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });
});
