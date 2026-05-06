import { PlayerState, DotState } from '../types/game.types';

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

export function rectCircleCollision(player: PlayerState, dot: DotState): boolean {
  const rx = player.x - player.width / 2;
  const ry = player.y - player.height / 2;
  const rw = player.width;
  const rh = player.height;

  const closestX = clamp(dot.x, rx, rx + rw);
  const closestY = clamp(dot.y, ry, ry + rh);

  const dx = dot.x - closestX;
  const dy = dot.y - closestY;
  return dx * dx + dy * dy <= dot.radius * dot.radius;
}

export function circleCollision(ax: number, ay: number, ar: number, bx: number, by: number, br: number): boolean {
  const dx = ax - bx;
  const dy = ay - by;
  const r = ar + br;
  return dx * dx + dy * dy <= r * r;
}

export default { rectCircleCollision, circleCollision };
