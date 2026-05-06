export type GameStatus = 'idle' | 'running' | 'paused' | 'gameOver';

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  vx?: number;
  vy?: number;
  // tail segments for classic snake behavior (ordered from head->tail)
  segments?: { x: number; y: number }[];
  // desired tail length (number of segments)
  tailLength?: number;
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
  ttl: number;
}

export interface GameState {
  player: PlayerState;
  dots: DotState[];
  particles?: ParticleState[];
  score: number;
  timeLeft: number;
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
