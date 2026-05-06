# Dot Collector Game - Testing Strategy

## Overview
Comprehensive testing strategy for the Dot Collector Game, a browser-based single-player game built with React, TypeScript, and HTML Canvas. This document outlines the approach for validating gameplay mechanics, rendering performance, input handling, and edge cases.

---

## 1. Testing Layers

### Layer 1: Unit Testing (Individual Systems)
**Scope**: Core game logic without React integration
- **GameLoop.ts**: Timer countdown, state transitions, collision detection
- **Player.ts**: Movement updates, boundary clamping, velocity calculations
- **Dot.ts**: Spawn logic, rejection sampling correctness
- **Collision.ts**: Distance calculations, collision flags
- **keyboard.ts**: Input normalization, state polling

**Tools**: Jest, React Testing Library (for hooks)

### Layer 2: Component Testing (React Integration)
**Scope**: UI components render correctly and respond to state changes
- **GameCanvas.tsx**: Canvas rendering, ResizeObserver behavior, subscription handling
- **ScoreBoard.tsx**: Score display, high score rendering
- **Timer.tsx**: Time display, low-time warning styling
- **GameOver.tsx**: Final score display, restart button
- **StartScreen.tsx**: Button interaction, animations

### Layer 3: Integration Testing (Full Game Flow)
**Scope**: Game lifecycle from idle → running → gameOver → idle
- Start game and verify loop begins
- Collect dots and verify score increments
- Timer counts down and triggers game over
- Restart clears state and resumes gameplay

### Layer 4: Manual Testing (Real User Scenarios)
**Scope**: Browser behavior, responsive design, animations
- Game plays smoothly across devices
- Input is responsive
- Visuals are polished
- No console errors

### Layer 5: Performance Testing
**Scope**: Frame rate, memory usage, rendering efficiency
- Maintains 60 FPS during gameplay
- No jank or stuttering
- Canvas resizing doesn't stall game
- Particle cleanup prevents memory leaks

---

## 2. Testing Environments

### Desktop (Primary)
- **Chrome 130+**: Full support, baseline
- **Firefox 132+**: Full support
- **Safari 17+**: Full support (test gradient text rendering)
- **Edge 130+**: Full support

### Tablet
- **iPad**: 1024px and larger breakpoint
- **Android Tablet**: 1024px breakpoint

### Mobile
- **iPhone 12/14/15**: 390px width, 844px height (iOS)
- **Android**: Samsung S21 (360px width)

---

## 3. Test Categories

### Functionality Testing
✓ Game starts and enters running state
✓ Player moves in all 4 cardinal directions
✓ Player moves diagonally with normalized speed
✓ Player stays within canvas bounds
✓ Dots spawn randomly without overlapping player
✓ Dots disappear when collected
✓ Score increments by 1 per dot
✓ Timer counts down each second
✓ Game over triggers at 0 seconds
✓ Restart button resets state
✓ High score persists (if implemented)

### UI/UX Testing
✓ Start screen displays with instructions
✓ Play button transitions to game area
✓ HUD cards have proper styling
✓ Score and timer update in real-time
✓ Game over modal appears with results
✓ Buttons are clickable and responsive
✓ Animations play smoothly

### Responsive Design Testing
✓ Desktop layout (1024px+): 2-column (game + sidebar)
✓ Tablet layout (768-1023px): Stacked with horizontal HUD
✓ Mobile layout (<768px): Full-width with compact HUD
✓ Canvas scales to container width
✓ No horizontal scroll
✓ Touch controls work on mobile

### Performance Testing
✓ Frame rate ≥ 55 FPS during gameplay
✓ No frame drops on dot collection
✓ Canvas resize doesn't freeze game
✓ Memory usage stable over 60s gameplay
✓ No memory leaks after restart

### Edge Case Testing
✓ Rapid direction changes (mashing keys)
✓ Multiple simultaneous key presses
✓ Game pause/resume
✓ Dot spawning never overlaps player
✓ Score doesn't go negative
✓ Timer doesn't go below 0
✓ No division by zero in distance calculations

---

## 4. Test Execution Plan

### Phase 1: Manual Functionality (Day 1)
- [ ] Run through manual testing checklist
- [ ] Test on 3+ browsers
- [ ] Document any unexpected behavior

### Phase 2: Responsive Design (Day 1-2)
- [ ] Test desktop (1920x1080)
- [ ] Test tablet (1024x768)
- [ ] Test mobile (390x844)
- [ ] Test orientation changes
- [ ] Verify no layout breaks

### Phase 3: Performance (Day 2)
- [ ] Monitor FPS with DevTools
- [ ] Check memory heap growth
- [ ] Test during high particle density
- [ ] Monitor during multiple restarts

### Phase 4: Edge Cases (Day 2-3)
- [ ] Spam keyboard inputs
- [ ] Rapid start/pause/restart
- [ ] Window resize during gameplay
- [ ] Tab focus loss and regain

### Phase 5: Final QA (Day 3)
- [ ] Run complete QA checklist
- [ ] Cross-browser verification
- [ ] Mobile device testing
- [ ] Document any issues found

---

## 5. Success Criteria

### Must Pass
- ✓ Game starts without console errors
- ✓ Player movement is smooth and responsive
- ✓ Collision detection is 100% accurate
- ✓ Score updates correctly on dot collection
- ✓ Timer counts down accurately
- ✓ Game over triggers at 0 seconds
- ✓ Restart fully resets game state
- ✓ No memory leaks over multiple playthroughs
- ✓ Responsive design works on desktop, tablet, mobile

### Should Pass
- ✓ Frame rate ≥ 55 FPS consistently
- ✓ Animations are smooth and visual effects are polished
- ✓ Game is playable on all modern browsers
- ✓ Keyboard input is responsive (< 50ms lag)

### Nice to Have
- ✓ High score persistence (localStorage)
- ✓ Sound effects
- ✓ Difficulty scaling

---

## 6. Known Limitations & Testing Notes

### Canvas Rendering
- High-DPI displays scale canvas by devicePixelRatio
- ResizeObserver may not fire immediately; test with explicit resize
- Canvas text may appear blurry on Safari; use canvas drawing for crisp text

### Keyboard Input
- Arrow keys and WASD both work but may conflict on some keyboards
- Mac users may need to disable keyboard repeat for smooth movement
- Touch controls not implemented; mobile users must use keyboard (if available)

### Collision Detection
- Uses squared distance math for efficiency; avoids Math.sqrt
- Circle-rect collision may have 1-2px tolerance
- Overlapping dots should not occur (rejection sampling)

### Game State Machine
- Paused state is not fully implemented (UI shows pause button but logic incomplete)
- State transitions are one-way (idle → running → gameOver → idle)
- No mid-game pause resume

### Animations
- CSS animations disabled if `prefers-reduced-motion` is set
- Particle effects fade over 1 second
- Score popup animation is 0.4 seconds

---

## 7. Browser DevTools Inspection Checklist

### Performance Tab
- [ ] Record 10-second gameplay session
- [ ] Check frame rate chart (should show ~60 FPS constant)
- [ ] Look for frame drops during dot collection
- [ ] Note longest frame duration

### Memory Tab
- [ ] Take heap snapshot at game start
- [ ] Play for 60 seconds
- [ ] Take heap snapshot at game end
- [ ] Verify heap size is similar (no significant growth)
- [ ] Restart game and repeat to detect leaks

### Console
- [ ] No TypeScript errors
- [ ] No React warnings
- [ ] No game logic errors
- [ ] No canvas warnings

### Network Tab
- [ ] No failed requests (game is offline)
- [ ] No large asset loads (CSS, JS)

---

## 8. Common Issues to Watch For

| Issue | Symptom | Root Cause |
|-------|---------|-----------|
| Canvas blur | Canvas text looks pixelated | devicePixelRatio not applied |
| Jank on collection | Frame drop when dot collected | Unoptimized rendering or state update |
| Memory leak | Heap grows after restart | Event listeners not cleaned up |
| Input lag | Keys feel delayed | Keyboard polling not running on-tick |
| Collision miss | Dot not collected when overlapping | Distance calculation error or tolerance issue |
| Score display delay | Score updates 1 frame late | React update throttling too aggressive |
| Layout break mobile | Sidebar overlaps game | CSS media query not triggering |
| Timer desync | Timer shows 0 but game continues | dt integration error or state update miss |

---

## 9. Acceptance Criteria

Before releasing to production:

1. ✓ All manual testing checklist items pass
2. ✓ No console errors across all tested browsers
3. ✓ Frame rate ≥ 55 FPS during full gameplay session
4. ✓ Heap memory stable after multiple restarts
5. ✓ Responsive design verified on 3 screen sizes
6. ✓ All edge cases from validation matrix pass
7. ✓ Game plays for full 60 seconds without issues
8. ✓ QA final checklist 100% complete

---

## 10. Test Automation (Future)

Recommended automated tests to implement:

### Jest Unit Tests
```typescript
describe('Collision Detection', () => {
  test('rectCircleCollision detects overlap', () => { ... });
  test('rectCircleCollision handles exact boundary', () => { ... });
});

describe('Player Movement', () => {
  test('movement is clamped to canvas bounds', () => { ... });
  test('diagonal velocity is normalized', () => { ... });
});

describe('Dot Spawning', () => {
  test('spawn position is within bounds', () => { ... });
  test('spawn does not overlap player', () => { ... });
});

describe('GameLoop', () => {
  test('timer decrements each tick', () => { ... });
  test('game transitions to gameOver at 0 seconds', () => { ... });
});
```

### React Testing Library Tests
```typescript
describe('GameCanvas', () => {
  test('renders canvas element', () => { ... });
  test('canvas updates on loop tick', () => { ... });
});

describe('DotCollectorPage', () => {
  test('StartScreen shows on idle', () => { ... });
  test('GameOver modal appears on gameOver state', () => { ... });
});
```

### Cypress E2E Tests
```javascript
describe('Full Gameplay', () => {
  it('completes a 60-second game without errors', () => { ... });
  it('responsive layout adapts to viewport changes', () => { ... });
});
```

---

## Document History

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | 2026-05-06 | QA Team | Initial testing strategy |

