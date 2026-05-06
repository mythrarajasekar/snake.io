import { PlayerState, DotState, ObstacleState } from '../types/game.types';

function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}

export function rectCircleCollision(player: PlayerState, dot: DotState): boolean {
  const rx = player.x - player.width / 2;
  const ry = player.y - player.height / 2;

  const closestX = clamp(dot.x, rx, rx + player.width);
  const closestY = clamp(dot.y, ry, ry + player.height);

  const dx = dot.x - closestX;
  const dy = dot.y - closestY;
  return dx * dx + dy * dy <= dot.radius * dot.radius;
}

export function rectRectCollision(player: PlayerState, obstacle: ObstacleState): boolean {
  const px = player.x - player.width / 2;
  const py = player.y - player.height / 2;
  return (
    px < obstacle.x + obstacle.width &&
    px + player.width > obstacle.x &&
    py < obstacle.y + obstacle.height &&
    py + player.height > obstacle.y
  );
}

export function circleCollision(
  ax: number, ay: number, ar: number,
  bx: number, by: number, br: number,
): boolean {
  const dx = ax - bx;
  const dy = ay - by;
  const r = ar + br;
  return dx * dx + dy * dy <= r * r;
}

export default { rectCircleCollision, rectRectCollision, circleCollision };
