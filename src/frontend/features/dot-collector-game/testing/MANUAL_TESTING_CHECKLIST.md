# Dot Collector Game - Manual Testing Checklist

## Test Execution Instructions

1. **Environment**: Use Chrome DevTools open (F12) to monitor console for errors
2. **Screen Size**: Start with desktop (1920x1080), then tablet (1024x768), then mobile (390x844)
3. **Network**: Ensure offline (game should work without network)
4. **Repeat**: Each test should be performed at least once per browser

---

## Pre-Test Setup

- [ ] Clear browser cache and reload page
- [ ] Open DevTools (F12) to monitor console
- [ ] Disable any extensions that might interfere
- [ ] Close other tabs for accurate performance metrics

---

## 1. Game Initialization & Start Screen

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Start Screen Appears** | Load page | Start screen overlay displays with title, instructions, and play button | ☐ Pass ☐ Fail |
| **Start Screen Title** | Observe title | "Dot Collector" displays with gradient text (purple to blue) | ☐ Pass ☐ Fail |
| **Instructions Visible** | Check instructions | Instructions list shows: Arrow Keys/WASD, dot demo, 60 seconds, 1 point per dot | ☐ Pass ☐ Fail |
| **Play Button Clickable** | Click "Play" button | Game transitions to running state, start screen disappears | ☐ Pass ☐ Fail |
| **High Score Display** | (if implemented) Check high score section | High score displays if > 0, or hidden if first play | ☐ Pass ☐ Fail |
| **No Console Errors** | Open console (F12) | No TypeScript or React errors in console | ☐ Pass ☐ Fail |

---

## 2. Game Startup & Canvas

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Canvas Renders** | Click Play | Canvas element displays in game area | ☐ Pass ☐ Fail |
| **Canvas Has Bounds** | Observe canvas | Canvas fills game container, has visible borders | ☐ Pass ☐ Fail |
| **Player Renders** | Observe canvas | Blue square (player) appears centered on canvas | ☐ Pass ☐ Fail |
| **Dots Spawn** | Wait 0.5s | Red circle dots appear randomly on canvas (not overlapping player) | ☐ Pass ☐ Fail |
| **Timer Displays** | Check HUD | Timer shows "01:00" in MM:SS format | ☐ Pass ☐ Fail |
| **Score Displays** | Check HUD | Score shows "0" at start | ☐ Pass ☐ Fail |

---

## 3. Player Movement - Cardinal Directions

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Move Up (Arrow ↑)** | Press up arrow | Player moves upward smoothly at consistent speed | ☐ Pass ☐ Fail |
| **Move Down (Arrow ↓)** | Press down arrow | Player moves downward smoothly at consistent speed | ☐ Pass ☐ Fail |
| **Move Left (Arrow ←)** | Press left arrow | Player moves left smoothly at consistent speed | ☐ Pass ☐ Fail |
| **Move Right (Arrow →)** | Press right arrow | Player moves right smoothly at consistent speed | ☐ Pass ☐ Fail |
| **Move Up (W Key)** | Press W | Player moves upward (WASD alternative) | ☐ Pass ☐ Fail |
| **Move Down (S Key)** | Press S | Player moves downward | ☐ Pass ☐ Fail |
| **Move Left (A Key)** | Press A | Player moves left | ☐ Pass ☐ Fail |
| **Move Right (D Key)** | Press D | Player moves right | ☐ Pass ☐ Fail |

---

## 4. Player Movement - Boundary Constraints

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Top Boundary** | Hold up arrow, move to top | Player stops at top edge, doesn't leave canvas | ☐ Pass ☐ Fail |
| **Bottom Boundary** | Hold down arrow, move to bottom | Player stops at bottom edge, doesn't leave canvas | ☐ Pass ☐ Fail |
| **Left Boundary** | Hold left arrow, move to left | Player stops at left edge, doesn't leave canvas | ☐ Pass ☐ Fail |
| **Right Boundary** | Hold right arrow, move to right | Player stops at right edge, doesn't leave canvas | ☐ Pass ☐ Fail |
| **No Clipping** | Move in all corners | Player never appears outside canvas bounds | ☐ Pass ☐ Fail |

---

## 5. Player Movement - Diagonal Movement

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Up + Right** | Hold up + right arrows simultaneously | Player moves diagonally at same speed as cardinal (normalized) | ☐ Pass ☐ Fail |
| **Up + Left** | Hold up + left arrows simultaneously | Player moves diagonally NW, speed normalized | ☐ Pass ☐ Fail |
| **Down + Right** | Hold down + right arrows simultaneously | Player moves diagonally SE, speed normalized | ☐ Pass ☐ Fail |
| **Down + Left** | Hold down + left arrows simultaneously | Player moves diagonally SW, speed normalized | ☐ Pass ☐ Fail |
| **Speed Consistency** | Compare diagonal vs cardinal speed | Diagonal movement is NOT faster than cardinal (vector normalization) | ☐ Pass ☐ Fail |

---

## 6. Dot Collection & Collision Detection

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Dot Collection** | Move player onto a dot | Dot disappears, new dot spawns | ☐ Pass ☐ Fail |
| **Score Increments** | Collect a dot | Score increases by 1 (e.g., 0 → 1) | ☐ Pass ☐ Fail |
| **Multiple Collections** | Collect 5 dots | Score shows 5, each collection removes old dot and adds new one | ☐ Pass ☐ Fail |
| **Collision Precision** | Move partially onto dot | Dot is collected only when clearly overlapping | ☐ Pass ☐ Fail |
| **No False Positives** | Move close to dot but not touching | Dot is NOT collected, score stays same | ☐ Pass ☐ Fail |
| **Particle Effect** | Collect a dot | Particles (small circles) appear and fade around collection point | ☐ Pass ☐ Fail |

---

## 7. Dot Spawning

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Spawn Position Valid** | Observe dot spawns | Dots always appear within canvas bounds | ☐ Pass ☐ Fail |
| **No Player Overlap** | Collect multiple dots | New dots never spawn overlapping player position | ☐ Pass ☐ Fail |
| **Spawn Randomness** | Collect 10 dots | Spawn positions vary across canvas, not same spot | ☐ Pass ☐ Fail |
| **Single Dot Active** | Observe canvas | Only 1 dot visible at a time during normal play | ☐ Pass ☐ Fail |

---

## 8. Timer Countdown

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Initial Time** | Start game | Timer shows "01:00" | ☐ Pass ☐ Fail |
| **Countdown** | Wait 5 seconds | Timer decrements to "00:55" | ☐ Pass ☐ Fail |
| **Format Correct** | Observe timer | Timer always shows MM:SS format (e.g., "01:23", "00:45") | ☐ Pass ☐ Fail |
| **Accuracy** | Wait 60 seconds total | Timer accurately counts down 60 seconds (±1 sec tolerance) | ☐ Pass ☐ Fail |
| **Low Time Warning** | Wait until < 10 seconds | Timer background turns yellow/orange at < 10 seconds (visual warning) | ☐ Pass ☐ Fail |
| **Low Time Animation** | At < 10 seconds | Timer pulses (opacity animation) | ☐ Pass ☐ Fail |

---

## 9. Game Over

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Game Over Triggers** | Wait for timer to reach 0 | Game automatically transitions to gameOver state | ☐ Pass ☐ Fail |
| **Game Over Modal** | At game over | Modal overlay appears with "Game Over!" title | ☐ Pass ☐ Fail |
| **Final Score Display** | Game over modal | Final score displays prominently (e.g., "47 dots collected") | ☐ Pass ☐ Fail |
| **Game Summary** | Game over modal | Summary text shows "You collected X dot(s) in 60 seconds!" | ☐ Pass ☐ Fail |
| **Restart Button** | Game over modal | "Restart Game" button is visible and clickable | ☐ Pass ☐ Fail |
| **Player Frozen** | Game over | Player stops moving, no more dots spawn | ☐ Pass ☐ Fail |
| **No Console Errors** | Game over state | No errors in console | ☐ Pass ☐ Fail |

---

## 10. Restart Flow

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **State Reset** | Click "Restart Game" | Game returns to fresh state (score 0, timer 01:00) | ☐ Pass ☐ Fail |
| **Player Position** | After restart | Player repositions to center of canvas | ☐ Pass ☐ Fail |
| **Dots Cleared** | After restart | Old dots removed, new dots spawn fresh | ☐ Pass ☐ Fail |
| **Loop Restarted** | After restart | Game loop resumes (60 FPS, timer counts down) | ☐ Pass ☐ Fail |
| **Multiple Restarts** | Restart 3 times | Game restarts cleanly each time, no accumulation bugs | ☐ Pass ☐ Fail |
| **Pause Button Works** | During restart gameplay, click pause | Game pauses (if pause implemented) | ☐ Pass ☐ Fail |

---

## 11. HUD & Display Updates

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Score Real-time** | Collect dots rapidly | Score updates immediately on screen | ☐ Pass ☐ Fail |
| **Score Animation** | Collect a dot | Score number briefly scales up (0.4s animation) | ☐ Pass ☐ Fail |
| **Timer Real-time** | Observe during gameplay | Timer updates every second smoothly | ☐ Pass ☐ Fail |
| **HUD Position** | Observe layout | Score and Timer cards visible in right sidebar (desktop) | ☐ Pass ☐ Fail |
| **HUD Styling** | Check HUD cards | Cards have white background, shadows, rounded corners | ☐ Pass ☐ Fail |

---

## 12. Animations & Visual Polish

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Start Screen Animation** | Load page | Start screen fades in smoothly (0.5s) | ☐ Pass ☐ Fail |
| **Slide Up Animation** | Start screen appears | Modal slides up with bounce effect | ☐ Pass ☐ Fail |
| **Play Button Hover** | Hover over play button | Button scales up slightly, shadow enhances | ☐ Pass ☐ Fail |
| **Play Button Click** | Click play button | Button animates (scales down briefly) | ☐ Pass ☐ Fail |
| **Game Over Animation** | Game ends | Game over modal slides up with smooth transition | ☐ Pass ☐ Fail |
| **Score Popup** | Collect dot | Score value animates with scale effect | ☐ Pass ☐ Fail |
| **Particle Effects** | Collect dot | Particles spawn and fade over ~1 second | ☐ Pass ☐ Fail |
| **Smooth Movement** | Move player | Movement has no stuttering or jank | ☐ Pass ☐ Fail |

---

## 13. Performance & Stability

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Frame Rate** | Open DevTools → Performance tab, record 10s gameplay | Frame rate ≥ 55 FPS consistently | ☐ Pass ☐ Fail |
| **No Jank on Collection** | Collect dots rapidly | No frame drops visible during collection | ☐ Pass ☐ Fail |
| **No Console Spam** | Play full game, check console | No repeated errors or warnings | ☐ Pass ☐ Fail |
| **Memory Stable** | DevTools → Memory, take heap snapshot at start, then end | Heap size similar at start and end (no leak) | ☐ Pass ☐ Fail |
| **Smooth Animations** | Observe all animations | All CSS animations play smoothly without stuttering | ☐ Pass ☐ Fail |

---

## 14. Keyboard Input

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Rapid Input** | Spam arrow keys quickly | No input lag, player responds immediately | ☐ Pass ☐ Fail |
| **Simultaneous Keys** | Press multiple keys at once | Game handles without errors (diagonal movement works) | ☐ Pass ☐ Fail |
| **Key Release** | Press and release key | Player stops moving immediately after release | ☐ Pass ☐ Fail |
| **WASD vs Arrows** | Use both WASD and arrows | Both control schemes work equally well | ☐ Pass ☐ Fail |
| **Input During Pause** | (if pause implemented) Hold key during pause | Player doesn't move, input queues correctly | ☐ Pass ☐ Fail |

---

## 15. Responsive Design - Desktop (1920x1080)

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Layout** | Set viewport to 1920x1080 | 2-column layout: game on left, HUD sidebar on right | ☐ Pass ☐ Fail |
| **Canvas Size** | Observe canvas | Canvas takes up ~70% of width, scales proportionally | ☐ Pass ☐ Fail |
| **Sidebar Width** | Observe sidebar | Sidebar is ~240px wide, cards stack vertically | ☐ Pass ☐ Fail |
| **No Overflow** | Check layout | No horizontal scroll, all content fits | ☐ Pass ☐ Fail |
| **Button Spacing** | Check controls | Buttons are properly spaced with gaps | ☐ Pass ☐ Fail |

---

## 16. Responsive Design - Tablet (1024x768)

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Breakpoint Trigger** | Set viewport to 1024x768 | Layout adjusts (still 2-column or transitioned) | ☐ Pass ☐ Fail |
| **Canvas Scaling** | Observe canvas | Canvas maintains aspect ratio, scales to fit | ☐ Pass ☐ Fail |
| **HUD Arrangement** | Observe HUD | Score and timer may be horizontal (flex row) | ☐ Pass ☐ Fail |
| **No Overflow** | Check layout | All content visible without scroll | ☐ Pass ☐ Fail |
| **Readability** | Check text | All text is readable at tablet size | ☐ Pass ☐ Fail |

---

## 17. Responsive Design - Mobile (390x844)

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Breakpoint Trigger** | Set viewport to 390x844 | Layout changes to mobile (stacked/single column) | ☐ Pass ☐ Fail |
| **Full Width** | Observe layout | Game area takes full width, sidebar stacks below | ☐ Pass ☐ Fail |
| **Canvas Scaling** | Observe canvas | Canvas scales to fit mobile width while maintaining aspect | ☐ Pass ☐ Fail |
| **HUD Cards Mobile** | Check HUD | Cards stack or arrange horizontally, no overlap | ☐ Pass ☐ Fail |
| **Touch Friendly** | Check buttons | Buttons are large enough for touch (≥44px) | ☐ Pass ☐ Fail |
| **No Horizontal Scroll** | Attempt scroll | No horizontal scrolling needed | ☐ Pass ☐ Fail |
| **Readability Mobile** | Check text size | All text readable on small screen | ☐ Pass ☐ Fail |

---

## 18. Orientation Changes (Mobile/Tablet)

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Landscape to Portrait** | Rotate device to portrait | Layout adapts, no content hidden | ☐ Pass ☐ Fail |
| **Portrait to Landscape** | Rotate device to landscape | Layout adapts, game resumes without errors | ☐ Pass ☐ Fail |
| **Mid-Game Rotation** | Rotate during active gameplay | Game continues, canvas resizes smoothly | ☐ Pass ☐ Fail |
| **No Freezing** | Rotate multiple times | Game never freezes or becomes unresponsive | ☐ Pass ☐ Fail |

---

## 19. Browser Compatibility

| Browser | Version | Result | Notes |
|---------|---------|--------|-------|
| Chrome | 130+ | ☐ Pass ☐ Fail | Baseline, should work perfectly |
| Firefox | 132+ | ☐ Pass ☐ Fail | Check gradient text rendering |
| Safari | 17+ | ☐ Pass ☐ Fail | Test on macOS, watch for canvas blur |
| Edge | 130+ | ☐ Pass ☐ Fail | Chromium-based, similar to Chrome |

---

## 20. Accessibility

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Keyboard Navigation** | Tab through buttons | All interactive elements are reachable via keyboard | ☐ Pass ☐ Fail |
| **Aria Labels** | Inspect buttons | Buttons have descriptive aria-labels | ☐ Pass ☐ Fail |
| **Screen Reader** | Use screen reader (if available) | Page structure is logical, elements are announced | ☐ Pass ☐ Fail |
| **High Contrast** | Observe visuals | Text contrasts well with backgrounds | ☐ Pass ☐ Fail |
| **Motion Preferences** | prefers-reduced-motion: reduce | Animations disable, game is still playable | ☐ Pass ☐ Fail |

---

## 21. Dark Mode

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Dark Mode CSS** | Set OS to dark mode | Page applies dark mode styles automatically | ☐ Pass ☐ Fail |
| **Text Contrast Dark** | Observe text in dark mode | Text remains readable (light text on dark backgrounds) | ☐ Pass ☐ Fail |
| **Dark Mode Toggle** | (if implemented) Toggle dark mode | Styles update dynamically | ☐ Pass ☐ Fail |

---

## Test Summary

**Total Tests**: 100+ test cases
**Pass Threshold**: ≥95% (≤5 acceptable failures if low priority)
**Tester Name**: ___________________
**Test Date**: ___________________
**Browser(s)**: ___________________
**Notes/Issues Found**:

```
[Insert any issues, unexpected behavior, or notes here]
```

---

## Sign Off

- [ ] All critical tests passed (Mark X in checkbox)
- [ ] Ready for production release
- [ ] Known issues documented in bug report

**Tester Signature**: ___________________
**Date**: ___________________

