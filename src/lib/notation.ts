const typeToLetter: Record<string, string> = {
  pawn: '',
  knight: 'N',
  bishop: 'B',
  rook: 'R',
  queen: 'Q',
  king: 'K',
}

export function formatMove(move: ChessHalfMove): string {
  const piece = move.from.piece
  if (!piece) return '???'

  const pieceSymbol = typeToLetter[piece.type]
  const fromSquare = `${String.fromCharCode(97 + move.from.ix)}${move.from.iy + 1}`
  const toSquare = `${String.fromCharCode(97 + move.to.ix)}${move.to.iy + 1}`
  const capture = move.to.piece ? 'x' : ''

  return `${pieceSymbol}${fromSquare}${capture}${toSquare}`
}
