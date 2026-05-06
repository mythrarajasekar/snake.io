import React from 'react';

type Props = {
  score: number;
  dotsCollected?: number;
  highScore?: number;
};

const ScoreBoard: React.FC<Props> = ({ score, dotsCollected, highScore }) => {
  return (
    <div className="dcg-scoreboard" aria-live="polite">
      <div className="dcg-score-label">Score</div>
      <div className="dcg-score-value">{score}</div>
      {typeof dotsCollected === 'number' && (
        <div className="dcg-highscore" style={{ marginTop: 6 }}>
          Dots: <strong>{dotsCollected}</strong>
        </div>
      )}
      {typeof highScore === 'number' && highScore > 0 && (
        <div className="dcg-highscore">
          Best: <strong>{highScore}</strong>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
