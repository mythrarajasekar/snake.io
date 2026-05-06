# Dot Collector Game - Edge Case Validation Matrix

## Overview
This document catalogs edge cases, boundary conditions, and stress scenarios for comprehensive testing.

---

## 1. Collision Detection Edge Cases

| Case | Input | Expected Behavior | Priority |
|------|-------|-------------------|----------|
| **Exact Circle Center** | Player center exactly on dot center | Collision detected, dot collected | HIGH |
| **Circle Tangent** | Player touches dot edge tangentially | Collision detected (based on radius overlap) | HIGH |
| **Just Outside Radius** | Player 1px outside collision radius | No collision, dot persists | HIGH |
| **Multiple Dots Nearby** | Player overlapping two dots simultaneously | First dot collected (collision order) | MEDIUM |
| **Rapid Movement** | Player moves fast, could skip over dot | Collision still detected via distance check | HIGH |
| **Player Boundary Dot** | Dot spawns at edge where player touches boundary | Collision works correctly | MEDIUM |

**Test Script**:
```typescript
// Test exact boundary distance
const playerX = 100, playerY = 100, playerRadius = 16;
const dotX = 130, dotY = 100, dotRadius = 8;
const distance = Math.hypot(dotX - playerX, dotY - playerY);
const collides = distance < (playerRadius + dotRadius);
console.assert(collides === true, "Tangent collision failed");

// Test just outside
const dotX2 = 135, dotY2 = 100;
const distance2 = Math.hypot(dotX2 - playerX, dotY2 - playerY);
const collides2 = distance2 < (playerRadius + dotRadius);
console.assert(collides2 === false, "Outside boundary collision should not trigger");
```

---

## 2. Player Movement Boundary Edge Cases

| Case | Input | Expected Behavior | Priority |
|------|-------|-------------------|----------|
| **Corner TL** | Move up + left repeatedly at top-left corner | Player clamps to corner, no clipping | HIGH |
| **Corner TR** | Move up + right repeatedly at top-right corner | Player clamps to corner, no clipping | HIGH |
| **Corner BL** | Move down + left repeatedly at bottom-left corner | Player clamps to corner, no clipping | HIGH |
| **Corner BR** | Move down + right repeatedly at bottom-right corner | Player clamps to corner, no clipping | HIGH |
| **Negative X** | Player x position goes < 0 | Clamped to playerRadius (no negative) | HIGH |
| **Negative Y** | Player y position goes < 0 | Clamped to playerRadius (no negative) | HIGH |
| **Over Max X** | Player x position goes > canvasWidth | Clamped to canvasWidth - playerRadius | HIGH |
| **Over Max Y** | Player y position goes > canvasHeight | Clamped to canvasHeight - playerRadius | HIGH |

**Test Script**:
```typescript
const bounds = { x: 0, y: 0, width: 800, height: 600 };
const player = { x: -10, y: 300, width: 32, height: 32 };
const clampX = Math.max(player.width / 2, Math.min(player.x, bounds.width - player.width / 2));
console.assert(clampX === 16, `Expected 16, got ${clampX}`);
```

---

## 3. Keyboard Input Edge Cases

| Case | Input | Expected Behavior | Priority |
|------|-------|-------------------|----------|
| **Rapid Fire** | Mash arrow key 100x in 1 second | No input buffering, player moves smoothly | MEDIUM |
| **Opposite Directions** | Press up then down simultaneously | Most recent wins or both cancel (no diagonal) | MEDIUM |
| **4 Simultaneous Keys** | Press up+down+left+right at once | Game doesn't crash, movement logical | LOW |
| **Non-Game Key** | Press random key (e.g., 'Z') | Game ignores, no error | LOW |
| **Key Held After Game Over** | Hold key, game ends, keep holding | Game stops responding, movement ceases | MEDIUM |
| **Key Held Across Restart** | Hold key during restart, release after | New game handles key state correctly | MEDIUM |
| **Keyboard Focus Lost** | Alt+Tab or click outside game, keep holding key | Game detects focus loss, keyboard resets | HIGH |
| **Tab Focus Regained** | Alt+Tab back to game | Keyboard input resumes correctly | HIGH |

**Test Script**:
```typescript
// Simulate rapid input
const inputStates = [];
for (let i = 0; i < 100; i++) {
  keyboard.pressKey('ArrowUp');
  keyboard.releaseKey('ArrowUp');
  inputStates.push(keyboard.getState());
}
// Verify no accumulated state
const finalState = keyboard.getState();
console.assert(finalState.up === false, "Key should be released");
```

---

## 4. Game State Transition Edge Cases

| Case | Input | Expected Behavior | Priority |
|------|-------|-------------------|----------|
| **Rapid Start/Stop** | Click Start, then Stop immediately | Game pauses (if pause implemented) | MEDIUM |
| **Restart Before Timer Ends** | Click Restart during gameplay | Game restarts, timer resets | HIGH |
| **Restart at 0.1 Seconds** | Game over is about to trigger, click Restart | Game transitions cleanly to new state | MEDIUM |
| **Restart During Particle Fade** | Restart while particles animating | Old particles cleared, new game clean | MEDIUM |
| **Two Start Clicks** | Click Start button twice quickly | Debounced or ignored, single game starts | MEDIUM |
| **Start While Running** | Click Start button while game running | Button disabled or ignored | HIGH |

**Test Script**:
```typescript
// Test state transitions
loop.reset(newState);
loop.start();
setTimeout(() => {
  loop.reset(anotherState);
  loop.start();
}, 100);
// Verify clean transition, no state corruption
```

---

## 5. Timer Countdown Edge Cases

| Case | Input | Expected Behavior | Priority |
|------|-------|-------------------|----------|
| **Exact 0 Seconds** | Timer reaches exactly 0.0 | Game over triggers immediately | HIGH |
| **Negative Timer** | Subtract past 0 seconds | Timer stays at 0, doesn't go negative | HIGH |
| **Timer Desync** | dt varies due to frame skip | Timer still accurate within ±50ms over 60s | MEDIUM |
| **Very High DT** | Single frame takes 500ms | Timer still only decrements that amount | MEDIUM |
| **60 Second Duration** | Measure exact time for full 60s | Tolerance ±1 second (game runs ~60s) | HIGH |
| **Restart During Low Time** | Restart at 3 seconds left | New game starts with full 60s timer | HIGH |

**Test Script**:
```typescript
// Measure timer accuracy
const startTime = Date.now();
let finalScore = 0;
const checkTimer = setInterval(() => {
  const elapsed = (Date.now() - startTime) / 1000;
  if (elapsed > 60) {
    clearInterval(checkTimer);
    const tolerance = Math.abs(60 - elapsed);
    console.assert(tolerance < 1, `Timer off by ${tolerance}s`);
  }
}, 100);
```

---

## 6. Score Calculation Edge Cases

| Case | Input | Expected Behavior | Priority |
|------|-------|-------------------|----------|
| **Score 0** | Start game | Score shows as "0", not blank or undefined | HIGH |
| **Score 1** | Collect 1 dot | Score = 1 | HIGH |
| **Score 255** | Collect 255 dots (maximum in 60s unlikely) | Score displays correctly (no overflow) | LOW |
| **Rapid Collection** | Collect 5 dots in 1 second | Score increments to 5, all updates visible | MEDIUM |
| **Score Never Negative** | Any collision code | Score always ≥ 0 | HIGH |
| **Score Doesn't Skip** | Collect dots steadily | Score increments by exactly 1 each time | HIGH |

**Test Script**:
```typescript
// Verify score increments correctly
for (let i = 1; i <= 20; i++) {
  simulateDotCollection();
  console.assert(gameState.score === i, `Expected ${i}, got ${gameState.score}`);
}
```

---

## 7. Dot Spawning Edge Cases

| Case | Input | Expected Behavior | Priority |
|------|-------|-------------------|----------|
| **Spawn Within Bounds** | Any spawn event | Dot x and y always within [0, width] and [0, height] | HIGH |
| **No Player Overlap** | Spawn dot 100 times | Never overlaps player initial position | HIGH |
| **Rejection Sampling** | Force spawn with very full player area | Rejection sampling exhausts 12 attempts, still spawns valid | MEDIUM |
| **Spawn After Collection** | Collect dot | New dot spawns immediately (not delayed) | HIGH |
| **Multiple Restarts** | Restart 5 times | Spawning is fresh each time, no accumulated state | MEDIUM |
| **Spawn Distribution** | Collect 50 dots, map positions | Spawn positions vary across full canvas (not clumped) | MEDIUM |

**Test Script**:
```typescript
// Test rejection sampling bounds
let allValid = true;
for (let i = 0; i < 100; i++) {
  const dot = Dot.spawnRandom(i, bounds, player);
  const inBounds = dot.x > 0 && dot.x < bounds.width && dot.y > 0 && dot.y < bounds.height;
  const noOverlap = Math.hypot(dot.x - player.x, dot.y - player.y) > 25;
  allValid = allValid && inBounds && noOverlap;
}
console.assert(allValid, "Dot spawn validation failed");
```

---

## 8. Canvas Rendering Edge Cases

| Case | Input | Expected Behavior | Priority |
|------|-------|-------------------|----------|
| **High DPI Display** | Run on 2x DPI display (e.g., Mac Retina) | Canvas scales by devicePixelRatio, remains sharp | MEDIUM |
| **Window Resize** | Drag window to change size | Canvas resizes smoothly, game continues | HIGH |
| **Extreme Window Size** | Resize to 200x200 or 4K | Canvas scales appropriately, game remains playable | LOW |
| **ResizeObserver Lag** | Resize quickly multiple times | ResizeObserver handles all resize events | MEDIUM |
| **Canvas Context Lost** | (Browser edge case) Canvas context lost | Recovery or error message shown | LOW |
| **Particle Overdraw** | Spawn many particles simultaneously | Performance stays smooth (no jank from particles) | MEDIUM |

**Test Script**:
```typescript
// Verify high-DPI scaling
const canvas = document.getElementById('dcg-canvas');
const rect = canvas.getBoundingClientRect();
console.assert(canvas.width === rect.width * devicePixelRatio, "DPI scaling failed");
```

---

## 9. Animation & Transition Edge Cases

| Case | Input | Expected Behavior | Priority |
|------|-------|-------------------|----------|
| **Rapid Animation Start/Stop** | Start, stop, start game rapidly | Animations don't accumulate or stutter | MEDIUM |
| **prefers-reduced-motion** | Set OS to reduce motion | Animations disable, game still fully playable | HIGH |
| **Animation During Low Frame Rate** | Gameplay with low FPS | Animations degrade gracefully, no hard stops | LOW |
| **CSS Animation Completion** | CSS keyframe completes | Element returns to final state without jump | MEDIUM |

---

## 10. Game Loop Timing Edge Cases

| Case | Input | Expected Behavior | Priority |
|------|-------|-------------------|----------|
| **Frame Skip** | Browser throttles frame (100ms delay) | Game loop handles large dt correctly | MEDIUM |
| **requestAnimationFrame Delay** | Browser schedules rAF late | Game logic still correct, frame rate info accurate | MEDIUM |
| **Tab Hidden** | Alt+Tab to other tab, come back | Game pauses (browser throttles rAF), resumes correctly | HIGH |
| **CPU Throttle** | Run heavy background task | Game handles reduced frame rate | LOW |

---

## 11. Memory & Performance Edge Cases

| Case | Input | Expected Behavior | Priority |
|------|-------|-------------------|----------|
| **No Memory Leak on Restart** | Restart 10 times | Heap memory returns to baseline | HIGH |
| **Particle Cleanup** | Collect 100 dots rapidly | Old particles cleaned up, not accumulated | HIGH |
| **Event Listener Cleanup** | Restart multiple times | Old listeners removed, no duplicate handlers | MEDIUM |
| **Long Gameplay Session** | Play for 5 minutes straight (repeat restarts) | Memory stable, no gradual increase | MEDIUM |

**Test Script**:
```typescript
// Check for memory leaks
async function testMemory() {
  const heap1 = performance.memory.usedJSHeapSize;
  for (let i = 0; i < 10; i++) {
    gameStart();
    await delay(100);
    gameRestart();
  }
  gc(); // Force garbage collection (Chrome DevTools)
  const heap2 = performance.memory.usedJSHeapSize;
  console.assert(Math.abs(heap2 - heap1) < 5e6, "Potential memory leak detected"); // 5MB tolerance
}
```

---

## 12. Responsive Design Edge Cases

| Case | Input | Expected Behavior | Priority |
|------|-------|-------------------|----------|
| **Exact Breakpoint** | Window size exactly 1024px | Layout transitions smoothly | MEDIUM |
| **Fractional Pixel** | Window size 1024.5px | CSS handles fractional pixels gracefully | LOW |
| **Mobile Zoom** | User pinch-zooms on mobile | Game remains playable, canvas scales | MEDIUM |
| **Viewport Meta Tag** | Mobile viewport set | Mobile layout applies correctly | HIGH |
| **Print Media Query** | Print page (Ctrl+P) | Print layout or warning shown | LOW |

---

## 13. Browser DevTools & Debugging Edge Cases

| Case | Input | Expected Behavior | Priority |
|------|-------|-------------------|----------|
| **DevTools Open** | Open DevTools while playing | Game continues, no performance drop | LOW |
| **Throttling** | DevTools CPU throttling 4x | Game still playable, frame rate reduced | LOW |
| **Network Throttle** | Set network to slow 3G | Game unaffected (offline) | LOW |
| **Source Breakpoint** | Set breakpoint in game loop | Game pauses at breakpoint, resumes correctly | LOW |

---

## 14. Cross-Browser Edge Cases

| Browser | Edge Case | Expected | Priority |
|---------|-----------|----------|----------|
| Safari | Gradient text rendering | Text gradient applies correctly | MEDIUM |
| Firefox | `prefers-reduced-motion` | Animations respect user preference | MEDIUM |
| Edge | Canvas high-DPI | Canvas scales correctly on Surface devices | LOW |
| Chrome | Disk cache | Game loads from cache, works offline | LOW |

---

## 15. Unusual Input Combinations

| Case | Steps | Expected Behavior | Priority |
|------|-------|-------------------|----------|
| **Hold key, resize window, release key** | 1. Hold arrow, 2. Resize window, 3. Release key | Player movement and resizing work independently | LOW |
| **Restart while key held** | 1. Hold key, 2. Click restart | New game ignores old key state | MEDIUM |
| **Multiple browser tabs** | 1. Play game, 2. Open new tab, 3. Switch back | Original tab game resumes correctly | MEDIUM |
| **Browser back/forward** | 1. Play game, 2. Click back button | Page reloads, game restarts fresh | LOW |

---

## Test Execution Plan

### Priority 1: HIGH (Must Pass)
- Collision detection accuracy (exact boundary, just outside)
- Player boundary clamping (all 4 corners, all 4 edges)
- Score calculation (never negative, increments by 1)
- Dot spawning (always in bounds, never overlaps player)
- Timer accuracy (reaches exactly 0, doesn't go negative)
- Game over transition (triggers cleanly)
- Restart flow (state fully resets)
- Canvas rendering (high DPI, resizing)
- Keyboard focus (loses/regains correctly)
- Memory leaks (heap stable after restarts)

### Priority 2: MEDIUM (Should Pass)
- Input stress (rapid fire, simultaneous keys)
- Frame timing (large dt, skip handling)
- Animation handling (rapid transitions)
- Responsive breakpoints (exact pixel values)
- Browser DevTools usage (breakpoints, throttling)

### Priority 3: LOW (Nice to Pass)
- Extreme window sizes
- Print media
- Network throttling
- Unusual input combinations

---

## Documentation

| Test | Result | Date | Notes |
|------|--------|------|-------|
| Collision Detection | ☐ | | |
| Boundary Clamping | ☐ | | |
| Keyboard Input | ☐ | | |
| Game State Transitions | ☐ | | |
| Timer Accuracy | ☐ | | |
| Score Calculation | ☐ | | |
| Dot Spawning | ☐ | | |
| Canvas Rendering | ☐ | | |
| Memory/Performance | ☐ | | |
| Responsive Design | ☐ | | |

