# Dependencies

## Internal Dependencies

```
DotCollectorPage
  --> GameCanvas
  --> ScoreBoard
  --> Timer
  --> GameOver
  --> StartScreen
  --> useGameLoop
        --> GameLoop
              --> Player
              --> Dot
                    --> helpers (randomBetween)
              --> Collision
              --> keyboard (KeyboardInputManager)
  --> game.types (shared interfaces)
```

## External Dependencies

### react (^18.2.0)
- **Purpose**: UI framework
- **License**: MIT

### react-dom (^18.2.0)
- **Purpose**: DOM renderer
- **License**: MIT

### react-scripts (5.0.1)
- **Purpose**: Build toolchain
- **License**: MIT

### typescript (4.9.5)
- **Purpose**: Static typing (pinned — react-scripts incompatible with TS 5.x)
- **License**: Apache-2.0

### @types/react (^19.2.14)
- **Purpose**: React TypeScript definitions
- **License**: MIT

### @types/react-dom (^19.2.3)
- **Purpose**: ReactDOM TypeScript definitions
- **License**: MIT

### ajv (6.12.6) + ajv-keywords (3.5.2)
- **Purpose**: JSON schema validation (react-scripts peer dependency)
- **License**: MIT

### serve (^14.0.0)
- **Purpose**: Local static file server for testing build output
- **License**: MIT

### web-vitals (^3.0.0)
- **Purpose**: Core Web Vitals measurement
- **License**: Apache-2.0
