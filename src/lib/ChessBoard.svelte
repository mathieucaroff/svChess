<script lang="ts">
  import { getBoardFromHistory } from './board.js'
  import ChessBoardLetterBar from './ChessBoardLetterBar.svelte'
  import ChessBoardNumberCell from './ChessBoardNumberCell.svelte'
  import ChessSquare from './ChessSquare.svelte'
  import { computeMovement } from './movement.js'

  interface Props {
    class?: string
    moveHistory?: ChessHalfMove[]
    onMove?: (move: ChessHalfMove) => void
  }

  const { class: className, moveHistory = [], onMove }: Props = $props()

  const handleSquareMouseDown = (clickedCell: ChessCell, ev: MouseEvent) => {
    ev.preventDefault() // Prevent default drag behavior

    // Start drag immediately if clicking on a piece
    if (
      clickedCell.piece &&
      (clickedCell.piece.color === 'white') === (moveHistory.length % 2 === 0)
    ) {
      drag.active = true
      drag.dx = ev.clientX
      drag.dy = ev.clientY
      drag.ix = clickedCell.ix
      drag.iy = clickedCell.iy

      // Select the piece for drag
      selectedCell = { ix: clickedCell.ix, iy: clickedCell.iy }
      return
    }

    // Handle regular click logic for empty squares
    if (selectedCell) {
      const selectedPiece = displayBoard[selectedCell.iy][selectedCell.ix]
      if (!selectedPiece.piece) {
        console.error('Selected cell has no piece')
        return
      }
      if (clickedCell.dotted) {
        // If the clicked cell is dotted, the move is valid - create a clean move object
        const move: ChessHalfMove = {
          from: {
            ...selectedPiece,
            selected: false,
            dotted: false,
          },
          to: {
            ...clickedCell,
            selected: false,
            dotted: false,
          },
        }
        onMove?.(move)
        selectedCell = null
      }
    }
  }

  const handleMouseMove = (ev: MouseEvent) => {
    if (drag.active) {
      drag.dx = ev.clientX
      drag.dy = ev.clientY
    }
  }

  const handleSquareMouseUp = (ev: MouseEvent) => {
    if (drag.active) {
      // Find the square under the cursor
      const element = document.elementFromPoint(ev.clientX, ev.clientY)
      if (element) {
        // Find the chess square that contains this element
        const squareElement = element.closest('[data-ix]')
        if (squareElement) {
          const targetIx = Number(squareElement.getAttribute('data-ix'))
          const targetIy = Number(squareElement.getAttribute('data-iy'))
          const targetCell = displayBoard[targetIy][targetIx]
          const draggedCell = displayBoard[drag.iy][drag.ix]

          if (targetCell.dotted) {
            // Valid move - create a clean move object
            const move: ChessHalfMove = {
              from: {
                id: draggedCell.id,
                ix: draggedCell.ix,
                iy: draggedCell.iy,
                color: draggedCell.color,
                piece: draggedCell.piece,
                selected: false,
                dotted: false,
              },
              to: {
                id: targetCell.id,
                ix: targetCell.ix,
                iy: targetCell.iy,
                color: targetCell.color,
                piece: targetCell.piece,
                selected: false,
                dotted: false,
              },
            }
            onMove?.(move)
          }
        }
      }

      // Reset drag state and selection
      drag.active = false
      drag.dx = 0
      drag.dy = 0
      selectedCell = null
    }
  }

  function isBeingDragged(cell: ChessCell): boolean {
    return drag.active && cell.ix === drag.ix && cell.iy === drag.iy
  }

  let selectedCell = $state<{ ix: number; iy: number } | null>(null)
  let drag: DragInfo = $state({ active: false, dx: 0, dy: 0, ix: 0, iy: 0 })

  // Get base board without any UI state
  let baseBoard = $derived(getBoardFromHistory(moveHistory))

  // Apply selection state to board
  let board = $derived(
    baseBoard.map((row, iy) =>
      row.map((cell, ix) => ({
        ...cell,
        selected: selectedCell ? selectedCell.ix === ix && selectedCell.iy === iy : false,
      })),
    ),
  )

  // Compute valid moves based on current board state
  let dottingCellArray = $derived(computeMovement(board))

  // Apply dotting state to board for display
  let displayBoard = $derived(
    board.map((row) =>
      row.map((cell) => ({
        ...cell,
        dotted: dottingCellArray.some(
          (dottedCell) => dottedCell.ix === cell.ix && dottedCell.iy === cell.iy,
        ),
      })),
    ),
  )

  $effect(() => {
    // Set up mouse event listeners
    window.addEventListener('mousemove', handleMouseMove, true)
    window.addEventListener('mouseup', handleSquareMouseUp, true)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove, true)
      window.removeEventListener('mouseup', handleSquareMouseUp, true)
    }
  })
</script>

<div class={className}>
  <ChessBoardLetterBar />
  {#each [...displayBoard].reverse() as row, iy (iy)}
    <div class="flex flex-row">
      <ChessBoardNumberCell {iy} />
      {#each row as cell, ix (ix)}
        <ChessSquare
          color={cell.color}
          piece={isBeingDragged(cell) ? null : cell.piece}
          selected={cell.selected}
          dotted={cell.dotted}
          ix={cell.ix}
          iy={cell.iy}
          onmousedown={(ev: MouseEvent) => handleSquareMouseDown(cell, ev)}
        />
      {/each}
      <ChessBoardNumberCell {iy} />
    </div>
  {/each}
  <ChessBoardLetterBar />
  {#if drag.active}
    <div
      class="pointer-events-none fixed z-50 scale-90 opacity-60"
      style:left="{drag.dx - 50}px"
      style:top="{drag.dy - 50}px"
    >
      <ChessSquare piece={displayBoard[drag.iy][drag.ix].piece} />
    </div>
  {/if}
</div>
