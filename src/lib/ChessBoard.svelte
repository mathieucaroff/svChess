<script lang="ts">
  import ChessSquare from './ChessSquare.svelte'
  import { computeDotting } from './dotting.js'

  interface Props {
    class?: string
  }

  const { class: className }: Props = $props()

  const handleSquareClick = (clickedCell: ChessCell) => {
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
  let dottingCellArray = $derived(computeDotting(board))

  $effect(() => {
    // Reset dotted state
    board.forEach((row) => row.forEach((cell) => (cell.dotted = false)))
    // Set dotted state based on dottingCellArray
    dottingCellArray.forEach((cell) => (cell.dotted = true))
  })
</script>

<div class={className}>
  {#each [...board].reverse() as row}
    <div class="flex flex-row">
      {#each row as clickedCell}
        <ChessSquare
          color={clickedCell.color}
          piece={clickedCell.piece}
          selected={clickedCell.selected}
          dotted={clickedCell.dotted}
          onclick={() => handleSquareClick(clickedCell)}
        />
      {/each}
    </div>
  {/each}
</div>
