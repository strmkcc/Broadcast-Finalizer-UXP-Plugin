import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main heading', () => {
  render(<App />);
  const linkElement = screen.getByText(/Broadcast Finalizer/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders analyze button', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', { name: /Analyze/i });
  expect(buttonElement).toBeInTheDocument();
});
