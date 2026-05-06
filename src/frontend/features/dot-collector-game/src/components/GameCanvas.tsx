import React, { useRef, useEffect, useCallback } from 'react';
import '../styles/game.css';
import { GameState, GameConfig, PlayerState, DotState, ParticleState } from '../types/game.types';
import GameLoop from '../game/GameLoop';
import Player from '../game/Player';

type Props = {
  config?: GameConfig;
  initialState?: GameState;
  loop?: GameLoop;
};

const DEFAULT_CONFIG: GameConfig = { width: 800, height: 600, durationSeconds: 60 };

function clearCanvas(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
}

function drawPlayer(ctx: CanvasRenderingContext2D, player: PlayerState) {
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#f8fafc';
  ctx.strokeRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
}

const GameCanvas: React.FC<Props> = ({ config = DEFAULT_CONFIG, initialState, loop: externalLoop }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loopRef = useRef<GameLoop | null>(externalLoop ?? null);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Use fixed game config size so spawn coordinates match visible canvas
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(100, Math.floor(config.width));
    const height = Math.max(100, Math.floor(config.height));
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

    const initial: GameState =
      initialState ?? ({ player: new Player(config.width / 2, config.height / 2, 32, 32, 200), dots: [], score: 0, timeLeft: config.durationSeconds, status: 'idle' });

    let internalCreated = false;
    if (!loopRef.current) {
      loopRef.current = new GameLoop(initial, config);
      internalCreated = true;
    }
    const loop = loopRef.current as GameLoop;

    function drawDot(ctx: CanvasRenderingContext2D, dot: DotState) {
      ctx.fillStyle = '#ff4757';
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawTail(ctx: CanvasRenderingContext2D, segments: { x: number; y: number }[] | undefined, size = 10) {
      if (!segments || !segments.length) return;
      ctx.fillStyle = '#34d399';
      for (const s of segments) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
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

    const renderState = (state: GameState) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      clearCanvas(ctx, w, h);

      if (state.dots && state.dots.length) {
        for (const d of state.dots) drawDot(ctx, d);
      }

      // draw tail segments behind the player
      drawTail(ctx, (state.player as any).segments, Math.max(8, (state.player.width || 32) / 2));

      drawPlayer(ctx, state.player);

      if ((state as any).particles && (state as any).particles.length) {
        for (const p of (state as any).particles) drawParticle(ctx, p);
      }
    };

    const unsubscribe = loop.onTick((state) => {
      renderState(state);
    });
    if (internalCreated) loop.start();

    resizeCanvas();
    // draw after sizing so positions are mapped correctly on first paint
    renderState(loop.state);

    return () => {
      unsubscribe();
      if (internalCreated) loop.stop();
      if (internalCreated) loopRef.current = null;
    };
  }, [config, initialState, externalLoop, resizeCanvas]);

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  return <canvas ref={canvasRef} className="dcg-canvas dcg-canvas-responsive" />;
};

export default GameCanvas;
