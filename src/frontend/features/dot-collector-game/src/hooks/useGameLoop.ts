import { useEffect, useMemo, useRef, useState } from 'react';
import GameLoop from '../game/GameLoop';
import { GameState, GameConfig } from '../types/game.types';
import { RENDER_INTERVAL_MS } from '../constants/game.constants';

export function useGameLoop(initialState: GameState, config: GameConfig) {
  const [state, setState] = useState<GameState>(initialState);
  const initialStateRef = useRef(initialState);
  const loop = useMemo(() => new GameLoop(initialStateRef.current, config), [config]);
  const loopRef = useRef(loop);
  const lastRenderRef = useRef<number>(0);

  useEffect(() => {
    loopRef.current = loop;
    const unsubscribe = loop.onTick((s) => {
      const now = performance.now();
      if (now - lastRenderRef.current >= RENDER_INTERVAL_MS) {
        lastRenderRef.current = now;
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
