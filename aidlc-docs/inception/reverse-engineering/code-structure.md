# Code Structure

## Build System
- **Type**: npm (react-scripts 5.0.1)
- **Configuration**: package.json at `src/frontend/features/dot-collector-game/package.json`
- **Key Scripts**:
  - `npm start` — dev server (port 3000)
  - `npm run build` — production build to `build/`
  - `npm run type-check` — TypeScript validation
  - `npm test` — Jest test runner

## Project Structure

```
src/frontend/features/dot-collector-game/
├── src/
│   ├── App.tsx                    — Root component
│   ├── index.tsx                  — React entry point
│   ├── components/
│   │   ├── GameCanvas.tsx         — Canvas renderer
│   │   ├── GameOver.tsx           — Game over overlay
│   │   ├── ScoreBoard.tsx         — Score display
│   │   ├── StartScreen.tsx        — Start overlay
│   │   └── Timer.tsx              — Timer display
│   ├── game/
│   │   ├── Collision.ts           — Collision detection
│   │   ├── Dot.ts                 — Dot entity
│   │   ├── GameLoop.ts            — Game engine
│   │   └── Player.ts              — Player entity
│   ├── hooks/
│   │   └── useGameLoop.ts         — React-GameLoop bridge
│   ├── pages/
│   │   └── DotCollectorPage.tsx   — Main game page
│   ├── styles/
│   │   └── game.css               — All styles
│   ├── types/
│   │   └── game.types.ts          — TypeScript types
│   └── utils/
│       ├── helpers.ts             — randomBetween()
│       └── keyboard.ts            — KeyboardInputManager
├── public/
│   └── index.html                 — HTML shell
├── package.json                   — Dependencies
├── tsconfig.json                  — TypeScript config
└── package-lock.json              — Lockfile
```

## Existing Files Inventory

### Core Application
- `src/App.tsx` — Renders DotCollectorPage
- `src/index.tsx` — React.createRoot entry point
- `src/pages/DotCollectorPage.tsx` — Game orchestrator, state owner

### Components (UI)
- `src/components/GameCanvas.tsx` — Canvas rendering with rAF subscription
- `src/components/GameOver.tsx` — Final score overlay
- `src/components/ScoreBoard.tsx` — Live score display
- `src/components/StartScreen.tsx` — Welcome screen with instructions
- `src/components/Timer.tsx` — Countdown timer display

### Game Engine
- `src/game/GameLoop.ts` — requestAnimationFrame loop, collision, spawning
- `src/game/Player.ts` — Snake head + tail logic
- `src/game/Dot.ts` — Collectible entity
- `src/game/Collision.ts` — rect-circle and circle-circle collision

### Hooks
- `src/hooks/useGameLoop.ts` — Throttles GameLoop state to React (30fps)

### Types
- `src/types/game.types.ts` — All TypeScript interfaces (GameState, PlayerState, DotState, etc.)

### Utilities
- `src/utils/helpers.ts` — randomBetween() for dot spawning
- `src/utils/keyboard.ts` — KeyboardInputManager singleton

### Styles
- `src/styles/game.css` — All CSS (arcade theme, gradients, animations)

### Public
- `public/index.html` — HTML shell with `<div id="root">`

### Config
- `package.json` — npm dependencies, scripts
- `tsconfig.json` — TypeScript compiler options
- `package-lock.json` — Dependency lockfile

## Design Patterns

### Observer Pattern
- **Location**: GameLoop.onTick() / KeyboardInputManager.subscribe()
- **Purpose**: Decouple game engine from React rendering
- **Implementation**: Subscribers array, notify on state change

### Entity-Component Pattern (Lightweight)
- **Location**: Player, Dot classes
- **Purpose**: Encapsulate game entity state and behavior
- **Implementation**: Classes with state + methods (Player.updateFromInput, Dot.spawnRandom)

### Singleton Pattern
- **Location**: KeyboardInputManager (keyboard export)
- **Purpose**: Single global input manager
- **Implementation**: Exported instance `export const keyboard = new KeyboardInputManager()`

### Hook Pattern (React)
- **Location**: useGameLoop
- **Purpose**: Bridge imperative GameLoop to declarative React
- **Implementation**: useEffect + useMemo + useState

## Critical Dependencies

### react (^18.2.0)
- **Usage**: UI framework
- **Purpose**: Component rendering, state management

### react-dom (^18.2.0)
- **Usage**: React renderer for browser
- **Purpose**: createRoot, render to DOM

### react-scripts (5.0.1)
- **Usage**: Build toolchain (Webpack, Babel, ESLint)
- **Purpose**: Dev server, production build

### typescript (4.9.5)
- **Usage**: Type checking
- **Purpose**: Static type safety (pinned for react-scripts compatibility)

### @types/react (^19.2.14)
- **Usage**: TypeScript definitions for React
- **Purpose**: Type safety in TSX files

### @types/react-dom (^19.2.3)
- **Usage**: TypeScript definitions for ReactDOM
- **Purpose**: Type safety for createRoot, etc.
