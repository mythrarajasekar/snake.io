// Responsibility: TypeScript interfaces and types used across the Dot Collector module.

export type GameStatus = 'idle' | 'running' | 'paused' | 'gameOver';

export interface PlayerState {
  x: number; // center X coordinate
  y: number; // center Y coordinate
  width: number;
  height: number;
  speed: number; // pixels per second
  vx?: number; // current velocity X (pixels/sec)
  vy?: number; // current velocity Y (pixels/sec)
}

export interface DotState {
  id: string;
  x: number;
  y: number;
  radius: number;
  value: number;
}

export interface ParticleState {
  id: string;
  x: number;
  y: number;
  r: number;
  alpha: number;
  ttl: number; // seconds remaining
}

export interface GameState {
  player: PlayerState;
  dots: DotState[];
  particles?: ParticleState[];
  score: number;
  timeLeft: number; // seconds remaining
  status: GameStatus;
}

export interface GameConfig {
  width: number;
  height: number;
  durationSeconds: number;
  maxDots?: number;
  spawnIntervalMs?: number;
}

export type TickCallback = (state: GameState) => void;

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

