# Dot Collector Game - Performance Testing Plan

## Objective
Ensure the Dot Collector Game maintains 60 FPS during gameplay, scales efficiently across devices, and has no memory leaks.

---

## 1. Frame Rate Testing

### 1.1 Desktop Performance Baseline

**Setup**:
- Browser: Chrome 130+
- Device: MacBook Pro (2023) or equivalent
- Viewport: 1920x1080
- Network: Offline

**Test Cases**:

| Scenario | Expected FPS | Tolerance | Pass Criteria |
|----------|--------------|-----------|---------------|
| Idle (menu screen) | 60 FPS | ±2 | ≥58 FPS |
| Gameplay (no dots collected) | 60 FPS | ±2 | ≥58 FPS |
| Collect 1 dot | 60 FPS | ±5 | ≥55 FPS (particle spike) |
| Rapid collection (5 dots/sec) | 60 FPS | ±5 | ≥55 FPS |
| High density particles | 60 FPS | ±8 | ≥52 FPS (acceptable minimum) |

**Execution**:
```javascript
// In Chrome DevTools Console
const fps = [];
let lastTime = performance.now();
let frameCount = 0;

const measureFPS = () => {
  const now = performance.now();
  const delta = now - lastTime;
  if (delta >= 1000) {
    fps.push(frameCount);
    console.log(`${frameCount} FPS`);
    frameCount = 0;
    lastTime = now;
  }
  frameCount++;
  requestAnimationFrame(measureFPS);
};

// Run for 60 seconds during gameplay
measureFPS();
setTimeout(() => {
  const avgFPS = fps.reduce((a, b) => a + b) / fps.length;
  console.log(`Average FPS: ${avgFPS}`);
}, 60000);
```

### 1.2 Performance Metrics Collection

**Chrome DevTools → Performance Tab**:

1. Open DevTools (F12)
2. Go to Performance tab
3. Click "Record" button
4. Start game, play for 30 seconds, collect ~10 dots
5. Stop recording
6. Analyze:
   - **Frame Rate Chart**: Should be consistently at 60 FPS (green bars)
   - **Main Thread**: Identify any long tasks (> 16.7ms = 1 frame)
   - **FPS Counter**: Show in top-right (DevTools Settings → Rendering)

**Key Metrics**:
- `Frames per second`: ≥55 FPS
- `Average frame duration`: ≤18ms
- `Longest frame`: ≤50ms
- `Time to First Paint`: < 100ms
- `Time to Interactive`: < 500ms

### 1.3 Frame Drop Detection

**What to watch for**:
- **Jank**: Sudden frame drop when collecting dots (particles spawn)
- **Stutter**: Inconsistent frame timing during movement
- **Lag**: Input delays > 50ms

**Testing**:
```javascript
// Monitor frame drop
let prevTime = performance.now();
let maxFrameTime = 0;

const checkFrameTiming = () => {
  const now = performance.now();
  const frameTime = now - prevTime;
  if (frameTime > maxFrameTime) {
    maxFrameTime = frameTime;
  }
  if (frameTime > 20) {
    console.warn(`Frame drop detected: ${frameTime.toFixed(2)}ms`);
  }
  prevTime = now;
  requestAnimationFrame(checkFrameTiming);
};

checkFrameTiming();
// After 60s, check maxFrameTime
```

---

## 2. Memory Testing

### 2.1 Memory Baseline

**Setup**:
- Chrome DevTools → Memory tab
- Heap snapshots enabled
- Garbage collection forced between snapshots

**Test Sequence**:

| Step | Action | Expected Heap Size |
|------|--------|-------------------|
| 1 | Load page, before play | ~5-10 MB |
| 2 | Start game | ~8-12 MB |
| 3 | Collect 30 dots (30s gameplay) | ~10-15 MB |
| 4 | Game over | ~12-18 MB |
| 5 | Restart game | ~10-15 MB (return to #2 level) |
| 6 | After 3 restarts + GC | ~10-15 MB (similar to #5) |

**Pass Criteria**: Memory returns to baseline ±2 MB after each restart (no memory leak)

### 2.2 Memory Leak Detection

**Chrome DevTools Method**:

1. Open Memory tab
2. Take heap snapshot (label: "Start")
3. Start game, play 60 seconds
4. Click GC icon (garbage collection)
5. Take heap snapshot (label: "After 60s gameplay")
6. Restart game
7. Take heap snapshot (label: "After restart")
8. Compare snapshots:
   - Same object count? ✓ No leak
   - Grow by >10%? ✗ Potential leak

**Suspicious Patterns**:
- Array growth (old game state not cleared)
- Event listener accumulation (duplicate handlers)
- Detached DOM nodes (old canvas contexts)

### 2.3 Event Listener Cleanup

**Test**: Verify event listeners are removed on restart

```javascript
// In Chrome DevTools Console
// Get current listener count
const getListenerCount = () => {
  const listeners = getEventListeners(window);
  let count = 0;
  for (const event in listeners) count += listeners[event].length;
  return count;
};

const before = getListenerCount();
console.log(`Before: ${before} listeners`);

// Restart game
// Check after restart
setTimeout(() => {
  const after = getListenerCount();
  console.log(`After: ${after} listeners`);
  console.assert(after <= before + 5, "Event listeners not cleaned up!");
}, 1000);
```

### 2.4 Detached DOM Nodes

**Test**: Check for detached canvas contexts

```javascript
// Chrome DevTools → Memory → Detached DOM nodes
// Should be 0 after each restart (no old canvases)
// If > 0: Old canvas elements not removed from memory
```

---

## 3. Rendering Performance

### 3.1 Paint & Composite Times

**Chrome DevTools → Rendering tab**:

1. Check "Paint flashing" - watch for frequent repaints
2. Check "Rendering stats" in top-right
3. During gameplay:
   - Canvas repaints should be constant (60x/sec)
   - Layout recalculations should be minimal
   - Composite operations < 3ms

**Pass Criteria**:
- No layout thrashing (multiple layout recalculations per frame)
- Composite time ≤ 3ms
- CPU usage ≤ 30% during gameplay

### 3.2 GPU Acceleration

**Test**: Canvas rendering uses GPU acceleration

```javascript
// Chrome DevTools → Layers
// Canvas should have a "Compositing Reasons" entry
// Verify it uses hardware acceleration (GPU), not software rendering
```

### 3.3 Canvas Resizing Performance

**Test**: Window resize doesn't stall game

```javascript
// Start game
// Rapidly resize window (drag corner repeatedly)
const startTime = performance.now();
// Measure time to process resize
const resizeTime = performance.now() - startTime;
console.assert(resizeTime < 50, `Resize took ${resizeTime}ms, should be < 50ms`);
```

---

## 4. CPU & Thermal Testing

### 4.1 CPU Usage

**Measure with Chrome Task Manager**:

1. Open Chrome Task Manager (Shift+Esc)
2. Start game, let it run for 60s
3. Note CPU usage

**Expected**:
- Idle menu: 1-3% CPU
- Gameplay: 8-15% CPU (depending on device)
- After pause: 1-3% CPU

### 4.2 Thermal Behavior

**For mobile devices**:

1. Use thermal app or feel device temperature
2. Play game for 5 minutes
3. Check for throttling or device heat

**Pass Criteria**:
- Device doesn't get excessively hot
- No thermal throttling observed
- Battery drain acceptable (~5-10% per minute)

---

## 5. Mobile Performance

### 5.1 Mobile FPS Testing

**Setup**:
- Device: iPhone 12+, Samsung Galaxy S21+
- Viewport: Mobile (390x844 or similar)

**Test**:

| Device | Expected FPS | Pass Criteria |
|--------|--------------|---------------|
| iPhone 12+ (A15 chip) | 60 FPS | ≥58 FPS |
| Samsung Galaxy S21+ (Snapdragon) | 60 FPS | ≥55 FPS |
| iPad (A14 chip) | 60 FPS | ≥58 FPS |
| Budget Android | 60 FPS | ≥30 FPS (acceptable minimum) |

**Testing Method**:
- Use Chrome Remote Debugging on PC
- Connect mobile via USB
- Open Chrome DevTools on PC
- Record performance on mobile device
- Check FPS metrics

### 5.2 Mobile Memory

**Test**:

| Device | Expected Heap | Pass Criteria |
|--------|---------------|---------------|
| iPhone 12+ | 20 MB | ≤ 50 MB |
| Samsung Galaxy S21+ | 30 MB | ≤ 100 MB |
| iPad | 25 MB | ≤ 80 MB |

### 5.3 Mobile Battery Impact

**Test**:
- Play for 10 minutes
- Note battery drain

**Expected**: ≤15% battery drain (acceptable usage)

---

## 6. Network Throttling (Offline Testing)

### 6.1 No Network Required

**Test**: Game works completely offline

```javascript
// Chrome DevTools → Network tab
// Set "Throttling" to "Offline"
// Game should start and play without errors
```

### 6.2 Asset Loading

**Expected**:
- CSS loads: < 50ms
- JS bundle loads: < 200ms
- Total page load: < 500ms (offline, cached)

---

## 7. Load Testing

### 7.1 Cold Start

**Test**: First time loading game

```javascript
// Clear cache: Ctrl+Shift+Del (select "Cached images and files")
// Reload page
// Measure time to interactive
const startTime = performance.now();
// [wait for game to be playable]
const loadTime = performance.now() - startTime;
console.log(`Time to playable: ${loadTime}ms`);
```

**Expected**: < 1000ms (1 second to playable state)

### 7.2 Repeated Restarts

**Test**: Performance stable after multiple restarts

```javascript
// Play game, restart 10 times in succession
// Measure each restart time
// Verify no degradation
for (let i = 0; i < 10; i++) {
  const restartStart = performance.now();
  gameRestart();
  const restartTime = performance.now() - restartStart;
  console.log(`Restart ${i + 1}: ${restartTime}ms`);
}
```

**Expected**: Each restart < 100ms, no accumulation

---

## 8. Stress Testing

### 8.1 Rapid Input

**Test**: Game handles rapid keyboard input

```typescript
// Simulate 1000 key presses per second
for (let i = 0; i < 1000; i++) {
  keyboard.pressKey('ArrowUp');
  keyboard.releaseKey('ArrowUp');
}
// Verify no crash, no memory leak, frame rate stable
```

**Pass Criteria**: FPS doesn't drop below 50, no crash

### 8.2 Extended Gameplay

**Test**: Play game for extended period (find issues with memory/performance over time)

1. Start game
2. Play for 5 minutes (restart every 60s)
3. Monitor FPS, memory, and thermal behavior

**Pass Criteria**:
- FPS doesn't degrade
- Memory doesn't accumulate
- Device doesn't overheat

### 8.3 Particle Density Stress

**Test**: Create maximum particle density

```typescript
// Spawn 100 dots in rapid succession
for (let i = 0; i < 100; i++) {
  simulateDotCollection(); // Particles spawn
}
// Measure FPS and memory
```

**Pass Criteria**:
- FPS ≥ 50 even with 100+ particles
- Memory < 50 MB

---

## 9. Animation Performance

### 9.1 CSS Animation Smoothness

**Test**: All animations play at 60 FPS

| Animation | Duration | Expected Jank | Pass Criteria |
|-----------|----------|---------------|---------------|
| Fade In (Start Screen) | 0.5s | None | Smooth (≥55 FPS) |
| Slide Up (Modal) | 0.6s | None | Smooth |
| Score Popup | 0.4s | None | Smooth |
| Timer Pulse (low time) | 0.5s | None | Smooth |
| Button Hover | 0.3s | None | Smooth |

**Testing**:
```javascript
// Record performance during each animation
// Check for dropped frames in DevTools Performance tab
```

### 9.2 Reduced Motion Preference

**Test**: Animations disabled with prefers-reduced-motion

```css
/* CSS should respect this */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
  }
}
```

**Test on Mac**:
1. System Preferences → Accessibility → Display → Reduce motion
2. Game loads
3. Animations should be instant or disabled

---

## 10. Cross-Browser Performance

### 10.1 Browser Comparison

| Browser | FPS | Load Time | Memory | Pass |
|---------|-----|-----------|--------|------|
| Chrome 130 | 60 | 300ms | 12 MB | ☐ |
| Firefox 132 | 58 | 350ms | 15 MB | ☐ |
| Safari 17 | 59 | 280ms | 14 MB | ☐ |
| Edge 130 | 60 | 320ms | 13 MB | ☐ |

**Pass Criteria**: All browsers ≥ 55 FPS

---

## 11. Responsive Performance

### 11.1 Layout Reflow Performance

**Test**: Layout change doesn't stall game

```javascript
// Start game
// Resize window every 0.5 seconds
// Monitor for layout thrashing
const resizeInterval = setInterval(() => {
  window.resizeTo(800, 600);
}, 500);
// Check FPS and memory during resizes
```

**Pass Criteria**: FPS remains ≥ 55 during resizing

### 11.2 Breakpoint Transition

**Test**: Layout breakpoints transition smoothly

| Breakpoint | Transition Smoothness | Pass |
|------------|----------------------|------|
| 1024px → 1023px | No jank | ☐ |
| 768px → 769px | No jank | ☐ |
| 480px → 481px | No jank | ☐ |

---

## 12. Performance Benchmarks Summary

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Frame Rate | 60 FPS | | ☐ |
| Avg Frame Time | ≤16.7ms | | ☐ |
| Max Frame Time | ≤50ms | | ☐ |
| Memory Baseline | 10 MB | | ☐ |
| Memory After Restart | 10 MB (±2) | | ☐ |
| Load Time | < 500ms | | ☐ |
| Input Latency | < 50ms | | ☐ |
| Mobile FPS | ≥55 FPS | | ☐ |

---

## 13. Performance Optimization Checklist

Before finalizing:

- [ ] All frames render in < 16.7ms (60 FPS)
- [ ] Memory returns to baseline after restart
- [ ] No event listener leaks
- [ ] Canvas resizing doesn't cause jank
- [ ] Particles are cleaned up
- [ ] CSS animations are performant
- [ ] Mobile performance ≥ 55 FPS
- [ ] Load time < 500ms
- [ ] No console performance warnings

---

## 14. Profiling Tools

### Chrome DevTools

**Performance Tab**:
- Record gameplay session
- Identify slow functions
- Check for long tasks (> 50ms)

**Memory Tab**:
- Take heap snapshots
- Compare before/after restart
- Detect detached DOM nodes

**Rendering Tab**:
- FPS counter
- Paint flashing
- Rendering stats

### Firefox DevTools

**Performance Tab**:
- Similar to Chrome
- Check for main thread blocking

**Memory Tab**:
- Heap snapshots
- Allocation tracker

### Safari DevTools

**Develop Menu** (enable in Preferences):
- Timeline: Measure FPS and memory
- Inspector: Check canvas rendering

---

## 15. Test Report Template

```markdown
## Performance Test Report

**Date**: [DATE]
**Tester**: [NAME]
**Device**: [MODEL]
**Browser**: [NAME] [VERSION]
**Viewport**: [WIDTH x HEIGHT]

### Results

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Frame Rate | 60 FPS | [X] FPS | [PASS/FAIL] |
| Memory (start) | 10 MB | [X] MB | [PASS/FAIL] |
| Memory (after restart) | 10 MB | [X] MB | [PASS/FAIL] |
| Load Time | < 500ms | [X]ms | [PASS/FAIL] |
| Input Latency | < 50ms | [X]ms | [PASS/FAIL] |

### Issues Found

[List any performance issues discovered]

### Recommendations

[List optimization suggestions]
```

---

## Success Criteria

Before release:

✓ Frame rate ≥ 55 FPS on all tested devices
✓ Memory returns to baseline after restart
✓ No memory leaks detected
✓ Load time < 500ms
✓ Input latency < 50ms
✓ All animations smooth (≥ 55 FPS)
✓ Mobile performance ≥ 55 FPS
✓ CPU usage reasonable (≤ 30%)
✓ No thermal issues on mobile

