import React, { useCallback, useState, useEffect, useMemo } from 'react';
import GameCanvas from '../components/GameCanvas';
import ScoreBoard from '../components/ScoreBoard';
import Timer from '../components/Timer';
import GameOver from '../components/GameOver';
import StartScreen from '../components/StartScreen';
import TouchControls from '../components/TouchControls';
import LoadingScreen from '../components/LoadingScreen';
import Tutorial from '../components/Tutorial';
import '../styles/game.css';
import { GameState, GameConfig, DifficultyLevel } from '../types/game.types';
import useGameLoop from '../hooks/useGameLoop';
import Player from '../game/Player';
import StorageService from '../services/StorageService';
import { checkAchievements, Achievement } from '../services/AchievementEngine';
import AudioService from '../services/AudioService';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GAME_DURATION_SECONDS,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  DIFFICULTY_SPEED,
} from '../constants/game.constants';

function buildConfig(difficulty: DifficultyLevel): GameConfig {
  return {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    durationSeconds: GAME_DURATION_SECONDS,
    difficulty,
  };
}

function createInitialState(difficulty: DifficultyLevel): GameState {
  const speed = DIFFICULTY_SPEED[difficulty];
  return {
    player: new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT, speed),
    dots: [],
    obstacles: [],
    particles: [],
    scorePopups: [],
    score: 0,
    dotsCollected: 0,
    collectedRare: false,
    collectedBonus: false,
    timeLeft: GAME_DURATION_SECONDS,
    status: 'idle',
    difficulty,
    speedMultiplier: 1,
    invincibleUntil: 0,
  };
}

const DIFFICULTIES: DifficultyLevel[] = ['easy', 'medium', 'hard'];

export const DotCollectorPage: React.FC = () => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [highScore, setHighScore] = useState(0);
  const [newHighScore, setNewHighScore] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showTouchControls, setShowTouchControls] = useState(false);
  const [theme, setTheme] = useState('classic');
  const [showTutorial, setShowTutorial] = useState(false);

  const config = useMemo(() => buildConfig(difficulty), [difficulty]);
  const initialState = useMemo(() => createInitialState(difficulty), [difficulty]);

  const [displayState, setDisplayState] = useState<GameState>(initialState);
  const { gameState, start, stop, loop } = useGameLoop(initialState, config);

  useEffect(() => {
    const stats = StorageService.getStats();
    setHighScore(stats.highScore);
    const settings = StorageService.getSettings();
    setMuted(settings.muted);
    AudioService.setMuted(settings.muted);
    setTheme(settings.theme);
    document.documentElement.setAttribute('data-theme', settings.theme);
    setShowTutorial(!settings.tutorialSeen);
    setShowTouchControls('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    setDisplayState(gameState);

    // On game over — save stats and check achievements
    if (gameState.status === 'gameOver' && displayState.status !== 'gameOver') {
      const timeSurvived = GAME_DURATION_SECONDS - gameState.timeLeft;
      const stats = StorageService.saveGameResult(gameState.score, gameState.dotsCollected, timeSurvived);
      const wasNewHigh = gameState.score > highScore;
      setHighScore(stats.highScore);
      setNewHighScore(wasNewHigh);

      const unlocked = checkAchievements(
        {
          score: gameState.score,
          dotsCollected: gameState.dotsCollected,
          timeSurvived,
          collectedRare: gameState.collectedRare,
          collectedBonus: gameState.collectedBonus,
        },
        stats.totalGamesPlayed,
      );
      setUnlockedAchievements(unlocked);
    }
  }, [gameState, displayState.status, highScore]);

  const handleStart = useCallback(() => {
    const fresh = createInitialState(difficulty);
    fresh.status = 'running';
    loop.reset(fresh);
    setDisplayState(fresh);
    setNewHighScore(false);
    setUnlockedAchievements([]);
    AudioService.startMusic();
    start();
  }, [start, loop, difficulty]);

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
    const fresh = createInitialState(difficulty);
    fresh.status = 'running';
    loop.reset(fresh);
    setDisplayState(fresh);
    setNewHighScore(false);
    setUnlockedAchievements([]);
    AudioService.startMusic();
    start();
  }, [start, stop, loop, difficulty]);

  const toggleMute = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);
    AudioService.setMuted(newMuted);
    StorageService.saveSetting('muted', newMuted);
  }, [muted]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {});
    }
  }, []);

  const changeTheme = useCallback((newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    StorageService.saveSetting('theme', newTheme);
  }, []);

  const closeTutorial = useCallback(() => {
    setShowTutorial(false);
    StorageService.saveSetting('tutorialSeen', true);
  }, []);

  const isGameOver = displayState.status === 'gameOver';
  const isRunning = displayState.status === 'running';
  const isIdle = displayState.status === 'idle';
  const isPaused = displayState.status === 'paused';

  return (
    <div className="dcg-page">
      <LoadingScreen />
      {showTutorial && <Tutorial onClose={closeTutorial} />}
      {isIdle && <StartScreen onPlay={handleStart} highScore={highScore} />}
      {isGameOver && (
        <GameOver
          finalScore={displayState.score}
          dotsCollected={displayState.dotsCollected}
          onRestart={handleRestart}
          timeLimit={config.durationSeconds}
          newHighScore={newHighScore}
          unlockedAchievements={unlockedAchievements}
        />
      )}
      <div className="dcg-container">
        <div className="dcg-game-area">
          <div className="dcg-controls">
            {!isRunning && !isPaused && (
              <>
                <div className="dcg-difficulty" role="group" aria-label="Select difficulty">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`dcg-btn dcg-btn-difficulty ${difficulty === d ? 'dcg-btn-difficulty--active' : ''}`}
                      aria-pressed={difficulty === d}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="dcg-theme-selector" role="group" aria-label="Select theme">
                  <button
                    onClick={() => changeTheme('classic')}
                    className={`dcg-theme-btn dcg-theme-classic ${theme === 'classic' ? 'dcg-theme-btn--active' : ''}`}
                    aria-label="Classic theme"
                    title="Classic"
                  />
                  <button
                    onClick={() => changeTheme('dark')}
                    className={`dcg-theme-btn dcg-theme-dark ${theme === 'dark' ? 'dcg-theme-btn--active' : ''}`}
                    aria-label="Dark theme"
                    title="Dark"
                  />
                  <button
                    onClick={() => changeTheme('neon')}
                    className={`dcg-theme-btn dcg-theme-neon ${theme === 'neon' ? 'dcg-theme-btn--active' : ''}`}
                    aria-label="Neon theme"
                    title="Neon"
                  />
                </div>
              </>
            )}
            <button
              onClick={handleStart}
              disabled={isRunning}
              className="dcg-btn dcg-btn-primary"
              aria-label="Start game"
            >
              {isGameOver ? 'Play Again' : 'Start Game'}
            </button>
            {(isRunning || isPaused) && (
              <button
                onClick={isRunning ? handlePause : handleResume}
                className="dcg-btn dcg-btn-secondary"
                aria-label={isRunning ? 'Pause game' : 'Resume game'}
              >
                {isRunning ? 'Pause' : 'Resume'}
              </button>
            )}
            <button
              onClick={toggleMute}
              className="dcg-btn dcg-btn-secondary"
              aria-label={muted ? 'Unmute audio' : 'Mute audio'}
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
            <button
              onClick={toggleFullscreen}
              className="dcg-btn dcg-btn-secondary"
              aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {fullscreen ? '🗗' : '⛶'}
            </button>
          </div>
          <div className="dcg-canvas-wrapper">
            <GameCanvas loop={loop} config={config} />
            <TouchControls visible={showTouchControls && (isRunning || isPaused)} />
          </div>
        </div>

        <aside className="dcg-sidebar">
          <div className="dcg-hud-card">
            <ScoreBoard score={displayState.score} dotsCollected={displayState.dotsCollected} highScore={highScore} />
          </div>
          <div className="dcg-hud-card">
            <div className="dcg-score-label">Lives</div>
            <div className="dcg-score-value">{displayState.player.lives}</div>
          </div>
          <div className="dcg-hud-card">
            <div className="dcg-score-label">Difficulty</div>
            <div className="dcg-score-value" style={{ fontSize: 22, textTransform: 'capitalize' }}>
              {displayState.difficulty}
            </div>
          </div>
          <div className="dcg-hud-card">
            <Timer seconds={displayState.timeLeft} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DotCollectorPage;
