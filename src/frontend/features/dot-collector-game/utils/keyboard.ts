// Responsibility: Keyboard input manager that normalizes Arrow/WASD input,
// supports simultaneous key presses, and provides a lightweight polling API
// for the game loop. Designed to be started/stopped to attach/detach event listeners.

export type InputState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

type Subscriber = (state: InputState) => void;

const KEY_MAP: Record<string, keyof InputState> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
};

export class KeyboardInputManager {
  private state: InputState = { up: false, down: false, left: false, right: false };
  private listenersAttached = false;
  private subscribers: Subscriber[] = [];

  private handleKeyDown = (e: KeyboardEvent) => {
    const k = KEY_MAP[e.key];
    if (!k) return;
    if (!this.state[k]) {
      this.state[k] = true;
      this.notify();
    }
    // prevent default scrolling behavior for arrows and WASD
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(e.key)) {
      e.preventDefault();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    const k = KEY_MAP[e.key];
    if (!k) return;
    if (this.state[k]) {
      this.state[k] = false;
      this.notify();
    }
  };

  startListening() {
    if (this.listenersAttached) return;
    window.addEventListener('keydown', this.handleKeyDown, { passive: false });
    window.addEventListener('keyup', this.handleKeyUp);
    this.listenersAttached = true;
  }

  stopListening() {
    if (!this.listenersAttached) return;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.listenersAttached = false;
    // reset state
    this.state = { up: false, down: false, left: false, right: false };
    this.notify();
  }

  getState(): InputState {
    // return a shallow copy to avoid accidental mutation
    return { ...this.state };
  }

  subscribe(cb: Subscriber) {
    this.subscribers.push(cb);
    // return unsubscribe
    return () => {
      this.subscribers = this.subscribers.filter((c) => c !== cb);
    };
  }

  private notify() {
    const snapshot = { ...this.state };
    for (const cb of this.subscribers) cb(snapshot);
  }
}

// Export a singleton manager for simple use inside the feature.
export const keyboard = new KeyboardInputManager();

export default keyboard;
