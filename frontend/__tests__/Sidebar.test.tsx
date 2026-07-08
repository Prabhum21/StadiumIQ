import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from '../src/components/dashboard/Sidebar';

describe('Sidebar Component', () => {
  const mockSetActiveTab = jest.fn();

  it('renders all navigation tabs', () => {
    render(
      <Sidebar
        sidebarOpen={true}
        activeTab="dashboard"
        setActiveTab={mockSetActiveTab}
        activeIncidents={2}
      />
    );
    expect(screen.getByText('Live Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Crowd Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Incidents')).toBeInTheDocument();
  });

  it('triggers active tab changes on click', () => {
    render(
      <Sidebar
        sidebarOpen={true}
        activeTab="dashboard"
        setActiveTab={mockSetActiveTab}
        activeIncidents={2}
      />
    );
    fireEvent.click(screen.getByText('Crowd Intelligence'));
    expect(mockSetActiveTab).toHaveBeenCalledWith('crowd');
  });
});
