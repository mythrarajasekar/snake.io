import { render, fireEvent } from '@testing-library/react';
import TouchControls from '../TouchControls';

describe('TouchControls', () => {
  it('renders control buttons', () => {
    const mockKeyboard = { setDirection: jest.fn() } as any;
    const { container } = render(<TouchControls keyboard={mockKeyboard} />);
    expect(container.querySelector('.dcg-touch-controls')).toBeInTheDocument();
  });

  it('calls keyboard.setDirection on button press', () => {
    const mockKeyboard = { setDirection: jest.fn() } as any;
    const { container } = render(<TouchControls keyboard={mockKeyboard} />);
    const upButton = container.querySelector('[data-direction="up"]');
    if (upButton) {
      fireEvent.touchStart(upButton);
      expect(mockKeyboard.setDirection).toHaveBeenCalledWith('up', true);
    }
  });
});
