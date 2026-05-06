import { render, screen, fireEvent } from '@testing-library/react';
import StartScreen from '../StartScreen';

describe('StartScreen', () => {
  it('renders start button', () => {
    render(<StartScreen onStart={() => {}} />);
    expect(screen.getByText(/Start Game/i)).toBeInTheDocument();
  });

  it('calls onStart when button clicked', () => {
    const onStart = jest.fn();
    render(<StartScreen onStart={onStart} />);
    fireEvent.click(screen.getByText(/Start Game/i));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('displays game title', () => {
    render(<StartScreen onStart={() => {}} />);
    expect(screen.getByText(/snake\.io/i)).toBeInTheDocument();
  });
});
