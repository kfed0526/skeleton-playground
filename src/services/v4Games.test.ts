import {expect, it} from 'vitest'
import {advanceAdventure, careForPet, checkRhythmInput, placeBuildingPiece} from './v4Games'

it('moves through a friendly adventure without losing progress after a bump', () => {
  expect(advanceAdventure(18, 2, 'jump', {at: 20, action: 'jump'})).toEqual({distance: 20, cleared: true, bumped: false})
  expect(advanceAdventure(18, 2, 'run', {at: 20, action: 'jump'})).toEqual({distance: 18, cleared: false, bumped: true})
  expect(advanceAdventure(99, 2, 'run')).toEqual({distance: 100, cleared: false, bumped: false})
})

it('improves pet needs while clamping every meter at one hundred', () => {
  const needs = {fullness: 90, clean: 55, energy: 40, happiness: 60}
  expect(careForPet(needs, 'feed')).toEqual({fullness: 100, clean: 55, energy: 40, happiness: 70})
  expect(careForPet(needs, 'bath')).toEqual({fullness: 90, clean: 80, energy: 40, happiness: 70})
  expect(careForPet(needs, 'sleep')).toEqual({fullness: 90, clean: 55, energy: 65, happiness: 70})
})

it('reports rhythm progress without punishment', () => {
  expect(checkRhythmInput([0, 2, 1], [0, 2], 1)).toEqual({correct: true, complete: true})
  expect(checkRhythmInput([0, 2, 1], [0], 3)).toEqual({correct: false, complete: false})
})

it('snaps a construction piece only into its matching blueprint slot', () => {
  const placed = {base: false, roof: false, door: false}
  expect(placeBuildingPiece(placed, 'roof', 'base')).toEqual({placed, accepted: false, complete: false})
  expect(placeBuildingPiece(placed, 'roof', 'roof')).toEqual({
    placed: {base: false, roof: true, door: false}, accepted: true, complete: false,
  })
  expect(placeBuildingPiece({base: true, roof: false, door: true}, 'roof', 'roof').complete).toBe(true)
})
