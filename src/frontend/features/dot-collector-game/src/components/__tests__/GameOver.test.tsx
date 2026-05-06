import { render, screen, fireEvent } from '@testing-library/react';
import GameOver from '../GameOver';

describe('GameOver', () => {
  it('renders final score', () => {
    render(<GameOver score={150} onRestart={() => {}} />);
    expect(screen.getByText(/150/)).toBeInTheDocument();
  });

  it('calls onRestart when button clicked', () => {
    const onRestart = jest.fn();
    render(<GameOver score={100} onRestart={onRestart} />);
    fireEvent.click(screen.getByText(/Play Again/i));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it('displays game over message', () => {
    render(<GameOver score={100} onRestart={() => {}} />);
    expect(screen.getByText(/Game Over/i)).toBeInTheDocument();
  });
});
