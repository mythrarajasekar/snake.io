import { rectCircleCollision, rectRectCollision } from '../Collision';

describe('Collision', () => {
  describe('rectCircleCollision', () => {
    it('detects collision when circle overlaps rectangle', () => {
      const rect = { x: 100, y: 100, width: 50, height: 50 };
      const circle = { x: 125, y: 125, radius: 10 };
      expect(rectCircleCollision(rect, circle)).toBe(true);
    });

    it('returns false when circle is outside rectangle', () => {
      const rect = { x: 100, y: 100, width: 50, height: 50 };
      const circle = { x: 200, y: 200, radius: 10 };
      expect(rectCircleCollision(rect, circle)).toBe(false);
    });
  });

  describe('rectRectCollision', () => {
    it('detects collision when rectangles overlap', () => {
      const rect1 = { x: 100, y: 100, width: 50, height: 50 };
      const rect2 = { x: 120, y: 120, width: 50, height: 50 };
      expect(rectRectCollision(rect1, rect2)).toBe(true);
    });

    it('returns false when rectangles do not overlap', () => {
      const rect1 = { x: 100, y: 100, width: 50, height: 50 };
      const rect2 = { x: 200, y: 200, width: 50, height: 50 };
      expect(rectRectCollision(rect1, rect2)).toBe(false);
    });
  });
});
