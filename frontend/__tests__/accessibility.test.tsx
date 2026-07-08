import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Page from '../src/app/page';

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

describe('Page Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Page />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
