import { useEffect, useMemo, useRef, useState } from 'react';
import GameLoop from '../game/GameLoop';
import { GameState, GameConfig } from '../types/game.types';

// Responsibility: Provide a React hook wrapper around the game loop so
// components can access current GameState and control lifecycle.
export function useGameLoop(initialState: GameState, config: GameConfig) {
  const [state, setState] = useState<GameState>(initialState);
  const loop = useMemo(() => new GameLoop(initialState, config), [initialState, config]);
  const loopRef = useRef(loop);
  const lastRenderRef = useRef<number>(0);

  useEffect(() => {
    loopRef.current = loop;
    // subscribe to loop ticks, but throttle React updates to ~30 FPS
    const unsubscribe = loop.onTick((s) => {
      const now = performance.now();
      const minMs = 1000 / 30;
      if (now - lastRenderRef.current >= minMs) {
        lastRenderRef.current = now;
        // shallow copy to ensure React sees a new object reference
        setState({ ...s });
      }
    });

    return () => {
      unsubscribe();
      loop.stop();
    };
  }, [loop]);

  const start = () => loop.start();
  const stop = () => loop.stop();

  return { gameState: state, start, stop, loop } as const;
}

export default useGameLoop;
