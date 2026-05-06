# Dot Collector Game - Bug Detection & Known Issues Checklist

## Purpose
This document catalogs common bugs to watch for during testing and provides reproduction steps for quick verification.

---

## 1. Rendering Bugs

### Bug #1: Canvas Blur on High-DPI Displays
**Symptom**: Canvas appears pixelated or blurry on Retina/4K displays
**Root Cause**: devicePixelRatio not applied to canvas dimensions
**Severity**: MEDIUM
**Reproduction**:
1. Load game on MacBook Pro or iPad with Retina display
2. Observe canvas rendering
3. Player and dots appear pixelated

**Check Code**:
```typescript
// In GameCanvas.tsx, verify:
canvas.width = rect.width * devicePixelRatio;
canvas.height = rect.height * devicePixelRatio;
ctx.scale(devicePixelRatio, devicePixelRatio);
```

**Fix**:
- Ensure canvas dimensions are multiplied by `devicePixelRatio`
- Scale context for proper rendering

---

### Bug #2: Canvas Doesn't Resize on Window Resize
**Symptom**: Game canvas doesn't adapt when window is resized
**Root Cause**: ResizeObserver not triggered or canvas ref not updated
**Severity**: HIGH
**Reproduction**:
1. Start game
2. Drag window corner to resize
3. Canvas should resize but doesn't

**Check Code**:
```typescript
// Verify ResizeObserver is set up:
new ResizeObserver((entries) => {
  for (const entry of entries) {
    handleResize(entry.target as HTMLCanvasElement);
  }
}).observe(containerRef.current);
```

**Fix**:
- Ensure ResizeObserver callback updates canvas width/height
- Test with explicit container size change

---

### Bug #3: Particles Don't Fade Out
**Symptom**: Particle effects remain visible or don't disappear
**Root Cause**: Particle lifecycle not removing expired particles
**Severity**: MEDIUM
**Reproduction**:
1. Collect 20 dots rapidly
2. Observe particles
3. Old particles should fade and disappear after ~1 second

**Check Code**:
```typescript
// In GameLoop.ts, verify particle cleanup:
particles = particles.filter(p => p.lifespan > 0);
particles.forEach(p => {
  p.lifespan -= dt;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
});
```

**Fix**:
- Verify particle lifespan decreases and particles are removed when lifespan ≤ 0
- Check particle rendering opacity calculation

---

### Bug #4: Text Rendering Blurry in Safari
**Symptom**: Score, timer, and text labels appear blurry on Safari
**Root Cause**: Safari canvas text rendering, or font anti-aliasing issue
**Severity**: LOW
**Reproduction**:
1. Open game in Safari on macOS
2. Look at text elements
3. Text appears fuzzy

**Fix**:
- Use HTML text instead of canvas text for HUD
- OR set canvas context properties for sharper text:
  ```typescript
  ctx.imageSmoothingEnabled = false;
  ```

---

## 2. Collision Detection Bugs

### Bug #5: Dots Not Collecting
**Symptom**: Player overlaps dot but it doesn't collect
**Root Cause**: Distance calculation error, or wrong collision radius
**Severity**: CRITICAL
**Reproduction**:
1. Start game
2. Move player directly onto dot
3. Dot should disappear but doesn't

**Check Code**:
```typescript
// Verify collision formula in Collision.ts:
const distance = Math.hypot(dot.x - player.x, dot.y - player.y);
return distance < (player.width / 2 + dot.radius);
```

**Fix**:
- Verify collision radii are correct (player width/2, dot radius)
- Test with console logging distance values
- Ensure collision check runs every frame

---

### Bug #6: Collision Misses Edge Cases
**Symptom**: Dot sometimes not collected even when clearly overlapping
**Root Cause**: Collision tolerance too strict, or floating-point precision
**Severity**: HIGH
**Reproduction**:
1. Collect dots near canvas edges
2. Some dots at exact boundary don't collect
3. Inconsistent behavior

**Check Code**:
```typescript
// Consider adding small tolerance:
return distance < (player.width / 2 + dot.radius + 1); // +1px tolerance
```

**Fix**:
- Add 1-2 pixel tolerance to collision detection
- Use squared distance to avoid sqrt precision issues:
  ```typescript
  const distSq = (dot.x - player.x) ** 2 + (dot.y - player.y) ** 2;
  const radiusSq = (player.width / 2 + dot.radius) ** 2;
  return distSq < radiusSq;
  ```

---

### Bug #7: Multiple Dots Collected Simultaneously
**Symptom**: Collecting one dot also collects nearby dots
**Root Cause**: Collision check on multiple dots, not just closest
**Severity**: MEDIUM
**Reproduction**:
1. Force spawn two dots close together (modify spawn code)
2. Move player to overlap both
3. Both dots should collect (or only one?)

**Expected**: Only one dot collects per frame (closest one)

**Fix**:
```typescript
// Check only closest dot:
let closestDot = null;
let closestDist = Infinity;
for (const dot of dots) {
  const dist = Math.hypot(dot.x - player.x, dot.y - player.y);
  if (dist < closestDist) {
    closestDist = dist;
    closestDot = dot;
  }
}
if (closestDot && closestDist < (player.width / 2 + closestDot.radius)) {
  collectDot(closestDot);
}
```

---

## 3. Player Movement Bugs

### Bug #8: Player Clipping Through Boundaries
**Symptom**: Player moves outside canvas bounds
**Root Cause**: Boundary clamping not applied, or applied after movement
**Severity**: CRITICAL
**Reproduction**:
1. Move player to edge
2. Hold arrow key to move beyond edge
3. Player should stop at edge but moves outside

**Check Code**:
```typescript
// Verify in Player.ts updateFromInput:
player.x = Math.max(player.width / 2, Math.min(player.x + vx * dt, bounds.width - player.width / 2));
player.y = Math.max(player.height / 2, Math.min(player.y + vy * dt, bounds.height - player.height / 2));
```

**Fix**:
- Apply clamping AFTER movement update
- Test all 4 corners and edges

---

### Bug #9: Diagonal Movement Faster Than Cardinal
**Symptom**: Pressing up+right moves player faster than just up
**Root Cause**: Velocity not normalized on diagonal
**Severity**: MEDIUM
**Reproduction**:
1. Move right only → measure distance traveled in 1 second
2. Move up+right → measure distance traveled in 1 second
3. Up+right should be same speed as right only

**Check Code**:
```typescript
// Verify normalization in Player.ts:
const speed = Math.hypot(input.left + input.right, input.up + input.down);
if (speed > 0) {
  vx = (input.right - input.left) / speed;
  vy = (input.down - input.up) / speed;
}
```

**Fix**:
- Use `Math.hypot()` to calculate vector magnitude
- Divide velocity components by magnitude to normalize

---

### Bug #10: Input Lag
**Symptom**: Player moves delayed after key press (>50ms lag)
**Root Cause**: Keyboard input not being polled every frame
**Severity**: HIGH
**Reproduction**:
1. Press arrow key
2. Observe delay before player moves
3. Should be instant (< 16ms)

**Check Code**:
```typescript
// Verify keyboard polling happens on every tick:
const input = keyboard.getState();
player.updateFromInput(input, dt, bounds);
```

**Fix**:
- Ensure `keyboard.getState()` is called in game loop tick
- Verify keyboard listeners are active

---

## 4. Game State Bugs

### Bug #11: Timer Doesn't Countdown
**Symptom**: Timer shows "01:00" but doesn't change
**Root Cause**: Timer not being updated, or dt not passed correctly
**Severity**: CRITICAL
**Reproduction**:
1. Start game
2. Wait 5 seconds
3. Timer should show "00:55" but shows "01:00"

**Check Code**:
```typescript
// Verify in GameLoop.ts:
gameState.timeLeft -= dt;
if (gameState.timeLeft <= 0) {
  gameState.status = 'gameOver';
}
```

**Fix**:
- Ensure dt (deltaTime) is calculated correctly from timestamps
- Verify timer update is in main tick loop
- Test with browser console: `console.log(gameState.timeLeft)`

---

### Bug #12: Game Doesn't End at 0 Seconds
**Symptom**: Timer reaches 0 but game continues
**Root Cause**: Game over check not triggered or state not updated
**Severity**: CRITICAL
**Reproduction**:
1. Play until timer reaches "00:00"
2. Game should end immediately
3. But game continues

**Fix**:
```typescript
// Ensure game over check in tick:
if (gameState.timeLeft <= 0 && gameState.status === 'running') {
  gameState.status = 'gameOver';
}
```

---

### Bug #13: Score Goes Negative
**Symptom**: Score shows negative number (e.g., "-5")
**Root Cause**: Score calculation allows subtraction
**Severity**: MEDIUM
**Reproduction**:
1. (Likely won't happen naturally, but check code)

**Check Code**:
```typescript
// Ensure score only increases:
gameState.score += 1; // Never subtract
console.assert(gameState.score >= 0, "Score is negative!");
```

**Fix**:
- Ensure score only increases (`+=` not `-=`)
- Validate score ≥ 0 on state updates

---

### Bug #14: Restart Doesn't Reset State
**Symptom**: After restart, old state persists (score shows old value)
**Root Cause**: State not fully cleared, or old references retained
**Severity**: HIGH
**Reproduction**:
1. Play game, collect 10 dots (score = 10)
2. Game over, click Restart
3. Score should reset to 0 but shows 10

**Check Code**:
```typescript
// Verify complete state reset in DotCollectorPage.tsx:
function createInitialState(): GameState {
  return {
    player: { x: width / 2, y: height / 2, ... },
    dots: [],
    particles: [],
    score: 0,
    timeLeft: 60,
    status: 'idle',
  };
}

const fresh = createInitialState();
loop.reset(fresh);
```

**Fix**:
- Call `createInitialState()` on restart
- Pass fresh state to `loop.reset()`
- Verify all properties reset in useGameLoop hook

---

## 5. Dot Spawning Bugs

### Bug #15: Dots Spawn on Player
**Symptom**: New dot appears overlapping player position
**Root Cause**: Rejection sampling not working, or player position wrong
**Severity**: MEDIUM
**Reproduction**:
1. Collect dots repeatedly
2. Watch for dots that spawn directly on player
3. Should never happen (or rare with rejection sampling)

**Check Code**:
```typescript
// In Dot.ts, verify rejection sampling:
static spawnRandom(id: number, bounds: Bounds, player?: PlayerState, radius: number = 8): DotState {
  for (let attempt = 0; attempt < 12; attempt++) {
    const x = randomBetween(radius, bounds.width - radius);
    const y = randomBetween(radius, bounds.height - radius);
    if (!player || Math.hypot(x - player.x, y - player.y) > 30) {
      return { id, x, y, radius };
    }
  }
  // Fallback if rejection sampling exhausted
  return { id, x: bounds.width / 2, y: bounds.height / 2, radius };
}
```

**Fix**:
- Verify player distance check: `Math.hypot(...) > 30` (30px buffer)
- Test with multiple rapid collections

---

### Bug #16: Dots Spawn Outside Bounds
**Symptom**: Dot appears partially or fully outside canvas
**Root Cause**: Spawn position calculation doesn't account for dot radius
**Severity**: MEDIUM
**Reproduction**:
1. Collect many dots
2. Watch for dots appearing at edges
3. Dots should always be fully within bounds

**Check Code**:
```typescript
// Verify bounds check includes radius:
const x = randomBetween(radius, bounds.width - radius);
const y = randomBetween(radius, bounds.height - radius);
```

**Fix**:
- Add `radius` to min bound
- Subtract `radius` from max bound

---

## 6. UI/Animation Bugs

### Bug #17: Start Screen Doesn't Disappear
**Symptom**: Click "Play" but start screen modal stays visible
**Root Cause**: Click handler not firing, or state not updating
**Severity**: HIGH
**Reproduction**:
1. Load page
2. Click "Play" button
3. Start screen should hide, game should appear

**Check Code**:
```typescript
// In StartScreen.tsx:
<button onClick={onPlay} ...>Play</button>

// In DotCollectorPage.tsx:
{isIdle && <StartScreen onPlay={handleStart} ... />}
```

**Fix**:
- Verify `onPlay` callback is connected to `handleStart`
- Verify `isIdle` check is working (check `displayState.status`)

---

### Bug #18: Game Over Modal Doesn't Appear
**Symptom**: Timer reaches 0 but game over modal doesn't show
**Root Cause**: Condition check wrong, or component not rendered
**Severity**: HIGH
**Reproduction**:
1. Start game, wait 60 seconds
2. Game over modal should appear with final score
3. But modal doesn't appear

**Check Code**:
```typescript
// In DotCollectorPage.tsx:
{isGameOver && (
  <div className="dcg-gameover-overlay">
    <GameOver ... />
  </div>
)}
```

**Fix**:
- Verify `isGameOver` check (should be `status === 'gameOver'`)
- Ensure game state updates properly on timer end

---

### Bug #19: Score Display Doesn't Update
**Symptom**: Score shows "0" even after collecting dots
**Root Cause**: React not re-rendering, or state not being passed
**Severity**: CRITICAL
**Reproduction**:
1. Start game
2. Collect a dot
3. Score in HUD should show "1" but stays "0"

**Check Code**:
```typescript
// In DotCollectorPage.tsx:
<ScoreBoard score={displayState.score} />

// Verify useGameLoop updates displayState:
useEffect(() => {
  setDisplayState(gameState);
}, [gameState]);
```

**Fix**:
- Verify `gameState` changes trigger re-render
- Check `setDisplayState` is called
- Test console logging: `console.log(displayState.score)`

---

### Bug #20: Timer Display Wrong Format
**Symptom**: Timer shows "1:0" instead of "01:00"
**Root Cause**: String padding not applied correctly
**Severity**: LOW
**Reproduction**:
1. Start game
2. Check timer display
3. Should always show MM:SS with leading zeros

**Check Code**:
```typescript
// In Timer.tsx:
const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
const ss = Math.floor(seconds % 60).toString().padStart(2, '0');
```

**Fix**:
- Verify `padStart(2, '0')` is applied to both mm and ss

---

## 7. Performance Bugs

### Bug #21: Frame Rate Drops on Dot Collection
**Symptom**: Noticeable jank/stutter when collecting dot
**Root Cause**: Unoptimized rendering or state update, particles cause spike
**Severity**: MEDIUM
**Reproduction**:
1. Chrome DevTools → Performance tab
2. Record gameplay, collect dots
3. Check for frame drop spikes

**Check Code**:
```typescript
// Verify particle rendering is efficient:
particles.forEach(p => {
  drawParticle(ctx, p); // Should be O(n), not O(n²)
});
```

**Fix**:
- Profile with DevTools
- Move expensive calculations out of render loop
- Consider object pooling for particles

---

### Bug #22: Memory Leak on Restart
**Symptom**: Heap memory grows after each restart
**Root Cause**: Event listeners not cleaned up, old state retained
**Severity**: HIGH
**Reproduction**:
1. Chrome DevTools → Memory
2. Take heap snapshot: ~12 MB
3. Restart game 5 times
4. Take heap snapshot: Should be ~12 MB, but is ~20+ MB

**Check Code**:
```typescript
// In useGameLoop, verify cleanup:
useEffect(() => {
  return () => {
    loop.stop(); // Cleans up listeners
  };
}, []);
```

**Fix**:
- Ensure keyboard listeners are removed in `keyboard.stopListening()`
- Verify old GameLoop instances are garbage collected
- Use Chrome DevTools to check for detached DOM nodes

---

### Bug #23: Animations Don't Play Smoothly
**Symptom**: CSS animations have stuttering or jank
**Root Cause**: Animation duration too long, or expensive properties animated
**Severity**: MEDIUM
**Reproduction**:
1. Record DevTools Performance during animations
2. Look for dropped frames during scale/slide animations
3. Animations should be smooth

**Check Code**:
```css
/* Verify GPU-accelerated properties are used: */
@keyframes slideUp {
  from { transform: translateY(20px); }  /* Good: transform */
  to { transform: translateY(0); }
}

/* Bad: animating top/left */
@keyframes slideUp-bad {
  from { top: 20px; }  /* Avoid: triggers layout */
  to { top: 0; }
}
```

**Fix**:
- Use `transform` and `opacity` for animations (GPU accelerated)
- Avoid animating `top`, `left`, `width`, `height` (causes layout recalc)

---

## 8. Keyboard Input Bugs

### Bug #24: Keys Not Responding
**Symptom**: Press arrow key but player doesn't move
**Root Cause**: Keyboard listeners not active, or game loop not polling input
**Severity**: CRITICAL
**Reproduction**:
1. Start game
2. Press arrow key
3. Player should move immediately

**Check Code**:
```typescript
// Verify keyboard listeners start:
if (gameState.status === 'running') {
  keyboard.startListening();
}
```

**Fix**:
- Ensure `keyboard.startListening()` is called on game start
- Test with console: `console.log(keyboard.getState())`

---

### Bug #25: Input Reverses Direction
**Symptom**: Press right but player moves left (or vice versa)
**Root Cause**: Input mapping reversed, or coordinate system wrong
**Severity**: HIGH
**Reproduction**:
1. Press arrow right
2. Player moves left
3. Inputs are reversed

**Check Code**:
```typescript
// Verify input mapping in Player.ts:
const vx = (input.right - input.left) * speed;  // right > left
const vy = (input.down - input.up) * speed;      // down > up
```

**Fix**:
- Check direction calculation
- Test each direction individually

---

## 9. Responsive Design Bugs

### Bug #26: Layout Breaks on Mobile
**Symptom**: Game area overlaps HUD sidebar on mobile
**Root Cause**: CSS media query not triggering, or breakpoint wrong
**Severity**: MEDIUM
**Reproduction**:
1. Set viewport to 390x844 (mobile)
2. Observe layout
3. Should stack vertically, not overlap

**Check Code**:
```css
/* Verify mobile breakpoint: */
@media (max-width: 768px) {
  .dcg-container {
    flex-direction: column;  /* Stack vertically */
  }
}
```

**Fix**:
- Check CSS media query breakpoint is correct
- Verify `flex-direction: column` is applied
- Test with DevTools Device Emulation

---

### Bug #27: Canvas Doesn't Resize on Orientation Change
**Symptom**: Rotate device but canvas doesn't adapt
**Root Cause**: ResizeObserver not firing on orientation change
**Severity**: MEDIUM
**Reproduction**:
1. Play on tablet in portrait
2. Rotate to landscape
3. Canvas should resize to fill new width

**Fix**:
- ResizeObserver should fire on orientation change
- Test with Chrome DevTools device rotation

---

## 10. Console & Error Bugs

### Bug #28: Console Errors
**Symptom**: Errors appear in browser console
**Root Cause**: TypeScript errors, undefined values, or invalid operations
**Severity**: Varies (CRITICAL if breaks functionality)
**Check**:
1. Open DevTools Console (F12)
2. Play game for 60 seconds
3. Should be no errors

**Common Errors to Watch For**:
```javascript
// Cannot read property 'x' of undefined
if (!dot) return; // Add guard

// Division by zero
const speed = vector.length; // Ensure > 0

// Array index out of bounds
if (index >= array.length) return; // Check bounds
```

---

## Test Execution Checklist

Run through these bugs during testing:

### Critical (Block Release)
- [ ] Bug #5: Dots not collecting
- [ ] Bug #8: Player clipping through boundaries
- [ ] Bug #11: Timer doesn't countdown
- [ ] Bug #12: Game doesn't end at 0 seconds
- [ ] Bug #17: Start screen doesn't disappear
- [ ] Bug #18: Game over modal doesn't appear
- [ ] Bug #19: Score display doesn't update
- [ ] Bug #24: Keys not responding

### High (Should Fix)
- [ ] Bug #1: Canvas blur on high-DPI
- [ ] Bug #6: Collision misses
- [ ] Bug #9: Diagonal movement faster
- [ ] Bug #10: Input lag
- [ ] Bug #14: Restart doesn't reset
- [ ] Bug #22: Memory leak on restart
- [ ] Bug #26: Layout breaks on mobile

### Medium (Nice to Fix)
- [ ] Bug #2: Canvas doesn't resize
- [ ] Bug #3: Particles don't fade
- [ ] Bug #7: Multiple dots collected
- [ ] Bug #13: Score goes negative
- [ ] Bug #15: Dots spawn on player
- [ ] Bug #21: Frame drop on collection
- [ ] Bug #23: Animations stutter
- [ ] Bug #27: Canvas doesn't resize on rotation

### Low (Polish)
- [ ] Bug #4: Text blurry in Safari
- [ ] Bug #16: Dots outside bounds
- [ ] Bug #20: Timer format wrong
- [ ] Bug #25: Input reverses
- [ ] Bug #28: Console errors

---

## Bug Report Template

```markdown
## Bug Report: [Title]

**Severity**: [CRITICAL/HIGH/MEDIUM/LOW]

### Reproduction Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Result
[What should happen]

### Actual Result
[What actually happened]

### Screenshots/Videos
[Attach if available]

### Environment
- Browser: [Name] [Version]
- Device: [Model]
- Viewport: [Size]

### Console Error (if any)
[Paste console error]

### Additional Notes
[Any other relevant info]
```

