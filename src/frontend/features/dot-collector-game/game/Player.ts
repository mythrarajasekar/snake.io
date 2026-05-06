import { PlayerState } from '../types/game.types';

// Responsibility: Player model and helper constructors. For Unit 1 the player
// is a simple data holder used by rendering and the game loop.
export class Player implements PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  vx?: number;
  vy?: number;

  constructor(x = 0, y = 0, width = 32, height = 32, speed = 200) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.vx = 0;
    this.vy = 0;
  }

  // Helper to center the player in a canvas of given size
  static centered(canvasWidth: number, canvasHeight: number) {
    return new Player(canvasWidth / 2, canvasHeight / 2);
  }

  // Update player velocity & position from input. Uses normalized vector so
  // diagonal movement speed matches cardinal movement speed.
  updateFromInput(input: import('../types/game.types').InputState, dt: number, bounds: { width: number; height: number }) {
    // build direction vector
    let dx = 0;
    let dy = 0;
    if (input.left) dx -= 1;
    if (input.right) dx += 1;
    if (input.up) dy -= 1;
    if (input.down) dy += 1;

    // normalize if necessary
    const len = Math.hypot(dx, dy);
    const nx = len > 0 ? dx / len : 0;
    const ny = len > 0 ? dy / len : 0;

    // set velocities (pixels per second)
    this.vx = nx * this.speed;
    this.vy = ny * this.speed;

    // integrate position
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // clamp to bounds (keep player fully visible)
    const halfW = this.width / 2;
    const halfH = this.height / 2;
    this.x = Math.min(Math.max(this.x, halfW), Math.max(halfW, bounds.width - halfW));
    this.y = Math.min(Math.max(this.y, halfH), Math.max(halfH, bounds.height - halfH));
  }
}

export default Player;
