import { render, screen } from '@testing-library/react';

import ProductPage from '../index';

test('button should be clicked', () => {
  render(<ProductPage />);
  const button = screen.getAllByRole('heading', { name: 'Button' });
  expect(button).toBeInTheDocument();
  screen.debug();
});
