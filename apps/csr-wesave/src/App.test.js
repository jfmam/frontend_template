import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home call to action', () => {
  render(<App />);
  const linkElement = screen.getByRole('button', { name: /let's wesave/i });
  expect(linkElement).toBeInTheDocument();
});
