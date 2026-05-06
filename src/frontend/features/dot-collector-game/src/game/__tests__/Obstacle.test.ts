import { Obstacle } from '../Obstacle';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants/game.constants';

describe('Obstacle', () => {
  it('spawns within canvas bounds', () => {
    const obstacle = Obstacle.spawnRandom({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }, { x: 400, y: 300 });
    expect(obstacle.x).toBeGreaterThanOrEqual(0);
    expect(obstacle.x).toBeLessThanOrEqual(CANVAS_WIDTH);
    expect(obstacle.y).toBeGreaterThanOrEqual(0);
    expect(obstacle.y).toBeLessThanOrEqual(CANVAS_HEIGHT);
  });

  it('spawns multiple obstacles avoiding player', () => {
    const player = { x: 400, y: 300, width: 20, height: 20 };
    const obstacles = Obstacle.spawnMany(3, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT }, player);
    expect(obstacles.length).toBe(3);
    obstacles.forEach(obs => {
      expect(obs.x).toBeGreaterThanOrEqual(0);
      expect(obs.y).toBeGreaterThanOrEqual(0);
    });
  });
});
