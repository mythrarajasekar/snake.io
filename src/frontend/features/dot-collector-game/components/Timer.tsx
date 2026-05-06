import React from 'react';

// Responsibility: Display elapsed or remaining time for the game with visual
// warning when time is running low.
type Props = {
  seconds: number;
  isLow?: boolean;
};

const Timer: React.FC<Props> = ({ seconds, isLow = seconds < 10 && seconds > 0 }) => {
  const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
  const ss = Math.floor(seconds % 60).toString().padStart(2, '0');
  return (
    <div className={`dcg-timer ${isLow ? 'dcg-timer-low' : ''}`} aria-live="polite">
      <div className="dcg-timer-label">Time Remaining</div>
      <div className="dcg-timer-display">
        {mm}:{ss}
      </div>
    </div>
  );
};

export default Timer;
