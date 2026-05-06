# Dot Collector Game - Gameplay Validation Scenarios

## Purpose
Test complete gameplay scenarios from start to finish, validating the full game loop and user experience.

---

## 1. Happy Path Scenario: Basic Gameplay

**Objective**: Complete a full 60-second game session with steady dot collection

**Setup**: 
- Fresh page load
- Desktop viewport (1920x1080)
- Chrome browser

**Steps**:

| Step | Action | Expected Result | Validate |
|------|--------|-----------------|----------|
| 1 | Load game page | Start screen appears with title, instructions, play button | ☐ |
| 2 | Click "Play" button | Game starts, canvas appears with player in center | ☐ |
| 3 | Move right (arrow →) | Player slides smoothly to the right | ☐ |
| 4 | Collect first dot | Dot disappears, score becomes 1, particles appear | ☐ |
| 5 | Move freely for 10s | Player responds smoothly to all directions | ☐ |
| 6 | Collect 5 more dots | Score increments to 6, HUD updates in real-time | ☐ |
| 7 | Observe timer | Timer counts down from 60 to 50 (after 10s) | ☐ |
| 8 | Move to corners | Player clamps at boundaries, no clipping | ☐ |
| 9 | Play for 50 seconds | Collect ~20-30 dots, score accumulates | ☐ |
| 10 | At 10s remaining | Timer background turns yellow, pulses warning | ☐ |
| 11 | Timer reaches 0 | Game immediately transitions to game over | ☐ |
| 12 | Game over modal | Final score displays, restart button visible | ☐ |
| 13 | Click "Restart Game" | Game resets, score shows 0, timer shows 01:00 | ☐ |

**Expected Outcome**: 
- ✓ Collected ~25 dots (average)
- ✓ No console errors
- ✓ Smooth 60 FPS gameplay
- ✓ Clean state reset on restart

**Tester**: __________ **Date**: __________ **Result**: ☐ Pass ☐ Fail

---

## 2. Speed Run Scenario: Aggressive Play

**Objective**: Maximize dot collection with aggressive movement and rapid directional changes

**Setup**: 
- Start after completing Happy Path
- Same environment

**Steps**:

| Step | Action | Expected Result | Validate |
|------|--------|-----------------|----------|
| 1 | Click "Play" | Game starts fresh | ☐ |
| 2 | Move aggressively | Mash arrow keys rapidly, test rapid direction changes | Player never lags, responds immediately | ☐ |
| 3 | Collect dots quickly | Move aggressively to collect every dot as soon as possible | Score increments smoothly, no missed collections | ☐ |
| 4 | Diagonal movement | Move up+right, up+left, down+right, down+left | Speed consistent with cardinal movement (normalized) | ☐ |
| 5 | Corner farming | Stay in one corner and collect dots spawning there | Dots consistently spawn around player without overlapping | ☐ |
| 6 | Mid-game pause | (If pause implemented) Press pause button | Game pauses, player frozen, HUD frozen | ☐ |
| 7 | Resume from pause | (If pause implemented) Resume | Game continues smoothly from where paused | ☐ |
| 8 | High speed play | Collect dots for entire 60 seconds at maximum effort | Score achieves ≥35+ dots | ☐ |
| 9 | At game over | Review final score and summary | Accurate count of dots collected | ☐ |

**Expected Outcome**:
- ✓ High dot collection (≥35)
- ✓ No input lag or stuttering
- ✓ Frame rate remains ≥55 FPS
- ✓ Particles generated and cleaned up smoothly

**Tester**: __________ **Date**: __________ **Result**: ☐ Pass ☐ Fail

---

## 3. Casual Scenario: Leisurely Play

**Objective**: Play casually without rushing, testing sustained engagement

**Setup**: Mobile viewport (390x844) on mobile device

**Steps**:

| Step | Action | Expected Result | Validate |
|------|--------|-----------------|----------|
| 1 | Load game on mobile | Start screen optimized for mobile, readable | ☐ |
| 2 | Tap "Play" button | Button responds immediately | ☐ |
| 3 | Use WASD keys | (Simulated or mobile keyboard if available) Movement works | ☐ |
| 4 | Slow, deliberate movement | Move methodically, collect dots at relaxed pace | Player responsive, no lag | ☐ |
| 5 | Observe HUD | Score and timer visible and readable on small screen | ☐ |
| 6 | Mid-game observation | At 30 seconds, score should be ~10-15 | Reasonable collection rate | ☐ |
| 7 | Device rotation | Rotate device to landscape mid-game | Game resizes smoothly, continues playing | ☐ |
| 8 | Continue to end | Play until timer ends | Game completes successfully | ☐ |
| 9 | Game over on mobile | Modal displays properly on small screen | Readable score and restart button | ☐ |

**Expected Outcome**:
- ✓ Mobile experience smooth and responsive
- ✓ Touch-friendly button sizes
- ✓ Orientation change handled gracefully
- ✓ Casual collection pace (~10-15 dots in 60s)

**Tester**: __________ **Date**: __________ **Result**: ☐ Pass ☐ Fail

---

## 4. Edge Case Scenario: Boundary Testing

**Objective**: Verify boundary behavior and edge cases during gameplay

**Setup**: 
- Desktop viewport
- Focused testing on boundary conditions

**Steps**:

| Step | Action | Expected Result | Validate |
|------|--------|-----------------|----------|
| 1 | Start game | Canvas and player ready | ☐ |
| 2 | Move to top edge | Hold up arrow, reach canvas top | Player stops at top, not outside | ☐ |
| 3 | Move to bottom edge | Hold down arrow, reach canvas bottom | Player stops at bottom, not outside | ☐ |
| 4 | Move to left edge | Hold left arrow, reach canvas left | Player stops at left, not outside | ☐ |
| 5 | Move to right edge | Hold right arrow, reach canvas right | Player stops at right, not outside | ☐ |
| 6 | Corner: top-left | Move up+left simultaneously to corner | Player clamps to corner perfectly | ☐ |
| 7 | Corner: top-right | Move up+right to corner | Player stops at corner | ☐ |
| 8 | Corner: bottom-left | Move down+left to corner | Player stops at corner | ☐ |
| 9 | Corner: bottom-right | Move down+right to corner | Player stops at corner | ☐ |
| 10 | Dot at boundary | Test dots spawning near canvas edge | Dots fully within bounds, not clipped | ☐ |
| 11 | Collect at boundary | Position player partially at edge, collect nearby dot | Collision detection accurate at boundary | ☐ |

**Expected Outcome**:
- ✓ No clipping outside canvas
- ✓ Smooth edge movement
- ✓ Corner cases handled correctly
- ✓ Boundary collision detection accurate

**Tester**: __________ **Date**: __________ **Result**: ☐ Pass ☐ Fail

---

## 5. Stress Scenario: Rapid Restart Test

**Objective**: Test game stability through multiple rapid restarts

**Setup**: 
- Desktop viewport
- DevTools Memory tab open

**Steps**:

| Step | Action | Expected Result | Validate |
|------|--------|-----------------|----------|
| 1 | Take heap snapshot | Record baseline memory | ~12 MB | ☐ |
| 2 | Start game #1 | Game starts normally | ☐ |
| 3 | Play 5 seconds | Collect a few dots | ☐ |
| 4 | Restart #1 | Click restart | State fully reset, no remnants | ☐ |
| 5 | Play 5 seconds | Collect dots again | ☐ |
| 6 | Restart #2 | Click restart | State reset | ☐ |
| 7-16 | Repeat steps 5-6 | Restart 5 times total | Each restart clean | ☐ |
| 17 | Force GC | Click GC button in DevTools | Garbage collection occurs | ☐ |
| 18 | Take final snapshot | Compare memory to baseline | Memory similar to baseline (±2 MB) | ☐ |

**Expected Outcome**:
- ✓ No memory accumulation
- ✓ Each restart clean
- ✓ No memory leak detected
- ✓ Event listeners properly cleaned up

**Tester**: __________ **Date**: __________ **Result**: ☐ Pass ☐ Fail

---

## 6. Visual Polish Scenario: Animation & UI

**Objective**: Verify all animations and visual effects are smooth and polished

**Setup**: 
- Desktop viewport
- Chrome DevTools Performance recording

**Steps**:

| Step | Action | Expected Result | Validate |
|------|--------|-----------------|----------|
| 1 | Page load | Start screen fades in smoothly (0.5s) | ☐ |
| 2 | Start screen appears | Title and buttons slide up with bounce effect | ☐ |
| 3 | Click play button | Button scales down briefly on click | ☐ |
| 4 | Game starts | Smooth transition to gameplay | ☐ |
| 5 | Collect first dot | Score animates with scale effect (0.4s) | ☐ |
| 6 | Collect second dot | Score animation plays again, smooth | ☐ |
| 7 | Particles | When collecting dots, small particles spawn and fade | ☐ |
| 8 | At 10s remaining | Timer background turns yellow, pulses gently | ☐ |
| 9 | Timer pulsing | Pulse animation continues smoothly until 0 | ☐ |
| 10 | Game over | Modal slides up with bounce effect | ☐ |
| 11 | Game over modal | Final score displays with scale animation | ☐ |
| 12 | Restart button | Button has hover effect (scales, shadow) | ☐ |
| 13 | Record performance | DevTools Performance shows ≥55 FPS throughout | ☐ |

**Expected Outcome**:
- ✓ All animations smooth and polished
- ✓ No jank or stuttering
- ✓ Frame rate maintained ≥55 FPS
- ✓ Visual feedback clear and engaging

**Tester**: __________ **Date**: __________ **Result**: ☐ Pass ☐ Fail

---

## 7. Collision Accuracy Scenario

**Objective**: Verify collision detection is accurate in various scenarios

**Setup**: 
- Desktop viewport
- Focus on collision testing

**Steps**:

| Step | Action | Expected Result | Validate |
|------|--------|-----------------|----------|
| 1 | Start game | Canvas ready with first dot | ☐ |
| 2 | Direct overlap | Move player directly onto dot center | Collision triggers, dot collected | ☐ |
| 3 | Edge tangent | Move player to just touch dot edge | Collision triggers (within tolerance) | ☐ |
| 4 | Just outside | Move player very close but not touching | No collision, dot persists | ☐ |
| 5 | Rapid approach | Move quickly toward dot | Collision detected even with fast movement | ☐ |
| 6 | Dot near corner | Spawn dot very close to canvas corner | Collision works at boundary | ☐ |
| 7 | Player at corner, dot center | Player at corner, dot spawned in middle | Collision accurate over distance | ☐ |
| 8 | Multiple dots nearby | (If possible) Test with dots close together | Only one dot collected at a time | ☐ |
| 9 | Repeated collision test | Collect 10+ dots | 100% collection rate, no misses | ☐ |

**Expected Outcome**:
- ✓ 100% collision accuracy
- ✓ No false positives (collections when not touching)
- ✓ No false negatives (misses when overlapping)
- ✓ Consistent behavior

**Tester**: __________ **Date**: __________ **Result**: ☐ Pass ☐ Fail

---

## 8. Responsive Layout Scenario

**Objective**: Verify responsive design works correctly across screen sizes

**Setup**: 
- Chrome DevTools Device Emulation
- Test 3 breakpoints

**Steps**:

| Breakpoint | Width | Steps | Expected Result | Validate |
|-------------|-------|-------|-----------------|----------|
| **Desktop** | 1920px | Load game, play for 10s, check layout | 2-column layout (game + sidebar), proper proportions | ☐ |
| **Tablet** | 1024px | Set viewport to 1024x768, reload | Layout adapts, HUD positioned well, no overlap | ☐ |
| **Mobile** | 390px | Set viewport to 390x844, reload | 1-column layout (stacked), full width, readable | ☐ |

**Viewport-Specific Tests**:

**Desktop (1920x1080)**:
- [ ] Game area takes ~70% width
- [ ] Sidebar takes ~30% width (240px)
- [ ] All elements visible without scroll
- [ ] Buttons properly spaced
- [ ] Canvas aspect ratio maintained

**Tablet (1024x768)**:
- [ ] Layout responsive
- [ ] HUD cards positioned correctly
- [ ] Touch targets ≥44px
- [ ] Readable without zoom
- [ ] No horizontal scroll

**Mobile (390x844)**:
- [ ] Single column layout
- [ ] Game full width
- [ ] HUD stacked vertically
- [ ] Font sizes readable
- [ ] Button touch targets large
- [ ] No horizontal scroll

**Expected Outcome**:
- ✓ All breakpoints display correctly
- ✓ No layout breaks
- ✓ Responsive at exact breakpoints (1024px, 768px, 480px)
- ✓ Content remains readable and accessible

**Tester**: __________ **Date**: __________ **Result**: ☐ Pass ☐ Fail

---

## 9. Accessibility Scenario

**Objective**: Verify game is accessible to all users

**Setup**: 
- Desktop viewport
- Chrome DevTools Accessibility Inspector

**Steps**:

| Step | Action | Expected Result | Validate |
|------|--------|-----------------|----------|
| 1 | Tab navigation | Press Tab repeatedly | Can navigate through all interactive elements | ☐ |
| 2 | Button focus | Tab to each button | Focus ring visible around buttons | ☐ |
| 3 | Aria labels | Inspect buttons in DevTools | Each button has descriptive aria-label | ☐ |
| 4 | Color contrast | Use WebAIM contrast checker | Text contrast ≥4.5:1 (WCAG AA) | ☐ |
| 5 | Reduced motion | Set OS to reduce motion | Animations disable, game still playable | ☐ |
| 6 | High contrast | (if available) Enable high contrast mode | Game remains readable and usable | ☐ |
| 7 | Keyboard only | Play game using only keyboard | No mouse required, all functions accessible | ☐ |
| 8 | Screen reader (optional) | Use screen reader on page | Page structure logical, elements announced | ☐ |

**Expected Outcome**:
- ✓ Keyboard navigable
- ✓ WCAG AA compliant
- ✓ Accessible to users with reduced motion
- ✓ Game playable without mouse

**Tester**: __________ **Date**: __________ **Result**: ☐ Pass ☐ Fail

---

## 10. Cross-Browser Scenario

**Objective**: Verify game works consistently across browsers

**Setup**: 
- Test on each major browser
- Same test sequence for each

**Test on Each Browser**:

| Browser | Version | Test Steps | Pass | Notes |
|---------|---------|-----------|------|-------|
| **Chrome** | 130+ | Run Happy Path | ☐ | Baseline |
| **Firefox** | 132+ | Run Happy Path | ☐ | Check text rendering |
| **Safari** | 17+ | Run Happy Path | ☐ | Test on macOS |
| **Edge** | 130+ | Run Happy Path | ☐ | Chromium-based |

**For Each Browser**:
1. Load game page
2. Play for 60 seconds (basic gameplay)
3. Collect ≥15 dots
4. Restart
5. Verify:
   - [ ] Game starts without errors
   - [ ] Graphics render correctly
   - [ ] Input responsive
   - [ ] No console errors
   - [ ] All animations smooth
   - [ ] Layout correct

**Expected Outcome**:
- ✓ Consistent behavior across all browsers
- ✓ No browser-specific bugs
- ✓ Performance similar (±5 FPS)

**Tester**: __________ **Date**: __________ **Result**: ☐ Pass ☐ Fail

---

## 11. Long Session Scenario: Extended Play

**Objective**: Verify game remains stable during extended play session

**Setup**: 
- Desktop viewport
- Monitor memory and performance

**Steps**:

| Time | Action | Expected Result | Validate |
|------|--------|-----------------|----------|
| 0:00 | Start game | Game launches normally | ☐ |
| 1:00 | First playthrough complete | Game ends, score recorded | ☐ |
| 1:05 | Restart game #1 | Clean state reset | ☐ |
| 2:05 | Second playthrough complete | Game stable, performance good | ☐ |
| 2:10 | Restart game #2 | State reset | ☐ |
| 3:10 | Third playthrough complete | Performance maintained | ☐ |
| 3:15 | Check memory | DevTools memory measurement | Heap similar to start | ☐ |
| 3:15 | Restart game #3 | Final restart | ☐ |
| 4:15 | Final playthrough complete | Game still responsive | ☐ |

**Performance Checkpoints**:
- After 1st game: FPS ≥55, Memory ~12 MB
- After 2nd game: FPS ≥55, Memory ~12 MB
- After 3rd game: FPS ≥55, Memory ~12 MB (±2 MB tolerance)

**Expected Outcome**:
- ✓ 3 full playthroughs without degradation
- ✓ Frame rate consistent
- ✓ No memory leaks
- ✓ Game remains fully functional

**Tester**: __________ **Date**: __________ **Result**: ☐ Pass ☐ Fail

---

## 12. Error Recovery Scenario

**Objective**: Verify game handles edge cases and recovers gracefully

**Setup**: 
- Desktop viewport
- DevTools Console open

**Steps**:

| Step | Action | Expected Result | Validate |
|------|--------|-----------------|----------|
| 1 | Start game normally | Game loads without error | ☐ |
| 2 | Rapidly resize window | Drag corner to resize repeatedly | Canvas resizes, game continues | ☐ |
| 3 | Alt+Tab away | Switch to another app mid-game | Game pauses (browser behavior), resumes when focused | ☐ |
| 4 | Return focus | Alt+Tab back to game | Game resumes, no state corruption | ☐ |
| 5 | Tab visibility | Open DevTools, close DevTools | Game continues unaffected | ☐ |
| 6 | Mash keys | Rapidly press many keys | No crash, movement logical | ☐ |
| 7 | Mash buttons | Click buttons repeatedly | No duplicate events, buttons debounced | ☐ |
| 8 | Console activity | Check console for errors | No TypeScript errors, no warnings | ☐ |

**Expected Outcome**:
- ✓ Graceful error handling
- ✓ No crashes from edge input
- ✓ Game recovers from interruptions
- ✓ Clean console (no errors)

**Tester**: __________ **Date**: __________ **Result**: ☐ Pass ☐ Fail

---

## Scenario Test Summary

| Scenario | Status | Notes |
|----------|--------|-------|
| 1. Happy Path | ☐ Pass ☐ Fail | |
| 2. Speed Run | ☐ Pass ☐ Fail | |
| 3. Casual Play | ☐ Pass ☐ Fail | |
| 4. Boundary Testing | ☐ Pass ☐ Fail | |
| 5. Stress Restart | ☐ Pass ☐ Fail | |
| 6. Visual Polish | ☐ Pass ☐ Fail | |
| 7. Collision Accuracy | ☐ Pass ☐ Fail | |
| 8. Responsive Layout | ☐ Pass ☐ Fail | |
| 9. Accessibility | ☐ Pass ☐ Fail | |
| 10. Cross-Browser | ☐ Pass ☐ Fail | |
| 11. Long Session | ☐ Pass ☐ Fail | |
| 12. Error Recovery | ☐ Pass ☐ Fail | |

**Overall Result**: ☐ All Pass ☐ Some Fail ☐ Critical Issues Found

**Issues Found**:
```
[List any issues discovered]
```

**Recommendations**:
```
[List recommendations for improvements]
```

**Tester Name**: ____________________
**Date Completed**: ____________________
**Sign-Off**: ☐ Approved for Release ☐ Needs Fixes

