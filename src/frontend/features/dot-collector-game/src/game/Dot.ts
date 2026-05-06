import { DotState, PlayerState, DotType } from '../types/game.types';
import { randomBetween } from '../utils/helpers';
import { DOT_SPAWN_MAX_ATTEMPTS, DOT_TYPE_CONFIG } from '../constants/game.constants';

function pickDotType(): DotType {
  const rand = Math.random();
  let cumulative = 0;
  for (const [type, cfg] of Object.entries(DOT_TYPE_CONFIG)) {
    cumulative += cfg.weight;
    if (rand < cumulative) return type as DotType;
  }
  return 'common';
}

export class Dot implements DotState {
  id: string;
  x: number;
  y: number;
  radius: number;
  value: number;
  dotType: DotType;

  constructor(id: string, x: number, y: number, dotType: DotType = 'common') {
    const cfg = DOT_TYPE_CONFIG[dotType];
    this.id = id;
    this.x = x;
    this.y = y;
    this.dotType = dotType;
    this.radius = cfg.radius;
    this.value = cfg.value;
  }

  static spawnRandom(
    id: string,
    bounds: { width: number; height: number },
    player?: PlayerState,
  ): Dot {
    const dotType = pickDotType();
    const radius = DOT_TYPE_CONFIG[dotType].radius;

    for (let i = 0; i < DOT_SPAWN_MAX_ATTEMPTS; i++) {
      const x = randomBetween(radius, Math.max(radius, bounds.width - radius));
      const y = randomBetween(radius, Math.max(radius, bounds.height - radius));
      if (player) {
        const halfW = player.width / 2 + radius + 2;
        const halfH = player.height / 2 + radius + 2;
        if (x > player.x - halfW && x < player.x + halfW && y > player.y - halfH && y < player.y + halfH) {
          continue;
        }
      }
      return new Dot(id, x, y, dotType);
    }
    return new Dot(id, bounds.width / 2, bounds.height / 2, dotType);
  }
}

export default Dot;
