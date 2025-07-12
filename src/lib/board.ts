export function getBoardFromHistory(history: ChessMove[]): ChessCell[][] {
  let board: ChessCell[][] = Array.from({ length: 8 }, (_, iy) =>
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

  history.forEach((move) => {
    const fromCell = board[move.from.iy][move.from.ix]
    const toCell = board[move.to.iy][move.to.ix]

    if (!fromCell?.piece) {
      console.error(`No piece at from cell: ${fromCell.id} while computing board from history`)
      return
    }
    if (
      fromCell.piece.type === 'pawn' &&
      Math.abs(move.from.ix - move.to.ix) === 1 &&
      !toCell.piece
    ) {
      // En passant capture
      const enPassantCell = board[move.from.iy][move.to.ix]
      if (
        enPassantCell.piece?.type === 'pawn' &&
        enPassantCell.piece.color !== fromCell.piece.color
      ) {
        enPassantCell.piece = null // Remove the captured pawn
      } else {
        console.error(
          `Invalid en passant move from ${move.from.id} to ${move.to.id}, no pawn to capture`,
        )
        return
      }
    } else {
      // Move the piece
      toCell.piece = fromCell.piece
      fromCell.piece = null
    }
  })

  return board
}
