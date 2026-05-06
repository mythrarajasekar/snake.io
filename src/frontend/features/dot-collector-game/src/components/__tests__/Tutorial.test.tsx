import { render, screen, fireEvent } from '@testing-library/react';
import Tutorial from '../Tutorial';

describe('Tutorial', () => {
  it('renders tutorial content', () => {
    render(<Tutorial onClose={() => {}} />);
    expect(screen.getByText(/How to Play/i)).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(<Tutorial onClose={onClose} />);
    fireEvent.click(screen.getByText(/Got it/i));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
