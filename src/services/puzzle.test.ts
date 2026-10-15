import {expect, it} from 'vitest'
import {createPuzzle, isPuzzleSolved, placePuzzlePiece, swapPuzzlePieces} from './puzzle'

it('creates a scrambled board with every piece for each difficulty', () => {
  expect(createPuzzle(3, () => 0)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 0])
  for (const size of [3, 6, 9] as const) {
    const board = createPuzzle(size, () => 0)
    expect(board).toHaveLength(size * size)
    expect(new Set(board).size).toBe(size * size)
  }
})

it('snaps a correct piece into its slot and leaves a wrong piece in the tray', () => {
  const board = [null, null, null, null]
  const tray = [2, 0, 1, 3]
  expect(placePuzzlePiece(board, tray, 0, 0)).toEqual({board, tray, placed: false})
  expect(placePuzzlePiece(board, tray, 1, 0)).toEqual({
    board: [0, null, null, null],
    tray: [2, 1, 3],
    placed: true,
  })
})

it('swaps two chosen pieces and reports when the picture is complete', () => {
  const almostSolved = [1, 0, 2, 3, 4, 5, 6, 7, 8]
  const completed = swapPuzzlePieces(almostSolved, 0, 1)
  expect(completed).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  expect(almostSolved).toEqual([1, 0, 2, 3, 4, 5, 6, 7, 8])
  expect(isPuzzleSolved(completed)).toBe(true)
  expect(isPuzzleSolved(almostSolved)).toBe(false)
})
