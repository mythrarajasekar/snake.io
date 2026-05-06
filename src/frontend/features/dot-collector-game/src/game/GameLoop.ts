import { GameState, GameConfig, TickCallback, InputState, DotState, ParticleState } from '../types/game.types';
import { keyboard } from '../utils/keyboard';
import Dot from './Dot';
import { rectCircleCollision } from './Collision';

let __idCounter = 0;
function makeId() {
  __idCounter += 1;
  return `id_${Date.now()}_${__idCounter}`;
}

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

    if (!this.state.dots || this.state.dots.length === 0) {
      const d = Dot.spawnRandom(makeId(), { width: this.config.width, height: this.config.height }, this.state.player as any, 8);
      this.state.dots = [d];
      // debug
      // eslint-disable-next-line no-console
      console.log('[GameLoop] spawned initial dot', d);
    }

    // Ensure there is always at least one dot on the field while the timer hasn't expired.
    try {
      if ((this.state.dots === undefined || this.state.dots.length === 0) && this.state.timeLeft > 0) {
        const d = Dot.spawnRandom(makeId(), { width: this.config.width, height: this.config.height }, this.state.player as any, 8);
        this.state.dots = [d];
        // eslint-disable-next-line no-console
        console.log('[GameLoop] fallback spawned dot to keep food visible', d);
      }
    } catch (e) {}
  }

  // tail behavior: each collected dot increases tail length by this many segments
  private readonly SEGMENTS_PER_DOT = 1;

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    keyboard.startListening();
    this.rafId = requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    keyboard.stopListening();
  }

  onTick(cb: TickCallback) {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter((c) => c !== cb);
    };
  }

  reset(state: GameState) {
    this.state = state;
    if (!this.state.dots || this.state.dots.length === 0) {
      this.state.dots = [Dot.spawnRandom(makeId(), { width: this.config.width, height: this.config.height }, this.state.player as any, 8)];
    }
  }

  private loop(now: number) {
    if (!this.running) return;
    const dtMs = now - this.lastTime;
    this.lastTime = now;

    const dt = Math.max(0, dtMs) / 1000;

    if (this.state.status === 'running') {
      this.state.timeLeft = Math.max(0, this.state.timeLeft - dt);
      if (this.state.timeLeft <= 0) {
        this.state.status = 'gameOver';
      }
    }

    if (this.state.status === 'running') {
      try {
        const input: InputState = keyboard.getState();
        const bounds = { width: this.config.width, height: this.config.height };
        if (typeof (this.state.player as any).updateFromInput === 'function') {
          (this.state.player as any).updateFromInput(input, dt, bounds);
        } else {
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
      } catch (err) {}
    }

    if (this.state.status === 'running' && this.state.dots && this.state.dots.length) {
      for (let i = this.state.dots.length - 1; i >= 0; i--) {
        const dot = this.state.dots[i];
        if (rectCircleCollision(this.state.player as any, dot)) {
          this.state.dots.splice(i, 1);
          this.state.score += dot.value || 1;
          // add tail segments instead of growing the player's size
          try {
            const value = dot.value || 1;
            const add = Math.max(1, Math.round(this.SEGMENTS_PER_DOT * value));
            this.state.player.tailLength = (this.state.player.tailLength || 0) + add;
            if (!this.state.player.segments) this.state.player.segments = [];
            while (this.state.player.segments.length < (this.state.player.tailLength || 0)) {
              this.state.player.segments.push({ x: this.state.player.x, y: this.state.player.y });
            }
          } catch (e) {}
          const p: ParticleState = { id: makeId(), x: dot.x, y: dot.y, r: 4, alpha: 1, ttl: 0.5 };
          if (!this.state['particles']) (this.state as any).particles = [];
          (this.state as any).particles.push(p);
              const newDot = Dot.spawnRandom(makeId(), { width: this.config.width, height: this.config.height }, this.state.player as any, dot.radius);
              this.state.dots.push(newDot);
              // debug
              // eslint-disable-next-line no-console
              console.log('[GameLoop] collected dot, spawned new dot', newDot, 'dotsCount=', this.state.dots.length);
        }
      }
    }

    if ((this.state as any).particles) {
      const particles = (this.state as any).particles as ParticleState[];
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.ttl -= dt;
        pt.alpha = Math.max(0, pt.ttl / 0.5);
        pt.r += 16 * dt;
        if (pt.ttl <= 0) particles.splice(i, 1);
      }
    }

    const snapshot = this.state;
    for (const cb of this.subscribers) cb(snapshot);

    this.rafId = requestAnimationFrame(this.loop.bind(this));
  }
}

export default GameLoop;
