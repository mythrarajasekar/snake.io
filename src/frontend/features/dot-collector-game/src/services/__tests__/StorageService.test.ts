import { StorageService } from '../StorageService';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default stats when no data exists', () => {
    const stats = StorageService.getStats();
    expect(stats.highScore).toBe(0);
    expect(stats.totalDotsCollected).toBe(0);
    expect(stats.totalGamesPlayed).toBe(0);
  });

  it('saves and retrieves game result', () => {
    StorageService.saveGameResult(100, 50, 60);
    const stats = StorageService.getStats();
    expect(stats.highScore).toBe(100);
    expect(stats.totalDotsCollected).toBe(50);
    expect(stats.totalGamesPlayed).toBe(1);
  });

  it('updates high score only when exceeded', () => {
    StorageService.saveGameResult(100, 50, 60);
    StorageService.saveGameResult(50, 25, 30);
    const stats = StorageService.getStats();
    expect(stats.highScore).toBe(100);
    expect(stats.totalGamesPlayed).toBe(2);
  });

  it('unlocks achievements', () => {
    StorageService.unlockAchievement('first_dot');
    expect(StorageService.hasAchievement('first_dot')).toBe(true);
  });

  it('saves and retrieves settings', () => {
    StorageService.saveSetting('muted', true);
    const settings = StorageService.getSettings();
    expect(settings.muted).toBe(true);
  });
});
