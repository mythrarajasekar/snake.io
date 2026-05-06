# Workflow Plan — snake.io

**Date**: 2025-01-06
**Phase**: INCEPTION → CONSTRUCTION

---

## Execution Plan

### Stages to Execute

| Stage | Execute | Reason |
|---|---|---|
| Workspace Detection | DONE | Brownfield detected |
| Reverse Engineering | DONE | Existing codebase analyzed |
| Requirements Analysis | DONE | 30 questions answered |
| User Stories | SKIP | Single-player game, requirements are clear |
| Workflow Planning | IN PROGRESS | This document |
| Application Design | YES | New components needed (obstacles, audio, themes, achievements) |
| Units Generation | YES | Multiple independent units of work |
| Construction (per unit) | YES | Code generation for each unit |
| Build and Test | YES | 80% coverage required |

---

## Units of Work

### Unit 1 — Core Refactor & Constants
**Scope**: Technical debt cleanup before new features
- Centralize all magic numbers into `src/constants/game.constants.ts`
- Remove all `console.log` debug statements from GameLoop.ts
- Fix `any` type casting — add `particles` to GameState interface
- Add `lives` to GameState and PlayerState types

### Unit 2 — Difficulty System & Speed Scaling
**Scope**: Difficulty levels + gradual speed increase
- Add `DifficultyLevel` type (easy/medium/hard)
- Update GameConfig with difficulty settings
- Implement gradual speed increase in GameLoop tick
- Update DotCollectorPage with difficulty selector UI

### Unit 3 — Lives System & Obstacles
**Scope**: 3 lives + obstacle entities
- Add `Obstacle` entity class
- Add lives tracking to GameState
- Collision with obstacle → lose life → respawn
- Game Over when lives = 0 OR timer = 0
- Render obstacles on GameCanvas

### Unit 4 — Multi-type Dots & Scoring
**Scope**: Multiple dot types with different values
- Add `DotType` enum (common, rare, bonus)
- Update Dot.spawnRandom to spawn typed dots by probability
- Score animation component (floating +N text)
- Update ScoreBoard with stats (dots collected, best score)

### Unit 5 — Persistence (localStorage)
**Scope**: High score, stats, achievements, settings
- `StorageService` — typed localStorage wrapper
- Persist: high score, total dots, achievements, settings
- Achievement engine — check conditions after each dot collect

### Unit 6 — Audio System
**Scope**: Sound effects + background music
- `AudioService` — Web Audio API wrapper
- Sound effects: collect, life lost, game over
- Background music loop with mute toggle
- Settings integration for audio on/off

### Unit 7 — Controls & Fullscreen
**Scope**: Customizable keyboard, touch controls, fullscreen
- Key rebinding UI in settings
- Touch control overlay (D-pad buttons)
- Fullscreen API integration

### Unit 8 — Themes & UI Polish
**Scope**: Multiple themes, loading screen, tutorial, animations
- Theme system (Classic, Dark, Neon) via CSS variables
- Loading screen component
- Tutorial overlay (first-time players)
- Score pop animation, full particle polish

### Unit 9 — Tests & CI Quality Gate
**Scope**: 80% test coverage + CI enforcement
- Unit tests: Player, Dot, Collision, GameLoop, StorageService, AudioService
- Component tests: GameCanvas, DotCollectorPage
- Add coverage threshold to CI workflow

---

## Dependency Order

```
Unit 1 (Refactor)
    |
    +---> Unit 2 (Difficulty)
    |         |
    +---> Unit 3 (Lives + Obstacles)
    |         |
    +---> Unit 4 (Dot Types + Scoring)
              |
              +---> Unit 5 (Persistence)
              |
              +---> Unit 6 (Audio)
              |
              +---> Unit 7 (Controls)
              |
              +---> Unit 8 (Themes + UI)
                        |
                        +---> Unit 9 (Tests + CI)
```

---

## Text Workflow Representation

```
INCEPTION PHASE
  [x] Workspace Detection
  [x] Reverse Engineering
  [x] Requirements Analysis
  [ ] Workflow Planning  <-- current
  [ ] Application Design

CONSTRUCTION PHASE
  [ ] Unit 1: Core Refactor & Constants
  [ ] Unit 2: Difficulty System & Speed Scaling
  [ ] Unit 3: Lives System & Obstacles
  [ ] Unit 4: Multi-type Dots & Scoring
  [ ] Unit 5: Persistence (localStorage)
  [ ] Unit 6: Audio System
  [ ] Unit 7: Controls & Fullscreen
  [ ] Unit 8: Themes & UI Polish
  [ ] Unit 9: Tests & CI Quality Gate
  [ ] Build and Test

OPERATIONS PHASE
  [ ] Deploy (already automated via CI/CD)
```
