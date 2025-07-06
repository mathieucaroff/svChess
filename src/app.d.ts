// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  type WhiteOrBlack = 'white' | 'black'
  type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'
  type ChessBoard = Square[][]
  interface Square {
    id: string
    color: WhiteOrBlack
    piece: Piece | null
  }
  interface Piece {
    type: PieceType
    color: WhiteOrBlack
  }
  interface ChessCell {
    id: string
    ix: number
    iy: number
    color: WhiteOrBlack
    piece: Piece | null
    selected: boolean
    dotted?: boolean
  }

  type Pair = [number, number]

  interface DragInfo {
    active: boolean
    // The position of the mouse when dragging started
    startX: number
    startY: number
    // The current position of the mouse, relative to its starting position
    dx: number
    dy: number
    // The position of the piece being dragged
    ix: number
    iy: number
  }
}

export {}
