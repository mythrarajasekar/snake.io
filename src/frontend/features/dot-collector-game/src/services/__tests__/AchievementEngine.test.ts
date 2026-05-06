import { checkAchievements } from '../AchievementEngine';
import { GameResult } from '../AchievementEngine';
import StorageService from '../StorageService';

describe('AchievementEngine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('unlocks first_dot achievement', () => {
    const result: GameResult = { score: 1, dotsCollected: 1, timeSurvived: 10, collectedRare: false, collectedBonus: false };
    const unlocked = checkAchievements(result, 1);
    expect(unlocked.some(a => a.id === 'first_dot')).toBe(true);
  });

  it('unlocks century achievement for 100+ score', () => {
    const result: GameResult = { score: 100, dotsCollected: 100, timeSurvived: 60, collectedRare: false, collectedBonus: false };
    const unlocked = checkAchievements(result, 1);
    expect(unlocked.some(a => a.id === 'score_100')).toBe(true);
  });

  it('unlocks rare_dot for collecting rare', () => {
    const result: GameResult = { score: 50, dotsCollected: 10, timeSurvived: 30, collectedRare: true, collectedBonus: false };
    const unlocked = checkAchievements(result, 1);
    expect(unlocked.some(a => a.id === 'rare_dot')).toBe(true);
  });

  it('returns empty array when no achievements met', () => {
    const result: GameResult = { score: 0, dotsCollected: 0, timeSurvived: 5, collectedRare: false, collectedBonus: false };
    const unlocked = checkAchievements(result, 0);
    expect(unlocked.length).toBe(0);
  });
});
