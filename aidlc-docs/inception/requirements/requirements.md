# Requirements Document — snake.io

**Version**: 1.0
**Date**: 2025-01-06
**Status**: Approved

---

## 1. Functional Requirements

### 1.1 Game Modes
- FR-01: Single player mode only (initial release)
- FR-02: Power-ups deferred to a later phase

### 1.2 Difficulty System
- FR-03: Three difficulty levels — Easy, Medium, Hard
- FR-04: Player speed increases gradually over time
- FR-05: Difficulty affects dot spawn rate and player speed baseline

### 1.3 Player & Lives
- FR-06: Player has 3 lives per game session
- FR-07: Losing a life triggers a brief respawn animation
- FR-08: Game Over when all 3 lives are lost OR timer expires

### 1.4 Dots & Scoring
- FR-09: Multiple dot types with different point values (common=1pt, rare=3pt, bonus=5pt)
- FR-10: Score animations on dot collection
- FR-11: Player statistics tracked per session (dots collected, time survived, high score)
- FR-12: High score and stats persisted in browser localStorage

### 1.5 Obstacles
- FR-13: Obstacles added to the canvas — contact costs a life
- FR-14: Obstacle count/placement scales with difficulty level

### 1.6 Timer & Session
- FR-15: Game session timer is configurable (not hardcoded to 60s)
- FR-16: Endless mode available as a timer option
- FR-17: Pause / Resume functionality retained

### 1.7 Audio
- FR-18: Sound effects (dot collect, life lost, game over)
- FR-19: Background music with mute/unmute toggle

### 1.8 Controls
- FR-20: Keyboard controls customizable (rebind keys in settings)
- FR-21: Touch controls with customizable on-screen buttons
- FR-22: Fullscreen mode supported

### 1.9 Achievements & Progress
- FR-23: Achievement system (e.g. "Collect 10 dots", "Survive 30s", "Score 50 points")
- FR-24: Achievements persisted in localStorage

### 1.10 UI / UX
- FR-25: Loading screen on initial app load
- FR-26: Tutorial mode for first-time players
- FR-27: Game settings screen (timer, difficulty, controls, audio, theme)
- FR-28: Restart confirmation dialog
- FR-29: Multiple visual themes (Classic, Dark, Neon)
- FR-30: Full animations (player movement, dot spawn, particle effects, score pop)

### 1.11 Analytics
- FR-31: Analytics collection deferred to a later phase

---

## 2. Non-Functional Requirements

### 2.1 Performance
- NFR-01: Game loop maintains 60fps on desktop
- NFR-02: FPS and memory usage tracked in-game (debug overlay)
- NFR-03: React state updates throttled to 30fps

### 2.2 Responsiveness
- NFR-04: Fully responsive — Desktop, Tablet, Mobile
- NFR-05: Canvas scales to viewport size

### 2.3 Accessibility
- NFR-06: Basic accessibility — ARIA labels on buttons, keyboard navigable menus
- NFR-07: Sufficient color contrast on all UI elements

### 2.4 Code Quality
- NFR-08: 80% minimum test coverage enforced in CI
- NFR-09: Remove all debug console.log statements
- NFR-10: Eliminate `any` type casting — fully typed codebase
- NFR-11: Centralize all magic numbers into a constants file

### 2.5 Security
- NFR-12: Security extension disabled (game prototype, no backend)

### 2.6 CI/CD
- NFR-13: Automated CI/CD — push to main triggers build, test, deploy to Render

---

## 3. Extension Configuration
- **Security Baseline**: Disabled
- **Property-Based Testing**: Disabled

---

## 4. Out of Scope (This Phase)
- Multiplayer
- Backend / global leaderboard
- Power-ups
- Analytics
