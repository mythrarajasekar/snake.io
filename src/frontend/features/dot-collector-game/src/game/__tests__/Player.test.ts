import { Player } from '../Player';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT } from '../../constants/game.constants';

describe('Player', () => {
  it('creates player with correct dimensions', () => {
    const player = new Player(100, 100);
    expect(player.x).toBe(100);
    expect(player.y).toBe(100);
    expect(player.width).toBe(PLAYER_WIDTH);
    expect(player.height).toBe(PLAYER_HEIGHT);
    expect(player.lives).toBe(3);
  });

  it('creates centered player', () => {
    const player = Player.centered(CANVAS_WIDTH, CANVAS_HEIGHT);
    expect(player.x).toBe(CANVAS_WIDTH / 2);
    expect(player.y).toBe(CANVAS_HEIGHT / 2);
  });

  it('updates position based on input', () => {
    const player = new Player(100, 100);
    const initialX = player.x;
    player.updateFromInput({ up: false, down: false, left: false, right: true }, 0.016, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    expect(player.x).toBeGreaterThan(initialX);
  });

  it('respects canvas boundaries', () => {
    const player = new Player(10, 100);
    player.updateFromInput({ up: false, down: false, left: true, right: false }, 0.016, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    expect(player.x).toBeGreaterThanOrEqual(PLAYER_WIDTH / 2);
  });
});
