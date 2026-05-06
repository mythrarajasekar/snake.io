import React from 'react';

// Responsibility: Render the initial start screen with instructions and play button.
// Provides a polished first impression before gameplay begins.

type Props = {
  onPlay: () => void;
  highScore?: number;
};

const StartScreen: React.FC<Props> = ({ onPlay, highScore }) => {
  return (
    <div className="dcg-start-screen-overlay">
      <div className="dcg-start-screen">
        <div className="dcg-start-header">
          <h1 className="dcg-title">Dot Collector</h1>
          <p className="dcg-subtitle">Collect as many dots as you can!</p>
        </div>

        <div className="dcg-instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Use <strong>Arrow Keys</strong> or <strong>WASD</strong> to move</li>
            <li>Collect the <span className="dcg-dot-demo">●</span> dots to score points</li>
            <li>You have <strong>60 seconds</strong> to collect as many as possible</li>
            <li>Each dot collected = <strong>1 point</strong></li>
          </ul>
        </div>

        {typeof highScore === 'number' && highScore > 0 && (
          <div className="dcg-high-score-display">
            <p>Your Best: <strong>{highScore}</strong> dots</p>
          </div>
        )}

        <button onClick={onPlay} className="dcg-play-btn" aria-label="Start playing Dot Collector">
          <span className="dcg-play-btn-text">Play</span>
          <span className="dcg-play-btn-icon">▶</span>
        </button>

        <p className="dcg-start-footer">Master the game and beat your high score!</p>
      </div>
    </div>
  );
};

export default StartScreen;
