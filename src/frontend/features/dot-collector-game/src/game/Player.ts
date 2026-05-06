import { PlayerState, InputState } from '../types/game.types';
import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  PLAYER_FOLLOW_STRENGTH_FACTOR,
} from '../constants/game.constants';

export class Player implements PlayerState {
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
  private dirX = 0;
  private dirY = 0;

  constructor(
    x = 0,
    y = 0,
    width = PLAYER_WIDTH,
    height = PLAYER_HEIGHT,
    speed = PLAYER_SPEED,
    lives = 3,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.lives = lives;
    this.vx = 0;
    this.vy = 0;
    this.segments = [];
    this.tailLength = 0;
  }

  static centered(canvasWidth: number, canvasHeight: number): Player {
    return new Player(canvasWidth / 2, canvasHeight / 2);
  }

  updateFromInput(input: InputState, dt: number, bounds: { width: number; height: number }): void {
    let dx = 0;
    let dy = 0;
    if (input.left) dx -= 1;
    if (input.right) dx += 1;
    if (input.up) dy -= 1;
    if (input.down) dy += 1;

    const len = Math.hypot(dx, dy);
    if (len > 0) {
      this.dirX = dx / len;
      this.dirY = dy / len;
    }

    this.vx = this.dirX * this.speed;
    this.vy = this.dirY * this.speed;

    const prevX = this.x;
    const prevY = this.y;

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (!this.segments) this.segments = [];
    const desired = Math.max(0, this.tailLength ?? 0);

    while (this.segments.length < desired) {
      this.segments.push({ x: prevX, y: prevY });
    }
    while (this.segments.length > desired) {
      this.segments.pop();
    }

    let leaderX = this.x;
    let leaderY = this.y;
    const followStrength = Math.min(1, dt * PLAYER_FOLLOW_STRENGTH_FACTOR);
    for (const seg of this.segments) {
      seg.x += (leaderX - seg.x) * followStrength;
      seg.y += (leaderY - seg.y) * followStrength;
      leaderX = seg.x;
      leaderY = seg.y;
    }

    const halfW = this.width / 2;
    const halfH = this.height / 2;
    this.x = Math.min(Math.max(this.x, halfW), Math.max(halfW, bounds.width - halfW));
    this.y = Math.min(Math.max(this.y, halfH), Math.max(halfH, bounds.height - halfH));
  }
}

export default Player;
