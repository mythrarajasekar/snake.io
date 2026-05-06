# Business Overview

## Business Description
- **Business Description**: snake.io is a browser-based arcade game where a player controls a snake-like character on a 2D canvas, collecting dots to score points within a 60-second time limit. Each dot collected grows the snake's tail, increasing difficulty and visual feedback.
- **Business Transactions**:
  1. **Start Game** — Player initiates a new game session; snake spawns at canvas center, timer starts, first dot appears.
  2. **Move Player** — Player uses keyboard (Arrow Keys / WASD) to navigate the snake around the canvas.
  3. **Collect Dot** — Snake head collides with a dot; score increments, tail grows by 1 segment, particle effect plays, new dot spawns.
  4. **Pause / Resume Game** — Player pauses the game loop; timer and movement freeze; resumes on command.
  5. **Game Over** — Timer reaches zero; game loop stops; final score displayed with restart option.
  6. **Restart Game** — Player resets state to fresh game and starts again.
- **Business Dictionary**:
  - **Dot**: A collectible circular item on the canvas worth 1 point.
  - **Snake / Player**: The player-controlled rectangular head + trailing circular segments.
  - **Tail**: Chain of circular segments that grow each time a dot is collected.
  - **Score**: Total dots collected in the current session.
  - **TimeLeft**: Countdown from 60 seconds; reaching 0 triggers Game Over.
  - **GameStatus**: Enum of `idle | running | paused | gameOver`.

## Component Level Business Descriptions

### DotCollectorPage
- **Purpose**: Top-level game orchestrator — owns game state, handles all user actions (start, pause, resume, restart).
- **Responsibilities**: Bridges game loop engine with React UI; manages status transitions.

### GameCanvas
- **Purpose**: Renders the game world on an HTML5 Canvas element.
- **Responsibilities**: Draws player head, tail segments, dots, and particle effects every frame.

### GameLoop
- **Purpose**: Core game engine — drives the game tick at 60fps via requestAnimationFrame.
- **Responsibilities**: Updates timer, processes keyboard input, moves player, detects collisions, spawns dots, emits particles.

### Player
- **Purpose**: Represents the snake's head and tail state.
- **Responsibilities**: Processes directional input, updates position, manages tail segment follow-the-leader movement, enforces canvas boundary clamping.

### Dot
- **Purpose**: Represents a collectible item on the canvas.
- **Responsibilities**: Stores position, radius, value; provides random spawn logic avoiding player overlap.

### Collision
- **Purpose**: Pure collision detection utilities.
- **Responsibilities**: rect-circle collision (player vs dot), circle-circle collision (utility).

### useGameLoop (Hook)
- **Purpose**: React bridge to the GameLoop engine.
- **Responsibilities**: Throttles React state updates to 30fps, manages loop lifecycle with component mount/unmount.

### KeyboardInputManager
- **Purpose**: Captures and normalises keyboard input.
- **Responsibilities**: Listens to Arrow Keys and WASD, maintains directional state, notifies subscribers.
