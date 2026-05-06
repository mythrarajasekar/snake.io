export interface PlayerStats {
  highScore: number;
  totalDotsCollected: number;
  totalGamesPlayed: number;
  bestTime: number; // seconds survived in endless, or fastest completion
}

export interface AchievementRecord {
  id: string;
  unlockedAt: number; // timestamp
}

export interface StoredData {
  stats: PlayerStats;
  achievements: AchievementRecord[];
  settings: {
    difficulty: string;
    muted: boolean;
    theme: string;
    tutorialSeen: boolean;
  };
}

const STORAGE_KEY = 'snake_io_data';

const DEFAULT_DATA: StoredData = {
  stats: {
    highScore: 0,
    totalDotsCollected: 0,
    totalGamesPlayed: 0,
    bestTime: 0,
  },
  achievements: [],
  settings: {
    difficulty: 'medium',
    muted: false,
    theme: 'classic',
    tutorialSeen: false,
  },
};

function load(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    return { ...structuredClone(DEFAULT_DATA), ...JSON.parse(raw) };
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

function save(data: StoredData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — silently ignore
  }
}

export const StorageService = {
  getStats(): PlayerStats {
    return load().stats;
  },

  getAchievements(): AchievementRecord[] {
    return load().achievements;
  },

  getSettings(): StoredData['settings'] {
    return load().settings;
  },

  saveGameResult(score: number, dotsCollected: number, timeSurvived: number): PlayerStats {
    const data = load();
    data.stats.totalGamesPlayed += 1;
    data.stats.totalDotsCollected += dotsCollected;
    if (score > data.stats.highScore) data.stats.highScore = score;
    if (timeSurvived > data.stats.bestTime) data.stats.bestTime = timeSurvived;
    save(data);
    return data.stats;
  },

  unlockAchievement(id: string): boolean {
    const data = load();
    if (data.achievements.some((a) => a.id === id)) return false;
    data.achievements.push({ id, unlockedAt: Date.now() });
    save(data);
    return true;
  },

  hasAchievement(id: string): boolean {
    return load().achievements.some((a) => a.id === id);
  },

  saveSetting<K extends keyof StoredData['settings']>(key: K, value: StoredData['settings'][K]): void {
    const data = load();
    data.settings[key] = value;
    save(data);
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};

export default StorageService;
