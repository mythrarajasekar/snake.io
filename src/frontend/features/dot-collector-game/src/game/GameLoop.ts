import { GameState, GameConfig, TickCallback, InputState, ParticleState, ScorePopup } from '../types/game.types';
import { keyboard } from '../utils/keyboard';
import Dot from './Dot';
import Player from './Player';
import Obstacle from './Obstacle';
import { rectCircleCollision, rectRectCollision } from './Collision';
import AudioService from '../services/AudioService';
import {
  DOT_RADIUS,
  SEGMENTS_PER_DOT,
  PARTICLE_TTL,
  PARTICLE_INITIAL_RADIUS,
  PARTICLE_GROW_RATE,
  DIFFICULTY_SPEED_SCALE,
  PLAYER_MAX_SPEED,
  OBSTACLE_COUNT,
  RESPAWN_INVINCIBLE_DURATION,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SCORE_POPUP_TTL,
} from '../constants/game.constants';

let __idCounter = 0;
function makeId(): string {
  __idCounter += 1;
  return `id_${Date.now()}_${__idCounter}`;
}

export class GameLoop {
  private running = false;
  private rafId: number | null = null;
  private lastTime = 0;
  public state: GameState;
  private config: GameConfig;
  private subscribers: TickCallback[] = [];

  constructor(initialState: GameState, config: GameConfig) {
    this.state = initialState;
    this.config = config;
    this.ensureDots();
    this.ensureObstacles();
  }

  private ensureDots(): void {
    if (!this.state.dots || this.state.dots.length === 0) {
      this.state.dots = [
        Dot.spawnRandom(makeId(), { width: this.config.width, height: this.config.height }, this.state.player),
      ];
    }
  }

  private ensureObstacles(): void {
    if (!this.state.obstacles || this.state.obstacles.length === 0) {
      const count = OBSTACLE_COUNT[this.state.difficulty] ?? OBSTACLE_COUNT['medium'];
      this.state.obstacles = Obstacle.spawnMany(
        count,
        { width: this.config.width, height: this.config.height },
        this.state.player,
      );
    }
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    keyboard.startListening();
    this.rafId = requestAnimationFrame(this.loop.bind(this));
  }

  stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    keyboard.stopListening();
  }

  onTick(cb: TickCallback): () => void {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter((c) => c !== cb);
    };
  }

  reset(state: GameState): void {
    this.state = state;
    this.ensureDots();
    this.ensureObstacles();
  }

  private respawnPlayer(): void {
    this.state.player.x = (this.config.width ?? CANVAS_WIDTH) / 2;
    this.state.player.y = (this.config.height ?? CANVAS_HEIGHT) / 2;
    this.state.player.segments = [];
    this.state.player.tailLength = 0;
    this.state.invincibleUntil = performance.now() + RESPAWN_INVINCIBLE_DURATION * 1000;
  }

  private loop(now: number): void {
    if (!this.running) return;
    const dt = Math.max(0, now - this.lastTime) / 1000;
    this.lastTime = now;

    if (this.state.status === 'running') {
      this.state.timeLeft = Math.max(0, this.state.timeLeft - dt);
      if (this.state.timeLeft <= 0) {
        this.state.status = 'gameOver';
        AudioService.play('gameOver');
        AudioService.stopMusic();
      }

      // Gradually increase speed
      const scaleRate = DIFFICULTY_SPEED_SCALE[this.state.difficulty] ?? DIFFICULTY_SPEED_SCALE['medium'];
      this.state.player.speed = Math.min(PLAYER_MAX_SPEED, this.state.player.speed + scaleRate * dt);
      this.state.speedMultiplier = this.state.player.speed / (DIFFICULTY_SPEED_SCALE[this.state.difficulty] ?? 240);
    }

    if (this.state.status === 'running') {
      const input: InputState = keyboard.getState();
      const bounds = { width: this.config.width, height: this.config.height };
      const player = this.state.player;
      if (player instanceof Player) {
        player.updateFromInput(input, dt, bounds);
      } else {
        let dx = 0; let dy = 0;
        if (input.left) dx -= 1;
        if (input.right) dx += 1;
        if (input.up) dy -= 1;
        if (input.down) dy += 1;
        const len = Math.hypot(dx, dy);
        player.x += (len > 0 ? dx / len : 0) * player.speed * dt;
        player.y += (len > 0 ? dy / len : 0) * player.speed * dt;
        player.x = Math.min(Math.max(player.x, player.width / 2), this.config.width - player.width / 2);
        player.y = Math.min(Math.max(player.y, player.height / 2), this.config.height - player.height / 2);
      }
    }

    // Dot collection
    if (this.state.status === 'running' && this.state.dots.length) {
      for (let i = this.state.dots.length - 1; i >= 0; i--) {
        const dot = this.state.dots[i];
        if (rectCircleCollision(this.state.player, dot)) {
          this.state.dots.splice(i, 1);
          this.state.score += dot.value;
          this.state.dotsCollected += 1;
          if (dot.dotType === 'rare') this.state.collectedRare = true;
          if (dot.dotType === 'bonus') this.state.collectedBonus = true;

          const add = Math.max(1, Math.round(SEGMENTS_PER_DOT * dot.value));
          this.state.player.tailLength = (this.state.player.tailLength ?? 0) + add;
          if (!this.state.player.segments) this.state.player.segments = [];
          while (this.state.player.segments.length < this.state.player.tailLength) {
            this.state.player.segments.push({ x: this.state.player.x, y: this.state.player.y });
          }

          this.state.particles.push({
            id: makeId(), x: dot.x, y: dot.y,
            r: PARTICLE_INITIAL_RADIUS, alpha: 1, ttl: PARTICLE_TTL,
          } as ParticleState);

          this.state.scorePopups.push({
            id: makeId(), x: dot.x, y: dot.y, value: dot.value,
            alpha: 1, ttl: SCORE_POPUP_TTL, elapsed: 0,
          } as ScorePopup);

          this.state.dots.push(
            Dot.spawnRandom(makeId(), { width: this.config.width, height: this.config.height }, this.state.player),
          );
        }
      }
    }

    // Obstacle collision — only when not invincible
    if (this.state.status === 'running' && now > this.state.invincibleUntil) {
      for (const obstacle of this.state.obstacles) {
        if (rectRectCollision(this.state.player, obstacle)) {
          this.state.player.lives -= 1;
          if (this.state.player.lives <= 0) {
            this.state.player.lives = 0;
            this.state.status = 'gameOver';
            AudioService.play('gameOver');
            AudioService.stopMusic();
          } else {
            AudioService.play('lifeLost');
            this.respawnPlayer();
          }
          break;
        }
      }
    }

    // Particles
    for (let i = this.state.particles.length - 1; i >= 0; i--) {
      const pt = this.state.particles[i];
      pt.ttl -= dt;
      pt.alpha = Math.max(0, pt.ttl / PARTICLE_TTL);
      pt.r += PARTICLE_GROW_RATE * dt;
      if (pt.ttl <= 0) this.state.particles.splice(i, 1);
    }

    // Score popups
    for (let i = this.state.scorePopups.length - 1; i >= 0; i--) {
      const sp = this.state.scorePopups[i];
      sp.ttl -= dt;
      sp.elapsed += dt;
      sp.alpha = Math.max(0, sp.ttl / SCORE_POPUP_TTL);
      sp.y -= 40 * dt; // float upward
      if (sp.ttl <= 0) this.state.scorePopups.splice(i, 1);
    }

    for (const cb of this.subscribers) cb(this.state);
    this.rafId = requestAnimationFrame(this.loop.bind(this));
  }
}

export default GameLoop;
