import React from 'react';

type Props = {
  onClose: () => void;
};

const Tutorial: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="dcg-tutorial-overlay">
      <div className="dcg-tutorial">
        <h2>🎮 How to Play</h2>
        <div className="dcg-tutorial-content">
          <p><strong>Objective:</strong> Collect as many dots as possible before time runs out!</p>
          <ul>
            <li><strong>Move:</strong> Use Arrow Keys or WASD (or touch controls on mobile)</li>
            <li><strong>Dots:</strong> Red = 1pt, Purple = 3pts, Gold = 5pts</li>
            <li><strong>Lives:</strong> You have 3 lives — avoid red obstacles!</li>
            <li><strong>Speed:</strong> Your snake speeds up gradually over time</li>
            <li><strong>Difficulty:</strong> Choose Easy, Medium, or Hard before starting</li>
          </ul>
          <p><strong>Tip:</strong> Collect rare and bonus dots for higher scores and achievements!</p>
        </div>
        <button onClick={onClose} className="dcg-tutorial-close">
          Got it! Let's Play
        </button>
      </div>
    </div>
  );
};

export default Tutorial;
