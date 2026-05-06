import React from 'react';
import { Achievement } from '../services/AchievementEngine';

type Props = {
  finalScore: number;
  dotsCollected?: number;
  onRestart: () => void;
  timeLimit?: number;
  newHighScore?: boolean;
  unlockedAchievements?: Achievement[];
};

const GameOver: React.FC<Props> = ({
  finalScore,
  dotsCollected,
  onRestart,
  timeLimit = 60,
  newHighScore = false,
  unlockedAchievements = [],
}) => {
  return (
    <div className="dcg-gameover-overlay">
      <div className="dcg-gameover">
        <h2>Game Over!</h2>

        {newHighScore && (
          <div className="dcg-new-highscore" aria-live="polite">
            🏆 New High Score!
          </div>
        )}

        <div className="dcg-final-score">
          <p className="dcg-score-label">Final Score</p>
          <p className="dcg-score-value">{finalScore}</p>
        </div>

        <p className="dcg-game-summary">
          {typeof dotsCollected === 'number'
            ? `Collected ${dotsCollected} dot${dotsCollected !== 1 ? 's' : ''} in ${timeLimit}s`
            : `You scored ${finalScore} in ${timeLimit} seconds!`}
        </p>

        {unlockedAchievements.length > 0 && (
          <div className="dcg-achievements-unlocked" aria-live="polite">
            <p className="dcg-score-label" style={{ marginBottom: 6 }}>Achievements Unlocked</p>
            {unlockedAchievements.map((a) => (
              <div key={a.id} className="dcg-achievement-badge">
                <span>{a.icon}</span>
                <span><strong>{a.title}</strong> — {a.description}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={onRestart} className="dcg-restart-btn" aria-label="Restart the game">
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;
