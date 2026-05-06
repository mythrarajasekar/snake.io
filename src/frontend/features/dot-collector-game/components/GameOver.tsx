import React from 'react';

// Responsibility: Show final game results, score, and provide a restart control.
// Appears as an overlay when the game reaches gameOver state.
type Props = {
  finalScore: number;
  onRestart: () => void;
  timeLimit?: number;
};

const GameOver: React.FC<Props> = ({ finalScore, onRestart, timeLimit = 60 }) => {
  return (
    <div className="dcg-gameover-overlay">
      <div className="dcg-gameover">
        <h2>Game Over!</h2>
        <div className="dcg-final-score">
          <p className="dcg-score-label">Final Score</p>
          <p className="dcg-score-value">{finalScore}</p>
        </div>
        <p className="dcg-game-summary">You collected {finalScore} dot{finalScore !== 1 ? 's' : ''} in {timeLimit} seconds!</p>
        <button onClick={onRestart} className="dcg-restart-btn" aria-label="Restart the game">
          Restart Game
        </button>
      </div>
    </div>
  );
};

export default GameOver;
