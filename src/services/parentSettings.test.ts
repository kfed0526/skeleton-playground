import {expect, it, vi} from 'vitest'
import {readEnabledGameIds, saveEnabledGameIds, verifyParentPassword} from './parentSettings'

const allGameIds = [
  'ghost-maze', 'pumpkin-pop', 'skeleton-rocket', 'fishing', 'candy-catch',
  'pinball', 'monster-stack', 'ghost-race', 'skeleton-shooter', 'drums',
  'trampoline', 'candy-monster', 'hide-ghost', 'dance', 'bowling', 'bubbles',
  'dressup', 'fireworks',
]

it('shows every game until a parent saves a custom game library', () => {
  vi.stubGlobal('localStorage', {getItem: () => null})
  expect(readEnabledGameIds()).toEqual(allGameIds)
  vi.unstubAllGlobals()
})

it('restores only valid and unique games from the saved library', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => JSON.stringify(['dance', 'unknown-game', 'dance', 'ghost-maze']),
  })
  expect(readEnabledGameIds()).toEqual(['dance', 'ghost-maze'])
  vi.unstubAllGlobals()
})

it('saves the checked games as the active game library', () => {
  const setItem = vi.fn()
  vi.stubGlobal('localStorage', {setItem})
  saveEnabledGameIds(['fireworks', 'dance', 'fireworks'])
  expect(setItem).toHaveBeenCalledWith(
    'skeleton-enabled-games-v1',
    JSON.stringify(['fireworks', 'dance']),
  )
  vi.unstubAllGlobals()
})

it('unlocks parent management only with the six-digit default password', () => {
  expect(verifyParentPassword('666666')).toBe(true)
  expect(verifyParentPassword('66666')).toBe(false)
  expect(verifyParentPassword('6666666')).toBe(false)
  expect(verifyParentPassword('123456')).toBe(false)
})
