# System Architecture

## System Overview
snake.io is a single-page React application with a custom Canvas-based game engine. There is no backend — all game logic runs client-side. The architecture separates concerns into: game engine (pure TS classes), React UI layer (components + hooks), and CI/CD infrastructure (GitHub Actions + Render).

## Architecture Diagram (Text)

```
+--------------------------------------------------+
|                  Browser (SPA)                   |
|                                                  |
|  +--------------------------------------------+ |
|  |         DotCollectorPage (React)           | |
|  |  - Owns GameState                          | |
|  |  - Handles start/pause/resume/restart      | |
|  |                                            | |
|  |  +------------------+  +--------------+   | |
|  |  |   GameCanvas     |  |   Sidebar    |   | |
|  |  |  (Canvas render) |  | ScoreBoard   |   | |
|  |  |                  |  | Timer        |   | |
|  |  |  useGameLoop()   |  | GameOver     |   | |
|  |  +--------+---------+  +--------------+   | |
|  |           |                               | |
|  |  +--------v---------+                    | |
|  |  |    GameLoop       |                   | |
|  |  |  (rAF engine)     |                   | |
|  |  |  - Player.update  |                   | |
|  |  |  - Collision check|                   | |
|  |  |  - Dot spawn      |                   | |
|  |  |  - Timer tick     |                   | |
|  |  +---+----------+----+                   | |
|  |      |          |                        | |
|  |  +---v---+  +---v---+                   | |
|  |  | Player|  |  Dot  |                   | |
|  |  +-------+  +-------+                   | |
|  +--------------------------------------------+ |
+--------------------------------------------------+
         |
         | npm run build
         v
+------------------+     push to main     +------------------+
|  GitHub Actions  | ------------------> |  Render (Static) |
|  CI/CD Pipeline  |   deploy hook curl  |  snake-io.onrender|
+------------------+                     +------------------+
```

## Component Descriptions

### DotCollectorPage
- **Purpose**: Top-level page component and game state owner
- **Responsibilities**: State management, game lifecycle, UI orchestration
- **Dependencies**: useGameLoop, GameCanvas, ScoreBoard, Timer, GameOver, StartScreen
- **Type**: Application

### GameCanvas
- **Purpose**: Canvas renderer
- **Responsibilities**: Draws all game entities each frame
- **Dependencies**: GameLoop, Player, game.types
- **Type**: Application

### GameLoop
- **Purpose**: Core game engine
- **Responsibilities**: rAF loop, physics, collision, dot spawning, particle system
- **Dependencies**: Player, Dot, Collision, keyboard, game.types
- **Type**: Application (Engine)

### Player
- **Purpose**: Snake entity
- **Responsibilities**: Movement, tail management, boundary clamping
- **Dependencies**: game.types
- **Type**: Application (Model)

### Dot
- **Purpose**: Collectible entity
- **Responsibilities**: State, random spawn
- **Dependencies**: game.types, helpers
- **Type**: Application (Model)

### Collision
- **Purpose**: Collision math
- **Responsibilities**: rect-circle and circle-circle detection
- **Dependencies**: game.types
- **Type**: Utility

### useGameLoop
- **Purpose**: React-GameLoop bridge
- **Responsibilities**: Throttled state sync, lifecycle management
- **Dependencies**: GameLoop, game.types
- **Type**: Hook

### KeyboardInputManager
- **Purpose**: Input capture
- **Responsibilities**: Key event handling, state normalisation
- **Dependencies**: None
- **Type**: Utility

## Data Flow

```
KeyboardInputManager
        |
        | getState() each tick
        v
    GameLoop.loop()
        |
        |-- Player.updateFromInput(input, dt, bounds)
        |-- rectCircleCollision(player, dot)
        |-- Dot.spawnRandom() on collect
        |-- timer countdown
        |-- notify subscribers (GameCanvas, useGameLoop)
        |
        v
   GameCanvas.renderState()   useGameLoop -> React setState
        |                              |
        v                              v
   Canvas draw                  DotCollectorPage re-render
                                 (ScoreBoard, Timer, GameOver)
```

## Integration Points
- **External APIs**: None
- **Databases**: None
- **Third-party Services**: Render (static hosting), GitHub Actions (CI/CD)

## Infrastructure Components
- **CI/CD**: GitHub Actions (.github/workflows/deploy.yml)
- **Hosting**: Render Static Site (render.yaml)
- **Deployment Model**: Push to main → GitHub Actions build → Render deploy hook → live
