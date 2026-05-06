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
    // Use document-level listeners in capture phase so input works regardless of focused element.
    document.addEventListener('keydown', this.handleKeyDown, { passive: false, capture: true });
    document.addEventListener('keyup', this.handleKeyUp, { capture: true });
    this.listenersAttached = true;
  }

  stopListening() {
    if (!this.listenersAttached) return;
    document.removeEventListener('keydown', this.handleKeyDown, { capture: true } as EventListenerOptions);
    document.removeEventListener('keyup', this.handleKeyUp, { capture: true } as EventListenerOptions);
    this.listenersAttached = false;
    this.state = { up: false, down: false, left: false, right: false };
    this.notify();
  }

  getState(): InputState {
    return { ...this.state };
  }

  subscribe(cb: Subscriber) {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter((c) => c !== cb);
    };
  }

  private notify() {
    const snapshot = { ...this.state };
    for (const cb of this.subscribers) cb(snapshot);
  }
}

export const keyboard = new KeyboardInputManager();

export default keyboard;
