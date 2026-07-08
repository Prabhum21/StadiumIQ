import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Page from '../src/app/page';
import AccessibilityAssistant from '../src/features/accessibility/AccessibilityAssistant';

expect.extend(toHaveNoViolations);

jest.mock('../src/components/map/StadiumMap', () => {
  return function DummyMap() {
    return <div data-testid="map-component">Map</div>;
  };
});

jest.mock('chart.js', () => ({
  Chart: jest.fn(),
  register: jest.fn(),
}));

jest.mock('@/hooks/useFirestore', () => ({
  useVenue: () => ({ data: [] }),
  useCrowd: () => ({ data: [] }),
}));

describe('Page Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Page />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('AccessibilityAssistant Component', () => {
  it('renders correctly', () => {
    render(<AccessibilityAssistant />);
    expect(screen.getByText('Accessibility Intelligence')).toBeInTheDocument();
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Accessible Route/i })).toBeInTheDocument();
  });

  it('can toggle accessibility profiles', () => {
    render(<AccessibilityAssistant />);
    const wheelchairCheckbox = screen.getByLabelText('Wheelchair');
    expect(wheelchairCheckbox).not.toBeChecked();

    // Using fireEvent on the label wrapper text since input is hidden,
    // but the most reliable way in Testing Library is to click the label.
    fireEvent.click(screen.getByText('Wheelchair'));
    expect(wheelchairCheckbox).toBeChecked();
  });
});
