import React, { useCallback, useState, useEffect } from 'react';
import GameCanvas from '../components/GameCanvas';
import ScoreBoard from '../components/ScoreBoard';
import Timer from '../components/Timer';
import GameOver from '../components/GameOver';
import StartScreen from '../components/StartScreen';
import '../styles/game.css';
import { GameState, GameConfig, GameStatus } from '../types/game.types';
import useGameLoop from '../hooks/useGameLoop';

// Responsibility: Page-level composition for the Dot Collector feature.
// Manages game lifecycle (idle, running, gameOver), handles start/restart,
// and wires up UI components. Keeps the module isolated from backend.

const DEFAULT_GAME_CONFIG: GameConfig = {
  width: 800,
  height: 600,
  durationSeconds: 60,
};

function createInitialState(): GameState {
  return {
    player: { x: DEFAULT_GAME_CONFIG.width / 2, y: DEFAULT_GAME_CONFIG.height / 2, width: 32, height: 32, speed: 240 },
    dots: [],
    particles: [],
    score: 0,
    timeLeft: DEFAULT_GAME_CONFIG.durationSeconds,
    status: 'idle',
  };
}

export const DotCollectorPage: React.FC = () => {
  const [displayState, setDisplayState] = useState<GameState>(createInitialState());
  const { gameState, start, stop, loop } = useGameLoop(createInitialState(), DEFAULT_GAME_CONFIG);

  // Sync internal display state from loop state on updates
  useEffect(() => {
    setDisplayState(gameState);
  }, [gameState]);

  const handleStart = useCallback(() => {
    // Reset state and transition to running
    const fresh = createInitialState();
    fresh.status = 'running';
    loop.reset(fresh);
    setDisplayState(fresh);
    start();
  }, [start, loop]);

  const handleRestart = useCallback(() => {
    // Full restart: stop loop, reset state, then start again
    stop();
    const fresh = createInitialState();
    fresh.status = 'running';
    loop.reset(fresh);
    setDisplayState(fresh);
    start();
  }, [start, stop, loop]);

  const isGameOver = displayState.status === 'gameOver';
  const isRunning = displayState.status === 'running';
  const isIdle = displayState.status === 'idle';

  return (
    <div className="dcg-page">
      {isIdle && <StartScreen onPlay={handleStart} highScore={0} />}
      <div className="dcg-container">
        <div className="dcg-game-area">
          <div className="dcg-controls">
            <button onClick={handleStart} disabled={isRunning} className="dcg-btn dcg-btn-primary" aria-pressed={isRunning}>
              {isGameOver ? 'Play Again' : 'Start Game'}
            </button>
            {isRunning && (
              <button onClick={stop} className="dcg-btn dcg-btn-secondary">
                Pause
              </button>
            )}
          </div>
          <div className="dcg-canvas-wrapper">
            <GameCanvas loop={loop} config={DEFAULT_GAME_CONFIG} />
          </div>
        </div>

        <aside className="dcg-sidebar">
          <div className="dcg-hud-card">
            <ScoreBoard score={displayState.score} />
          </div>
          <div className="dcg-hud-card">
            <Timer seconds={displayState.timeLeft} />
          </div>
          {isGameOver && (
            <div className="dcg-hud-card">
              <GameOver finalScore={displayState.score} onRestart={handleRestart} timeLimit={DEFAULT_GAME_CONFIG.durationSeconds} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default DotCollectorPage;
