import StorageService from './StorageService';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_dot',      title: 'First Bite',      description: 'Collect your first dot',              icon: '🟢' },
  { id: 'ten_dots',       title: 'Hungry',           description: 'Collect 10 dots in one game',         icon: '🔥' },
  { id: 'fifty_dots',     title: 'Insatiable',       description: 'Collect 50 dots in one game',         icon: '💥' },
  { id: 'score_10',       title: 'Getting Started',  description: 'Score 10 points in one game',         icon: '⭐' },
  { id: 'score_50',       title: 'High Roller',      description: 'Score 50 points in one game',         icon: '🌟' },
  { id: 'score_100',      title: 'Century',          description: 'Score 100 points in one game',        icon: '🏆' },
  { id: 'survive_30',     title: 'Survivor',         description: 'Survive 30 seconds',                  icon: '⏱️' },
  { id: 'survive_60',     title: 'Endurance',        description: 'Survive the full 60 seconds',         icon: '🎖️' },
  { id: 'rare_dot',       title: 'Purple Haze',      description: 'Collect a rare dot',                  icon: '💜' },
  { id: 'bonus_dot',      title: 'Golden Touch',     description: 'Collect a bonus dot',                 icon: '🌕' },
  { id: 'play_5',         title: 'Regular',          description: 'Play 5 games',                        icon: '🎮' },
  { id: 'play_10',        title: 'Dedicated',        description: 'Play 10 games',                       icon: '🎯' },
];

export interface GameResult {
  score: number;
  dotsCollected: number;
  timeSurvived: number;
  collectedRare: boolean;
  collectedBonus: boolean;
}

export function checkAchievements(result: GameResult, totalGamesPlayed: number): Achievement[] {
  const unlocked: Achievement[] = [];

  function tryUnlock(id: string): void {
    const achievement = ACHIEVEMENTS.find((a) => a.id === id);
    if (achievement && StorageService.unlockAchievement(id)) {
      unlocked.push(achievement);
    }
  }

  if (result.dotsCollected >= 1)  tryUnlock('first_dot');
  if (result.dotsCollected >= 10) tryUnlock('ten_dots');
  if (result.dotsCollected >= 50) tryUnlock('fifty_dots');
  if (result.score >= 10)         tryUnlock('score_10');
  if (result.score >= 50)         tryUnlock('score_50');
  if (result.score >= 100)        tryUnlock('score_100');
  if (result.timeSurvived >= 30)  tryUnlock('survive_30');
  if (result.timeSurvived >= 60)  tryUnlock('survive_60');
  if (result.collectedRare)       tryUnlock('rare_dot');
  if (result.collectedBonus)      tryUnlock('bonus_dot');
  if (totalGamesPlayed >= 5)      tryUnlock('play_5');
  if (totalGamesPlayed >= 10)     tryUnlock('play_10');

  return unlocked;
}

export default { ACHIEVEMENTS, checkAchievements };
