import React, { useCallback, useState, useEffect, useMemo } from 'react';
import GameCanvas from '../components/GameCanvas';
import ScoreBoard from '../components/ScoreBoard';
import Timer from '../components/Timer';
import GameOver from '../components/GameOver';
import StartScreen from '../components/StartScreen';
import '../styles/game.css';
import { GameState, GameConfig, GameStatus } from '../types/game.types';
import useGameLoop from '../hooks/useGameLoop';
import Player from '../game/Player';

const DEFAULT_GAME_CONFIG: GameConfig = {
  width: 800,
  height: 600,
  durationSeconds: 60,
};

function createInitialState(): GameState {
  return {
    player: new Player(DEFAULT_GAME_CONFIG.width / 2, DEFAULT_GAME_CONFIG.height / 2, 32, 32, 240),
    dots: [],
    particles: [],
    score: 0,
    timeLeft: DEFAULT_GAME_CONFIG.durationSeconds,
    status: 'idle',
  };
}

export const DotCollectorPage: React.FC = () => {
  const initialState = useMemo(() => createInitialState(), []);
  const [displayState, setDisplayState] = useState<GameState>(initialState);
  const { gameState, start, stop, loop } = useGameLoop(initialState, DEFAULT_GAME_CONFIG);

  useEffect(() => {
    setDisplayState(gameState);
  }, [gameState]);

  const handleStart = useCallback(() => {
    const fresh = createInitialState();
    fresh.status = 'running';
    loop.reset(fresh);
    setDisplayState(fresh);
    start();
  }, [start, loop]);

  const handlePause = useCallback(() => {
    loop.state.status = 'paused';
    setDisplayState((current) => ({ ...current, status: 'paused' }));
    stop();
  }, [loop, stop]);

  const handleResume = useCallback(() => {
    loop.state.status = 'running';
    setDisplayState((current) => ({ ...current, status: 'running' }));
    start();
  }, [loop, start]);

  const handleRestart = useCallback(() => {
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
  const isPaused = displayState.status === 'paused';

  return (
    <div className="dcg-page">
      {isIdle && <StartScreen onPlay={handleStart} highScore={0} />}
      <div className="dcg-container">
        <div className="dcg-game-area">
          <div className="dcg-controls">
            <button onClick={handleStart} disabled={isRunning} className="dcg-btn dcg-btn-primary" aria-pressed={isRunning}>
              {isGameOver ? 'Play Again' : 'Start Game'}
            </button>
            {(isRunning || isPaused) && (
              <button onClick={isRunning ? handlePause : handleResume} className="dcg-btn dcg-btn-secondary">
                {isRunning ? 'Pause' : 'Resume'}
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
            <div>Food on field: <strong>{displayState.dots.length}</strong></div>
          </div>
          <div className="dcg-hud-card" style={{ fontSize: 12 }}>
            <div>
              <strong>Player</strong>: x={Math.round(displayState.player.x)}, y={Math.round(displayState.player.y)}
              {' '}
              (<strong>w</strong>={Math.round(displayState.player.width)}, <strong>h</strong>={Math.round(displayState.player.height)})
            </div>
            <div style={{ marginTop: 4 }}>
              <strong>Tail</strong>: target={(displayState.player.tailLength || 0)} visible={(displayState.player.segments || []).length}
            </div>
            <div style={{ marginTop: 6 }}><strong>Dots</strong>:</div>
            <ul style={{ margin: 0, paddingLeft: 12 }}>
              {displayState.dots.map((d) => (
                <li key={d.id}>
                  {d.id.slice(-6)} @ {Math.round(d.x)},{Math.round(d.y)} (r={d.radius})
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 8 }}>
              <button
                onClick={() => {
                  if (displayState.dots && displayState.dots.length) {
                    const fd = displayState.dots[0];
                    // move authoritative loop player to dot location for testing
                    loop.state.player.x = fd.x;
                    loop.state.player.y = fd.y;
                    // ensure loop is running so collision is processed
                    loop.start();
                    // reflect immediately in UI
                    setDisplayState({ ...loop.state });
                  }
                }}
                style={{ fontSize: 12, padding: '6px 10px' }}
              >
                Teleport to food (debug)
              </button>
            </div>
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
