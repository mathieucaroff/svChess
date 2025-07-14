<script lang="ts">
  import { formatMove } from './notation.js'

  interface Props {
    moveHistory: ChessMove[]
    onMoveClick?: (moveIndex: number) => void
  }

  const { moveHistory, onMoveClick }: Props = $props()

  // Group moves into pairs (white, black)
  function getMovePairs(moves: ChessMove[]) {
    const pairs: Array<{
      moveNumber: number
      white?: ChessMove
      black?: ChessMove
      whiteIndex?: number
      blackIndex?: number
    }> = []

    for (let i = 0; i < moves.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1
      const white = moves[i]
      const black = moves[i + 1]

      pairs.push({
        moveNumber,
        white,
        black,
        whiteIndex: i,
        blackIndex: black ? i + 1 : undefined,
      })
    }

    return pairs
  }

  function handleMoveClick(moveIndex: number) {
    onMoveClick?.(moveIndex)
  }
</script>

<div class="h-full w-80 overflow-y-auto border-l border-gray-200 bg-gray-50 p-4">
  <h2 class="mb-4 text-lg font-bold text-gray-800">Move History</h2>

  {#if moveHistory.length === 0}
    <p class="text-gray-500 italic">No moves yet</p>
  {:else}
    <div class="space-y-1">
      {#each getMovePairs(moveHistory) as pair}
        <div class="flex items-center space-x-2 rounded p-2 hover:bg-gray-100">
          <!-- Move number -->
          <span class="w-8 text-xs font-bold text-gray-600">{pair.moveNumber}.</span>

          <!-- White move -->
          <button
            class="flex-1 rounded px-2 py-1 text-left font-mono text-sm transition-colors hover:bg-blue-100"
            onclick={() => pair.whiteIndex !== undefined && handleMoveClick(pair.whiteIndex)}
          >
            {pair.white ? formatMove(pair.white) : ''}
          </button>

          <!-- Black move -->
          <button
            class="flex-1 rounded px-2 py-1 text-left font-mono text-sm transition-colors hover:bg-blue-100 {pair.black
              ? ''
              : 'opacity-50'}"
            onclick={() => pair.blackIndex !== undefined && handleMoveClick(pair.blackIndex)}
            disabled={!pair.black}
          >
            {pair.black ? formatMove(pair.black) : '...'}
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <div class="mt-6 border-t border-gray-200 pt-4">
    <p class="text-xs text-gray-500">
      Total moves: {moveHistory.length}
    </p>
    {#if moveHistory.length > 0}
      <p class="text-xs text-gray-500">
        Current turn: {moveHistory.length % 2 === 0 ? 'White' : 'Black'}
      </p>
    {/if}
  </div>
</div>
