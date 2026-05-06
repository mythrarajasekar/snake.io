// Responsibility: Public API surface for the Dot Collector Game module.
export { default as GameCanvas } from './components/GameCanvas';
export { default as ScoreBoard } from './components/ScoreBoard';
export { default as Timer } from './components/Timer';
export { default as GameOver } from './components/GameOver';

export { default as DotCollectorPage } from './pages/DotCollectorPage';

export * from './types/game.types';
export * from './hooks/useGameLoop';

// The module deliberately keeps its own styling file; consumers can import it
// or rely on the page to include it.
