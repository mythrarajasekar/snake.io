export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const GAME_DURATION_SECONDS = 60;

export const PLAYER_WIDTH = 32;
export const PLAYER_HEIGHT = 32;
export const PLAYER_SPEED = 240;
export const PLAYER_FOLLOW_STRENGTH_FACTOR = 14;
export const SEGMENTS_PER_DOT = 1;

export const DOT_RADIUS = 8;
export const DOT_SPAWN_MAX_ATTEMPTS = 12;

export const PARTICLE_TTL = 0.5;
export const PARTICLE_INITIAL_RADIUS = 4;
export const PARTICLE_GROW_RATE = 16;

export const RENDER_FPS = 30;
export const RENDER_INTERVAL_MS = 1000 / RENDER_FPS;

// Difficulty — base speeds (px/s)
export const DIFFICULTY_SPEED: Record<string, number> = {
  easy: 160,
  medium: 240,
  hard: 340,
};

// Speed scaling: units of px/s gained per second of play
export const DIFFICULTY_SPEED_SCALE: Record<string, number> = {
  easy: 4,
  medium: 8,
  hard: 14,
};

// Max speed cap (px/s)
export const PLAYER_MAX_SPEED = 600;

// Obstacle constants
export const OBSTACLE_SIZE = 40;
export const OBSTACLE_COUNT: Record<string, number> = {
  easy: 2,
  medium: 4,
  hard: 6,
};
export const OBSTACLE_SPAWN_MAX_ATTEMPTS = 20;

// Respawn invincibility duration (seconds)
export const RESPAWN_INVINCIBLE_DURATION = 2;

// Dot types: [radius, value, spawnWeight]
export const DOT_TYPE_CONFIG: Record<string, { radius: number; value: number; weight: number; color: string }> = {
  common: { radius: 8,  value: 1, weight: 0.70, color: '#ff4757' },
  rare:   { radius: 10, value: 3, weight: 0.22, color: '#a78bfa' },
  bonus:  { radius: 13, value: 5, weight: 0.08, color: '#fbbf24' },
};

// Score popup particle lifetime (seconds)
export const SCORE_POPUP_TTL = 1.2;
