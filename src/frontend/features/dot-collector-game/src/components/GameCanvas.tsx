import React, { useRef, useEffect, useCallback } from 'react';
import '../styles/game.css';
import { GameState, GameConfig, PlayerState, DotState, ParticleState, ObstacleState, ScorePopup } from '../types/game.types';
import GameLoop from '../game/GameLoop';
import Player from '../game/Player';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_DURATION_SECONDS, DOT_TYPE_CONFIG } from '../constants/game.constants';

type Props = {
  config?: GameConfig;
  initialState?: GameState;
  loop?: GameLoop;
};

const DEFAULT_CONFIG: GameConfig = {
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  durationSeconds: GAME_DURATION_SECONDS,
};

function drawPlayer(ctx: CanvasRenderingContext2D, player: PlayerState, invincible: boolean): void {
  ctx.save();
  if (invincible) ctx.globalAlpha = 0.5;
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#f8fafc';
  ctx.strokeRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
  ctx.restore();
}

function drawTail(ctx: CanvasRenderingContext2D, segments: { x: number; y: number }[] | undefined, size: number): void {
  if (!segments?.length) return;
  ctx.fillStyle = '#34d399';
  for (const s of segments) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDot(ctx: CanvasRenderingContext2D, dot: DotState): void {
  const color = DOT_TYPE_CONFIG[dot.dotType]?.color ?? '#ff4757';
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
  ctx.fill();
  // glow ring for rare/bonus
  if (dot.dotType !== 'common') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

function drawScorePopup(ctx: CanvasRenderingContext2D, sp: ScorePopup): void {
  ctx.save();
  ctx.globalAlpha = sp.alpha;
  ctx.fillStyle = sp.value >= 5 ? '#fbbf24' : sp.value >= 3 ? '#a78bfa' : '#f8fafc';
  ctx.font = `bold ${12 + sp.value * 2}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(`+${sp.value}`, sp.x, sp.y);
  ctx.restore();
}

function drawObstacle(ctx: CanvasRenderingContext2D, obstacle: ObstacleState): void {
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  ctx.strokeStyle = '#fca5a5';
  ctx.lineWidth = 2;
  ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  // X mark
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(obstacle.x + 8, obstacle.y + 8);
  ctx.lineTo(obstacle.x + obstacle.width - 8, obstacle.y + obstacle.height - 8);
  ctx.moveTo(obstacle.x + obstacle.width - 8, obstacle.y + 8);
  ctx.lineTo(obstacle.x + 8, obstacle.y + obstacle.height - 8);
  ctx.stroke();
}

function drawParticle(ctx: CanvasRenderingContext2D, p: ParticleState): void {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

const GameCanvas: React.FC<Props> = ({ config = DEFAULT_CONFIG, initialState, loop: externalLoop }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loopRef = useRef<GameLoop | null>(externalLoop ?? null);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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

    const initial: GameState = initialState ?? {
      player: new Player(config.width / 2, config.height / 2),
      dots: [],
      obstacles: [],
      particles: [],
      scorePopups: [],
      score: 0,
      dotsCollected: 0,
      collectedRare: false,
      collectedBonus: false,
      timeLeft: config.durationSeconds,
      status: 'idle',
      difficulty: 'medium',
      speedMultiplier: 1,
      invincibleUntil: 0,
    };

    let internalCreated = false;
    if (!loopRef.current) {
      loopRef.current = new GameLoop(initial, config);
      internalCreated = true;
    }
    const loop = loopRef.current;

    const renderState = (state: GameState) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      for (const obs of state.obstacles ?? []) drawObstacle(ctx, obs);
      for (const d of state.dots) drawDot(ctx, d);

      drawTail(ctx, state.player.segments, Math.max(8, state.player.width / 2));

      const invincible = performance.now() < state.invincibleUntil;
      drawPlayer(ctx, state.player, invincible);

      for (const p of state.particles) drawParticle(ctx, p);
      for (const sp of state.scorePopups) drawScorePopup(ctx, sp);
    };

    const unsubscribe = loop.onTick(renderState);
    if (internalCreated) loop.start();

    resizeCanvas();
    renderState(loop.state);

    return () => {
      unsubscribe();
      if (internalCreated) { loop.stop(); loopRef.current = null; }
    };
  }, [config, initialState, externalLoop, resizeCanvas]);

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  return <canvas ref={canvasRef} className="dcg-canvas dcg-canvas-responsive" />;
};

export default GameCanvas;
