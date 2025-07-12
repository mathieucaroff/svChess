<script lang="ts">
  import { getBoardFromHistory } from './board.js'
  import ChessBoardLetterBar from './ChessBoardLetterBar.svelte'
  import ChessBoardNumberCell from './ChessBoardNumberCell.svelte'
  import ChessSquare from './ChessSquare.svelte'
  import { computeMovement } from './movement.js'

  interface Props {
    class?: string
  }

  const { class: className }: Props = $props()

  const handleSquareMouseDown = (clickedCell: ChessCell, ev: MouseEvent) => {
    ev.preventDefault() // Prevent default drag behavior

    // Start drag immediately if clicking on a piece
    if (clickedCell.piece) {
      drag.active = true
      drag.dx = ev.clientX
      drag.dy = ev.clientY
      drag.ix = clickedCell.ix
      drag.iy = clickedCell.iy

      // Select the piece for drag
      board.forEach((row) => row.forEach((cell) => (cell.selected = false)))
      clickedCell.selected = true
      return
    }

    // Handle regular click logic for empty squares
    const selectedCell = board.flat().find((c) => c.selected)
    if (selectedCell) {
      if (!selectedCell.piece) {
        console.error('Selected cell has no piece')
        return
      }
      if (clickedCell.dotted) {
        // If the clicked cell is dotted, the move is valid
        clickedCell.piece = selectedCell.piece
        selectedCell.piece = null
        selectedCell.selected = false
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
          const targetCell = board[targetIy][targetIx]
          const draggedCell = board[drag.iy][drag.ix]

          if (targetCell.dotted) {
            // Valid move - move the piece
            targetCell.piece = draggedCell.piece
            draggedCell.piece = null
          }
        }
      }

      // Reset drag state and selection
      drag.active = false
      drag.dx = 0
      drag.dy = 0
      board.forEach((row) => row.forEach((cell) => (cell.selected = false)))
    }
  }

  function isBeingDragged(cell: ChessCell): boolean {
    return drag.active && cell.ix === drag.ix && cell.iy === drag.iy
  }

  let moveHistory = $state<ChessMove[]>([])
  let board = $derived(getBoardFromHistory(moveHistory))
  let drag: DragInfo = $state({ active: false, dx: 0, dy: 0, ix: 0, iy: 0 })
  let dottingCellArray = $derived(computeMovement(board))

  $effect(() => {
    // Reset dotted state
    board.forEach((row) => row.forEach((cell) => (cell.dotted = false)))
    // Set dotted state based on dottingCellArray
    dottingCellArray.forEach((cell) => (cell.dotted = true))
  })

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
  {#each [...board].reverse() as row, iy}
    <div class="flex flex-row">
      <ChessBoardNumberCell {iy} />
      {#each row as cell}
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
      <ChessSquare piece={board[drag.iy][drag.ix].piece} />
    </div>
  {/if}
</div>
