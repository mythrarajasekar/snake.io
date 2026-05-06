import React, { useCallback } from 'react';
import { keyboard } from '../utils/keyboard';

type Props = {
  visible: boolean;
};

const TouchControls: React.FC<Props> = ({ visible }) => {
  const handlePress = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    keyboard.setDirection(dir, true);
  }, []);

  const handleRelease = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    keyboard.setDirection(dir, false);
  }, []);

  if (!visible) return null;

  return (
    <div className="dcg-touch-controls" aria-label="Touch controls">
      <button
        className="dcg-touch-btn dcg-touch-up"
        onTouchStart={() => handlePress('up')}
        onTouchEnd={() => handleRelease('up')}
        onMouseDown={() => handlePress('up')}
        onMouseUp={() => handleRelease('up')}
        onMouseLeave={() => handleRelease('up')}
        aria-label="Move up"
      >
        ▲
      </button>
      <button
        className="dcg-touch-btn dcg-touch-left"
        onTouchStart={() => handlePress('left')}
        onTouchEnd={() => handleRelease('left')}
        onMouseDown={() => handlePress('left')}
        onMouseUp={() => handleRelease('left')}
        onMouseLeave={() => handleRelease('left')}
        aria-label="Move left"
      >
        ◀
      </button>
      <button
        className="dcg-touch-btn dcg-touch-right"
        onTouchStart={() => handlePress('right')}
        onTouchEnd={() => handleRelease('right')}
        onMouseDown={() => handlePress('right')}
        onMouseUp={() => handleRelease('right')}
        onMouseLeave={() => handleRelease('right')}
        aria-label="Move right"
      >
        ▶
      </button>
      <button
        className="dcg-touch-btn dcg-touch-down"
        onTouchStart={() => handlePress('down')}
        onTouchEnd={() => handleRelease('down')}
        onMouseDown={() => handlePress('down')}
        onMouseUp={() => handleRelease('down')}
        onMouseLeave={() => handleRelease('down')}
        aria-label="Move down"
      >
        ▼
      </button>
    </div>
  );
};

export default TouchControls;
