<script lang="ts">
  import '../app.css'
  import ChessBoard from '$lib/ChessBoard.svelte'
  import MoveHistory from '$lib/MoveHistory.svelte'

  let moveHistory = $state<ChessHalfMove[]>([])

  function handleMove(move: ChessHalfMove) {
    moveHistory = [...moveHistory, move]
  }

  function handleMoveClick(moveIndex: number) {
    // For now, just show moves up to that point
    // Later we could implement move navigation
    console.log('Clicked move:', moveIndex, moveHistory[moveIndex])
  }

  function resetGame() {
    moveHistory = []
  }
</script>

<div class="flex h-screen">
  <div class="flex flex-1 items-center justify-center">
    <ChessBoard {moveHistory} onMove={handleMove} />
  </div>
  <div
    class="flex flex-col border-l border-gray-200 bg-gray-50 pt-18 dark:border-gray-700 dark:bg-gray-900"
  >
    <div class="border-b p-4">
      <button
        onclick={resetGame}
        class="w-full rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Reset Game
      </button>
    </div>
    <MoveHistory {moveHistory} onMoveClick={handleMoveClick} />
  </div>
</div>
