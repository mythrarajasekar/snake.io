import { ObstacleState, PlayerState } from '../types/game.types';
import { OBSTACLE_SIZE, OBSTACLE_SPAWN_MAX_ATTEMPTS } from '../constants/game.constants';

let __obstacleCounter = 0;
function makeObstacleId(): string {
  __obstacleCounter += 1;
  return `obs_${Date.now()}_${__obstacleCounter}`;
}

export class Obstacle implements ObstacleState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(id: string, x: number, y: number, width = OBSTACLE_SIZE, height = OBSTACLE_SIZE) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  static spawnRandom(
    bounds: { width: number; height: number },
    player: PlayerState,
    existing: ObstacleState[] = [],
  ): Obstacle {
    const w = OBSTACLE_SIZE;
    const h = OBSTACLE_SIZE;
    const margin = 80; // keep away from player spawn area

    for (let i = 0; i < OBSTACLE_SPAWN_MAX_ATTEMPTS; i++) {
      const x = Math.random() * (bounds.width - w);
      const y = Math.random() * (bounds.height - h);

      // avoid player
      const tooCloseToPlayer =
        Math.abs(x + w / 2 - player.x) < margin && Math.abs(y + h / 2 - player.y) < margin;
      if (tooCloseToPlayer) continue;

      // avoid other obstacles
      const overlapsExisting = existing.some(
        (o) => x < o.x + o.width + 10 && x + w > o.x - 10 && y < o.y + o.height + 10 && y + h > o.y - 10,
      );
      if (overlapsExisting) continue;

      return new Obstacle(makeObstacleId(), x, y, w, h);
    }

    // fallback: corner placement
    return new Obstacle(makeObstacleId(), 20, 20, w, h);
  }

  static spawnMany(
    count: number,
    bounds: { width: number; height: number },
    player: PlayerState,
  ): Obstacle[] {
    const obstacles: Obstacle[] = [];
    for (let i = 0; i < count; i++) {
      obstacles.push(Obstacle.spawnRandom(bounds, player, obstacles));
    }
    return obstacles;
  }
}

export default Obstacle;
