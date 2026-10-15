export type PuzzleSize = 2 | 3 | 4 | 6 | 9

export function createPuzzle(size: PuzzleSize, random = Math.random) {
  const pieces = Array.from({length: size * size}, (_, index) => index)
  for (let index = pieces.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1))
    ;[pieces[index], pieces[target]] = [pieces[target], pieces[index]]
  }
  if (pieces.every((piece, index) => piece === index)) {
    ;[pieces[0], pieces[1]] = [pieces[1], pieces[0]]
  }
  return pieces
}

export function swapPuzzlePieces(pieces: readonly number[], first: number, second: number) {
  const next = [...pieces]
  ;[next[first], next[second]] = [next[second], next[first]]
  return next
}

export function isPuzzleSolved(pieces: readonly number[]) {
  return pieces.every((piece, index) => piece === index)
}

export function placePuzzlePiece(
  board: readonly (number | null)[],
  tray: readonly number[],
  trayIndex: number,
  slotIndex: number,
) {
  const piece = tray[trayIndex]
  if (piece !== slotIndex || board[slotIndex] !== null) return {board, tray, placed: false}
  const nextBoard = [...board]
  nextBoard[slotIndex] = piece
  return {
    board: nextBoard,
    tray: tray.filter((_, index) => index !== trayIndex),
    placed: true,
  }
}
