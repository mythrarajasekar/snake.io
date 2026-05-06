import { GameState, GameConfig, TickCallback, InputState, DotState, ParticleState } from '../types/game.types';
import { keyboard } from '../utils/keyboard';
import Dot from './Dot';
import { rectCircleCollision } from './Collision';

// lightweight id generator
let __idCounter = 0;
function makeId() {
  __idCounter += 1;
  return `id_${Date.now()}_${__idCounter}`;
}

// Responsibility: Single authoritative game loop using requestAnimationFrame.
// It owns an internal GameState and exposes lifecycle controls and a tick
// subscription API. Rendering is performed by subscribers to allow decoupled
// canvas drawing (imperative) while keeping React updates throttled.
export class GameLoop {
  private running = false;
  private rafId: number | null = null;
  private lastTime = 0;
  public state: GameState;
  private config: GameConfig;
  private subscribers: TickCallback[] = [];

  constructor(initialState: GameState, config: GameConfig) {
    this.state = initialState;
    this.config = config;

    // ensure at least one dot exists at start
    if (!this.state.dots || this.state.dots.length === 0) {
      this.state.dots = [Dot.spawnRandom(makeId(), { width: this.config.width, height: this.config.height }, this.state.player as any, 8)];
    }
  }

  // Start the rAF loop
  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    // attach keyboard listeners when loop starts
    keyboard.startListening();
    this.rafId = requestAnimationFrame(this.loop.bind(this));
  }

  // Stop the loop and cancel any scheduled frame
  stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    // detach keyboard listeners when loop stops
    keyboard.stopListening();
  }

  // Subscribe to tick updates. Returns an unsubscribe function.
  onTick(cb: TickCallback) {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter((c) => c !== cb);
    };
  }

  // Reset the internal state (used for restart)
  reset(state: GameState) {
    this.state = state;
    // spawn initial dot if needed
    if (!this.state.dots || this.state.dots.length === 0) {
      this.state.dots = [Dot.spawnRandom(makeId(), { width: this.config.width, height: this.config.height }, this.state.player as any, 8)];
    }
  }

  // Internal loop invoked by rAF
  private loop(now: number) {
    if (!this.running) return;
    const dtMs = now - this.lastTime;
    this.lastTime = now;

    // Convert to seconds for update steps
    const dt = Math.max(0, dtMs) / 1000;

    // Timer countdown: only decrement while running (not paused)
    if (this.state.status === 'running') {
      this.state.timeLeft = Math.max(0, this.state.timeLeft - dt);
      if (this.state.timeLeft <= 0) {
        this.state.status = 'gameOver';
      }
    }

    // Movement update: read keyboard state and update player position.
    // Only apply movement while actively running
    if (this.state.status === 'running') {
      try {
        const input: InputState = keyboard.getState();
        // bounds of playable area come from config
        const bounds = { width: this.config.width, height: this.config.height };
        // update player in-place; Player.updateFromInput handles normalization & clamping
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - we treat this.state.player as having updateFromInput (Player instance)
        if (typeof (this.state.player as any).updateFromInput === 'function') {
          (this.state.player as any).updateFromInput(input, dt, bounds);
        } else {
          // Fallback: mutate position conservatively if player is plain object
          let dx = 0;
          let dy = 0;
          if (input.left) dx -= 1;
          if (input.right) dx += 1;
          if (input.up) dy -= 1;
          if (input.down) dy += 1;
          const len = Math.hypot(dx, dy);
          const nx = len > 0 ? dx / len : 0;
          const ny = len > 0 ? dy / len : 0;
          const vx = nx * this.state.player.speed;
          const vy = ny * this.state.player.speed;
          this.state.player.x += vx * dt;
          this.state.player.y += vy * dt;
          const halfW = this.state.player.width / 2;
          const halfH = this.state.player.height / 2;
          this.state.player.x = Math.min(Math.max(this.state.player.x, halfW), Math.max(halfW, this.config.width - halfW));
          this.state.player.y = Math.min(Math.max(this.state.player.y, halfH), Math.max(halfH, this.config.height - halfH));
        }
      } catch (err) {
        // don't crash the loop for keyboard errors
      }
    }

    // Emit snapshot to subscribers (subscribers should treat snapshot as read-only)
    // Collection detection: check player vs dots (only when running)
    if (this.state.status === 'running' && this.state.dots && this.state.dots.length) {
      for (let i = this.state.dots.length - 1; i >= 0; i--) {
        const dot = this.state.dots[i];
        if (rectCircleCollision(this.state.player as any, dot)) {
          // collect
          this.state.dots.splice(i, 1);
          this.state.score += dot.value || 1;
          // spawn particle effect
          const p: ParticleState = { id: makeId(), x: dot.x, y: dot.y, r: 4, alpha: 1, ttl: 0.5 };
          if (!this.state['particles']) (this.state as any).particles = [];
          (this.state as any).particles.push(p);
          // spawn a new dot immediately
          const newDot = Dot.spawnRandom(makeId(), { width: this.config.width, height: this.config.height }, this.state.player as any, dot.radius);
          this.state.dots.push(newDot);
        }
      }
    }

    // Update particles (simple fade & grow), remove expired
    if ((this.state as any).particles) {
      const particles = (this.state as any).particles as ParticleState[];
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.ttl -= dt;
        pt.alpha = Math.max(0, pt.ttl / 0.5);
        pt.r += 16 * dt; // expand quickly
        if (pt.ttl <= 0) particles.splice(i, 1);
      }
    }

    const snapshot = this.state;
    for (const cb of this.subscribers) cb(snapshot);

    // Schedule next frame
    this.rafId = requestAnimationFrame(this.loop.bind(this));
  }
}

export default GameLoop;
