import React from 'react';
import { GameState } from '../types/game.types';

type Props = {
  score: number;
  highScore?: number;
};

const ScoreBoard: React.FC<Props> = ({ score, highScore }) => {
  return (
    <div className="dcg-scoreboard" aria-live="polite">
      <div className="dcg-score-label">Current Score</div>
      <div className="dcg-score-value">{score}</div>
      {typeof highScore === 'number' && highScore > 0 && (
        <div className="dcg-highscore">
          <strong>Best:</strong> {highScore}
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
