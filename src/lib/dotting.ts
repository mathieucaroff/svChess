export function computeDotting(board: ChessCell[][]): ChessCell[] {
  // Selected Cell
  const sc = board.flat().find((cell) => cell.selected)

  if (!sc || !sc.piece) {
    return []
  }

  const playingColor = sc.piece.color

  const up = playingColor === 'black' ? -1 : 1

  function getDottingProposal(sc: ChessCell, type: PieceType): Pair[] {
    return (
      {
        pawn: (): Pair[] => {
          return [
            [sc.ix - 1, sc.iy + up],
            [sc.ix, sc.iy + up],
            [sc.ix, sc.iy + up * 2],
            [sc.ix + 1, sc.iy + up],
          ]
        },
        knight: (): Pair[] => {
          return [
            [sc.ix + 1, sc.iy + 2],
            [sc.ix + 2, sc.iy + 1],
            [sc.ix + 2, sc.iy - 1],
            [sc.ix + 1, sc.iy - 2],
            [sc.ix - 1, sc.iy - 2],
            [sc.ix - 2, sc.iy - 1],
            [sc.ix - 2, sc.iy + 1],
            [sc.ix - 1, sc.iy + 2],
          ]
        },
        bishop: (): Pair[] => {
          const proposal: [number, number][] = []
          Array.from({ length: 7 }, (_, i) => {
            proposal.push([sc.ix + i, sc.iy + i])
            proposal.push([sc.ix - i, sc.iy + i])
            proposal.push([sc.ix - i, sc.iy - i])
            proposal.push([sc.ix + i, sc.iy - i])
          })
          return proposal
        },
        rook: (): Pair[] => {
          const proposal: [number, number][] = []
          Array.from({ length: 7 }, (_, i) => {
            if (i !== sc.ix) {
              proposal.push([i, sc.iy])
            }
            if (i !== sc.iy) {
              proposal.push([sc.ix, i])
            }
          })
          return proposal
        },
        queen: (): Pair[] => {
          return [...getDottingProposal(sc, 'bishop'), ...getDottingProposal(sc, 'rook')]
        },
        king: (): Pair[] => {
          return [
            [sc.ix + 0, sc.iy + 1],
            [sc.ix + 1, sc.iy + 1],
            [sc.ix + 1, sc.iy - 0],
            [sc.ix + 1, sc.iy - 1],
            [sc.ix + 0, sc.iy - 1],
            [sc.ix - 1, sc.iy - 1],
            [sc.ix - 1, sc.iy + 0],
            [sc.ix - 1, sc.iy + 1],
          ]
        },
      }[type] ?? (() => [])
    )()
  }

  const dotting: ChessCell[] = []

  getDottingProposal(sc, sc.piece.type).forEach(([ix, iy]) => {
    let cell = board[iy]?.[ix]
    if (cell && cell.piece?.color !== playingColor) {
      dotting.push(board[iy][ix])
    }
  })

  return dotting
}
