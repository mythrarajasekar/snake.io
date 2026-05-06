import React, { useRef, useEffect, useCallback } from 'react';
import '../styles/game.css';
import { GameState, GameConfig, PlayerState, DotState, ParticleState } from '../types/game.types';
import GameLoop from '../game/GameLoop';

// Responsibility: Mount a pixel-perfect HTML Canvas, subscribe to a GameLoop (or
// create an internal one), and render the authoritative GameState snapshot to the
// canvas on each tick. Rendering logic lives in small reusable functions.

type Props = {
  config?: GameConfig;
  initialState?: GameState;
  // optional external loop: if provided, the canvas will subscribe to it and
  // will NOT start/stop it automatically. This allows a central hook to drive
  // the loop while canvas is purely a rendering surface.
  loop?: GameLoop;
};

const DEFAULT_CONFIG: GameConfig = { width: 800, height: 600, durationSeconds: 60 };

// Reusable rendering function: clear canvas
function clearCanvas(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
}

// Reusable rendering function: draw player as a filled square
function drawPlayer(ctx: CanvasRenderingContext2D, player: PlayerState) {
  ctx.fillStyle = '#007bff';
  ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
}

// Component
const GameCanvas: React.FC<Props> = ({ config = DEFAULT_CONFIG, initialState, loop: externalLoop }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loopRef = useRef<GameLoop | null>(externalLoop ?? null);

  // Initialize canvas size and scaling for high DPI displays
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const rect = parent ? parent.getBoundingClientRect() : { width: config.width, height: config.height };
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(100, Math.floor(rect.width));
    const height = Math.max(100, Math.floor(rect.height));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [config.width, config.height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Prepare initial game state
    const initial: GameState =
      initialState ?? ({ player: { x: config.width / 2, y: config.height / 2, width: 32, height: 32, speed: 200 }, dots: [], score: 0, timeLeft: config.durationSeconds, status: 'idle' });

    // create internal loop only when external not provided
    let internalCreated = false;
    if (!loopRef.current) {
      loopRef.current = new GameLoop(initial, config);
      internalCreated = true;
    }
    const loop = loopRef.current as GameLoop;

    // small reusable renderers for dots and particles
    function drawDot(ctx: CanvasRenderingContext2D, dot: DotState) {
      ctx.fillStyle = '#ff4757';
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawParticle(ctx: CanvasRenderingContext2D, p: ParticleState) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // subscribe to ticks — we render imperatively in the subscription to avoid React re-renders
    const unsubscribe = loop.onTick((state) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      clearCanvas(ctx, w, h);

      // draw dots
      if (state.dots && state.dots.length) {
        for (const d of state.dots) drawDot(ctx, d);
      }

      // draw player on top
      drawPlayer(ctx, state.player);

      // draw particle effects
      if ((state as any).particles && (state as any).particles.length) {
        for (const p of (state as any).particles) drawParticle(ctx, p);
      }
    });

    // Start internal loop automatically; if external loop was provided, leave lifecycle to owner
    if (internalCreated) loop.start();

    // initial resize
    resizeCanvas();

    // Responsive: handle parent size changes
    const ro = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    // Cleanup
    return () => {
      unsubscribe();
      if (internalCreated) loop.stop();
      ro.disconnect();
      if (internalCreated) loopRef.current = null;
    };
  }, [config, initialState, externalLoop, resizeCanvas]);

  // window-resize fallback
  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  return <canvas ref={canvasRef} className="dcg-canvas dcg-canvas-responsive" />;
};

export default GameCanvas;
