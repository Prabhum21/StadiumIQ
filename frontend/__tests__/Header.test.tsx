import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../src/components/dashboard/Header';

describe('Header Component', () => {
  it('renders the header with the title', () => {
    render(<Header />);
    expect(screen.getByText(/StadiumIQ/i)).toBeInTheDocument();
  });
});
