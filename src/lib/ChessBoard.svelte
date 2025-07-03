<script lang="ts">
  import ChessSquare from './ChessSquare.svelte'
  import { computeDotting } from './dotting.js'

  interface Props {
    class?: string
  }

  let { class: className }: Props = $props()

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
  {#each board as row}
    <div class="flex flex-row">
      {#each row as cell}
        <ChessSquare
          color={cell.color}
          piece={cell.piece}
          selected={cell.selected}
          dotted={cell.dotted}
          onclick={() => {
            if (cell.piece) {
              if (cell.selected) {
                cell.selected = false // Deselect if already selected
              } else {
                board.forEach((r) => r.forEach((c) => (c.selected = false))) // Deselect all cells
                cell.selected = true
              }
            }
          }}
        />
      {/each}
    </div>
  {/each}
</div>
