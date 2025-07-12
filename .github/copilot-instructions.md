# svChess - AI Coding Assistant Instructions

## Project Overview

This is a **Svelte 5 chess game GUI**. The project demonstrates modern Svelte 5 features including runes (`$state`, `$derived`, `$effect`, `$props`) and provides a visual chess board with drag-and-drop piece movement.

## Architecture & Key Components

### Core Component Structure

- **`ChessBoard.svelte`** - Main container managing game state, drag-and-drop logic, and piece movement validation
- **`ChessSquare.svelte`** - Individual square rendering with piece icons from `@iconify/svelte`
- **`movement.ts`** - Chess movement logic calculating valid moves for each piece type
- **Global types in `app.d.ts`** - Defines `ChessCell`, `Piece`, `DragInfo` interfaces

### State Management Pattern

The app uses Svelte 5's runes extensively:

```typescript
let board = $state(boardBase) // 8x8 grid of ChessCell objects
let drag: DragInfo = $state({ active: false, dx: 0, dy: 0, ix: 0, iy: 0 })
let dottingCellArray = $derived(computeDotting(board)) // Valid moves for selected piece
```

### Drag-and-Drop Architecture

- **Mouse down** on piece starts drag, sets `drag.active = true`
- **Global mouse move** updates `drag.dx/dy` for visual feedback
- **Mouse up** finds target square via `document.elementFromPoint()` and validates move
- **Visual feedback** shows dragged piece as floating element with reduced opacity

## Development Workflows

### Package Manager

This project uses **Bun** as the package manager and task runner.

### Essential Commands

```bash
bun dev          # Vite dev server
bun build        # Build library + prepack validation
bun test         # Run all tests (unit + e2e)
bun test:unit    # Vitest browser testing
bun test:e2e     # Playwright end-to-end tests
bun lint         # Prettier + ESLint validation
```

### Testing Architecture

- **Vitest browser testing** for Svelte components using `vitest-browser-svelte`
- **Playwright e2e** tests for full integration
- **Dual test environments**: browser for components, node for utilities
- Test files: `*.svelte.{test,spec}.ts` for component tests, `*.{test,spec}.ts` for unit tests

## Project-Specific Conventions

### Chess Coordinate System

- Board uses **index-based coordinates** `(ix, iy)` where `(0,0)` is bottom-left
- Visual rendering **reverses the board** with `[...board].reverse()` to show white pieces at bottom
- Move validation in `dotting.ts` uses direction multiplier: `up = playingColor === 'black' ? -1 : 1`

### Piece Movement Logic

- **Selection state** managed via `cell.selected` boolean on ChessCell
- **Valid moves** shown as red dots via `cell.dotted` computed from `computeDotting()`
- **Movement validation** prevents moving to occupied squares of same color

### Styling & UI Patterns

- **Tailwind CSS 4.x** with `@tailwindcss/vite` plugin
- **Iconify icons** for chess pieces: `material-symbols:chess-pawn`, `tabler:chess-king`, etc.
- **Fixed square sizes** of 100px with orange color scheme (`bg-orange-300`/`bg-orange-700`)
- **Visual states**: red border for selection, red dots for valid moves, floating piece during drag

### Library Distribution

- Built as **SvelteKit library** with `svelte-package`
- **Static adapter** for demo site deployment
- **Exports** main component via `dist/index.js` with TypeScript definitions
- **Peer dependency** on Svelte 5.x

## Key Integration Points

- **Global event handlers** for drag operations attached to `window`
- **DOM queries** using `data-ix`/`data-iy` attributes for drop target detection
- **Effect cleanup** properly removes event listeners to prevent memory leaks
