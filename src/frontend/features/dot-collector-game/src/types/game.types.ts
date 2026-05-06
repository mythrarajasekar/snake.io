export type GameStatus = 'idle' | 'running' | 'paused' | 'gameOver';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type DotType = 'common' | 'rare' | 'bonus';

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  lives: number;
  vx?: number;
  vy?: number;
  segments?: { x: number; y: number }[];
  tailLength?: number;
}

export interface DotState {
  id: string;
  x: number;
  y: number;
  radius: number;
  value: number;
  dotType: DotType;
}

export interface ObstacleState {
  id: string;
  x: number;  // top-left
  y: number;  // top-left
  width: number;
  height: number;
}

export interface ParticleState {
  id: string;
  x: number;
  y: number;
  r: number;
  alpha: number;
  ttl: number;
}

export interface ScorePopup {
  id: string;
  x: number;
  y: number;
  value: number;
  alpha: number;
  ttl: number;
  elapsed: number;
}

export interface GameState {
  player: PlayerState;
  dots: DotState[];
  obstacles: ObstacleState[];
  particles: ParticleState[];
  scorePopups: ScorePopup[];
  score: number;
  dotsCollected: number;
  collectedRare: boolean;
  collectedBonus: boolean;
  timeLeft: number;
  status: GameStatus;
  difficulty: DifficultyLevel;
  speedMultiplier: number;
  invincibleUntil: number;
}

export interface GameConfig {
  width: number;
  height: number;
  durationSeconds: number;
  difficulty?: DifficultyLevel;
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
