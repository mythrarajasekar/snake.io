import { Dot } from '../Dot';
import { DotType } from '../../types/game.types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, DOT_TYPE_CONFIG } from '../../constants/game.constants';

describe('Dot', () => {
  it('spawns within canvas bounds', () => {
    const dot = Dot.spawnRandom({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    expect(dot.x).toBeGreaterThanOrEqual(0);
    expect(dot.x).toBeLessThanOrEqual(CANVAS_WIDTH);
    expect(dot.y).toBeGreaterThanOrEqual(0);
    expect(dot.y).toBeLessThanOrEqual(CANVAS_HEIGHT);
  });

  it('assigns correct value based on type', () => {
    const commonDot = new Dot(100, 100, DotType.COMMON);
    expect(commonDot.value).toBe(DOT_TYPE_CONFIG[DotType.COMMON].value);
    
    const rareDot = new Dot(100, 100, DotType.RARE);
    expect(rareDot.value).toBe(DOT_TYPE_CONFIG[DotType.RARE].value);
    
    const bonusDot = new Dot(100, 100, DotType.BONUS);
    expect(bonusDot.value).toBe(DOT_TYPE_CONFIG[DotType.BONUS].value);
  });

  it('spawns different types with weighted probability', () => {
    const types = new Set<DotType>();
    for (let i = 0; i < 100; i++) {
      types.add(Dot.spawnRandom({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }).type);
    }
    expect(types.size).toBeGreaterThan(1);
  });
});
