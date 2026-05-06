import { render, screen } from '@testing-library/react';
import ScoreBoard from '../ScoreBoard';

describe('ScoreBoard', () => {
  it('renders score and time', () => {
    render(<ScoreBoard score={100} timeLeft={45} lives={3} highScore={200} />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/45/)).toBeInTheDocument();
  });

  it('displays high score', () => {
    render(<ScoreBoard score={50} timeLeft={30} lives={3} highScore={150} />);
    expect(screen.getByText(/150/)).toBeInTheDocument();
  });

  it('shows lives count', () => {
    render(<ScoreBoard score={50} timeLeft={30} lives={2} highScore={100} />);
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });
});
