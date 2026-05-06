import { DotState, PlayerState } from '../types/game.types';
import { randomBetween } from '../utils/helpers';

export class Dot implements DotState {
  id: string;
  x: number;
  y: number;
  radius: number;
  value: number;

  constructor(id: string, x: number, y: number, radius = 8, value = 1) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.value = value;
  }

  static spawnRandom(id: string, bounds: { width: number; height: number }, player?: PlayerState, radius = 8): Dot {
    const maxAttempts = 12;
    for (let i = 0; i < maxAttempts; i++) {
      const x = randomBetween(radius, Math.max(radius, bounds.width - radius));
      const y = randomBetween(radius, Math.max(radius, bounds.height - radius));
      if (player) {
        const halfW = player.width / 2 + radius + 2;
        const halfH = player.height / 2 + radius + 2;
        if (x > player.x - halfW && x < player.x + halfW && y > player.y - halfH && y < player.y + halfH) {
          continue;
        }
      }
      return new Dot(id, x, y, radius, 1);
    }
    return new Dot(id, bounds.width / 2, bounds.height / 2, radius, 1);
  }
}

export default Dot;
