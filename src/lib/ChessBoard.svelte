<script lang="ts">
  import ChessBoardLetterBar from './ChessBoardLetterBar.svelte'
  import ChessBoardNumberCell from './ChessBoardNumberCell.svelte'
  import ChessSquare from './ChessSquare.svelte'
  import { computeDotting } from './dotting.js'

  interface Props {
    class?: string
  }

  const { class: className }: Props = $props()

  const handleSquareMouseDown = (clickedCell: ChessCell, ev: MouseEvent) => {
    const selectedCell = board.flat().find((c) => c.selected)
    if (selectedCell) {
      if (!selectedCell.piece) {
        console.error('Selected cell has no piece')
        return
      }
      if (clickedCell.selected) {
        // If the clicked cell is already selected, deselect it
        clickedCell.selected = false
      } else if (clickedCell.dotted) {
        // If the clicked cell is dotted, the move is valid
        clickedCell.piece = selectedCell.piece
        selectedCell.piece = null
        selectedCell.selected = false
      } else if (clickedCell.piece) {
        // Change the selection
        selectedCell.selected = false
        clickedCell.selected = true
      }
    } else {
      if (clickedCell.piece) {
        clickedCell.selected = true
      }
    }

    if (clickedCell.selected) {
      drag.active = true
      drag.startX = ev.clientX
      drag.startY = ev.clientY
      drag.ix = clickedCell.ix
      drag.iy = clickedCell.iy
    }
  }

  const handleMouseMove = (ev: MouseEvent) => {
    if (drag.active) {
      drag.dx = ev.clientX - drag.startX
      drag.dy = ev.clientY - drag.startY
    }
  }

  const handleSquareMouseUp = (ev: MouseEvent) => {
    drag.active = false
  }

  function isBeingDragged(cell: ChessCell): boolean {
    return drag.active && cell.ix === drag.ix && cell.iy === drag.iy
  }

  let boardBase: ChessCell[][] = Array.from({ length: 8 }, (_, iy) =>
    Array.from({ length: 8 }, (_, ix) => {
      const squareColor: WhiteOrBlack = (ix + iy) % 2 === 0 ? 'white' : 'black'
      const color: WhiteOrBlack = iy < 4 ? 'white' : 'black'
      const type: PieceType | null =
        iy === 1 || iy === 6
          ? 'pawn'
          : iy === 0 || iy === 7
            ? (['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'] as const)[
                ix
              ]
            : null
      return {
        id: `${ix}-${iy}`,
        ix,
        iy,
        color: squareColor,
        piece: type ? { color, type } : null,
        selected: false,
        dotted: false,
      }
    }),
  )

  let board = $state(boardBase)
  let drag: DragInfo = $state({ active: false, startX: 0, startY: 0, dx: 0, dy: 0, ix: 0, iy: 0 })
  let dottingCellArray = $derived(computeDotting(board))

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
          onmousedown={(ev: MouseEvent) => handleSquareMouseDown(cell, ev)}
        />
      {/each}
      <ChessBoardNumberCell {iy} />
    </div>
  {/each}
  <ChessBoardLetterBar />
  {#if drag.active}
    <div class="pointer-events-none relative">
      <div class="absolute" style:left={-drag.dx} style:top={-drag.dy}>
        <ChessSquare piece={board[drag.iy][drag.ix].piece} />
      </div>
    </div>
  {/if}
</div>
