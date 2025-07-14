<script lang="ts">
  import { formatMove } from './notation.js'

  interface Props {
    moveHistory: ChessHalfMove[]
    onMoveClick?: (moveIndex: number) => void
  }

  const { moveHistory, onMoveClick }: Props = $props()

  // Group moves into pairs (white, black)
  function getMovePairs(moves: ChessHalfMove[]) {
    const pairs: Array<{
      moveNumber: number
      white?: ChessHalfMove
      black?: ChessHalfMove
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

<div class="h-full w-80 overflow-y-auto p-3">
  <h2 class="mb-3 text-base font-bold text-gray-800 dark:text-gray-200">Move History</h2>

  {#if moveHistory.length === 0}
    <p class="text-sm text-gray-500 italic dark:text-gray-400">No moves yet</p>
  {:else}
    <div class="space-y-0.5">
      {#each getMovePairs(moveHistory) as pair}
        <div
          class="flex items-center space-x-1 rounded px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <!-- Move number -->
          <span class="w-6 text-xs font-semibold text-gray-600 dark:text-gray-400"
            >{pair.moveNumber}.</span
          >

          <!-- White move -->
          <button
            class="flex-1 rounded px-1 py-0.5 text-left font-mono text-xs transition-colors hover:bg-blue-100 dark:text-gray-200 dark:hover:bg-blue-900"
            onclick={() => pair.whiteIndex !== undefined && handleMoveClick(pair.whiteIndex)}
          >
            {pair.white ? formatMove(pair.white) : ''}
          </button>

          <!-- Black move -->
          <button
            class="flex-1 rounded px-1 py-0.5 text-left font-mono text-xs transition-colors hover:bg-blue-100 dark:text-gray-200 dark:hover:bg-blue-900 {pair.black
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

  <div class="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
    <p class="text-xs text-gray-500 dark:text-gray-400">
      Total moves: {moveHistory.length}
    </p>
    {#if moveHistory.length > 0}
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Current turn: {moveHistory.length % 2 === 0 ? 'White' : 'Black'}
      </p>
    {/if}
  </div>
</div>
