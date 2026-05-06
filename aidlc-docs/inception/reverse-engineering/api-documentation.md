# API Documentation

## REST APIs
None — this is a fully client-side application with no backend or HTTP APIs.

## Internal APIs

### GameLoop
- **constructor(initialState: GameState, config: GameConfig)** — Creates engine, spawns initial dot
- **start()** — Begins rAF loop, attaches keyboard listeners
- **stop()** — Cancels rAF, detaches keyboard listeners
- **reset(state: GameState)** — Replaces state, re-spawns dot if needed
- **onTick(cb: TickCallback): () => void** — Subscribe to game ticks; returns unsubscribe function
- **state: GameState** — Public mutable game state reference

### Player
- **constructor(x, y, width, height, speed)** — Creates player at position
- **static centered(canvasWidth, canvasHeight): Player** — Factory for center-spawned player
- **updateFromInput(input: InputState, dt: number, bounds)** — Moves player, updates tail segments, clamps to bounds

### Dot
- **constructor(id, x, y, radius, value)** — Creates dot at position
- **static spawnRandom(id, bounds, player?, radius): Dot** — Spawns dot at random position avoiding player overlap (12 attempts max)

### Collision
- **rectCircleCollision(player: PlayerState, dot: DotState): boolean** — AABB-circle collision test
- **circleCollision(ax, ay, ar, bx, by, br): boolean** — Circle-circle collision test

### KeyboardInputManager
- **startListening()** — Attaches document keydown/keyup listeners (capture phase)
- **stopListening()** — Detaches listeners, resets state
- **getState(): InputState** — Returns snapshot of current key state
- **subscribe(cb: Subscriber): () => void** — Subscribe to input changes

### useGameLoop(initialState, config)
- **Returns**: `{ gameState, start, stop, loop }`
- **gameState**: Throttled React state (30fps)
- **start()**: Starts the game loop
- **stop()**: Stops the game loop
- **loop**: Direct GameLoop instance reference

## Data Models

### GameState
```typescript
{
  player: PlayerState;
  dots: DotState[];
  particles?: ParticleState[];
  score: number;
  timeLeft: number;
  status: 'idle' | 'running' | 'paused' | 'gameOver';
}
```

### PlayerState
```typescript
{
  x: number;           // center X
  y: number;           // center Y
  width: number;       // 32px default
  height: number;      // 32px default
  speed: number;       // 240 px/s
  vx?: number;         // current velocity X
  vy?: number;         // current velocity Y
  segments?: { x: number; y: number }[];  // tail segments
  tailLength?: number; // desired tail length
}
```

### DotState
```typescript
{
  id: string;      // unique id
  x: number;       // center X
  y: number;       // center Y
  radius: number;  // 8px default
  value: number;   // 1 point default
}
```

### ParticleState
```typescript
{
  id: string;
  x: number;
  y: number;
  r: number;     // radius (grows over time)
  alpha: number; // opacity (fades to 0)
  ttl: number;   // time-to-live in seconds (0.5s)
}
```

### GameConfig
```typescript
{
  width: number;           // 800px
  height: number;          // 600px
  durationSeconds: number; // 60s
  maxDots?: number;
  spawnIntervalMs?: number;
}
```

### InputState
```typescript
{
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}
```
