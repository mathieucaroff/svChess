const movementRecord: Record<string, { stepList: [number, number][]; limit: number }> = {
  knight: {
    stepList: [
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ],
    limit: 1,
  },
  bishop: {
    stepList: [
      [1, -1],
      [1, 1],
    ],
    limit: 7,
  },
  rook: {
    stepList: [
      [1, 0],
      [0, 1],
    ],
    limit: 7,
  },
}

movementRecord.queen = {
  stepList: [...movementRecord.bishop.stepList, ...movementRecord.rook.stepList],
  limit: 7,
}

movementRecord.king = {
  stepList: movementRecord.queen.stepList,
  limit: 1,
}

export function computeMovement(board: ChessCell[][]): ChessCell[] {
  // Selected Cell
  const sc = board.flat().find((cell) => cell.selected)

  if (!sc || !sc.piece) {
    return []
  }

  const playingColor = sc.piece.color

  const up = playingColor === 'black' ? -1 : 1

  const moveList: ChessCell[] = []

  // Pawn movement
  if (sc.piece.type === 'pawn') {
    // Move forward
    const forwardCell = board[sc.iy + up]?.[sc.ix]
    if (!forwardCell?.piece) {
      moveList.push(forwardCell)
      // Forward two squares from starting position
      const twiceForwardCell = board[sc.iy + up * 2]?.[sc.ix]
      if (sc.iy === (playingColor === 'black' ? 6 : 1) && !twiceForwardCell?.piece) {
        moveList.push(twiceForwardCell)
      }
    }
    // Capture left/right
    ;[-1, 1].forEach((dx) => {
      const diagonalCell = board[sc.iy + up]?.[sc.ix + dx]
      if (diagonalCell?.piece && diagonalCell.piece.color !== playingColor) {
        moveList.push(diagonalCell)
      } else if (!diagonalCell?.piece) {
        // Allow en passant capture
        const sidePiece = board[sc.iy]?.[sc.ix + dx]?.piece
        if (sidePiece?.type === 'pawn' && sidePiece.color !== playingColor) {
          moveList.push(diagonalCell)
        }
      }
    })
  } else {
    // Other pieces
    const { stepList, limit } = movementRecord[sc.piece.type]
    stepList.forEach(([dy, dx]) => {
      const addCell = (k: number) => {
        const targetCell = board[sc.iy + dy * k]?.[sc.ix + dx * k]
        if (targetCell) {
          if (!targetCell.piece || targetCell.piece.color !== playingColor) {
            moveList.push(targetCell)
          }
          // Stop if we hit a piece
          if (targetCell.piece) {
            return true
          }
        }
      }
      Array.from({ length: limit }).some((_, i) => addCell(i + 1))
      Array.from({ length: limit }).some((_, i) => addCell(-i - 1))
    })
  }
  return moveList
}
