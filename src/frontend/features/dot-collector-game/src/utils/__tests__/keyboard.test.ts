import { KeyboardInputManager } from '../keyboard';

describe('KeyboardInputManager', () => {
  let keyboard: KeyboardInputManager;

  beforeEach(() => {
    keyboard = new KeyboardInputManager();
    keyboard.startListening();
  });

  afterEach(() => {
    keyboard.stopListening();
  });

  it('initializes with no keys pressed', () => {
    const state = keyboard.getState();
    expect(state.up).toBe(false);
    expect(state.down).toBe(false);
    expect(state.left).toBe(false);
    expect(state.right).toBe(false);
  });

  it('detects arrow key presses', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    document.dispatchEvent(event);
    const state = keyboard.getState();
    expect(state.up).toBe(true);
  });

  it('detects WASD key presses', () => {
    const event = new KeyboardEvent('keydown', { key: 'w' });
    document.dispatchEvent(event);
    const state = keyboard.getState();
    expect(state.up).toBe(true);
  });

  it('sets direction programmatically', () => {
    keyboard.setDirection('right', true);
    const state = keyboard.getState();
    expect(state.right).toBe(true);
  });

  it('clears direction on keyup', () => {
    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    document.dispatchEvent(downEvent);
    const upEvent = new KeyboardEvent('keyup', { key: 'ArrowUp' });
    document.dispatchEvent(upEvent);
    const state = keyboard.getState();
    expect(state.up).toBe(false);
  });
});
