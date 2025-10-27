import { render, screen } from '@testing-library/react';
import App from './App';

test('renders weekly planner header', () => {
  render(<App />);
  const headerElement = screen.getByText(/weekly planner/i);
  expect(headerElement).toBeInTheDocument();
});
