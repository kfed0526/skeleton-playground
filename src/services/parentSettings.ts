import {games} from './play'
import type {GameId} from './play'

const GAME_LIBRARY_KEY = 'skeleton-enabled-games-v1'
const DEFAULT_PARENT_PASSWORD = '666666'
const allGameIds = games.map(game => game.id)
const validGameIds = new Set<string>(allGameIds)

export function readEnabledGameIds(): GameId[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(GAME_LIBRARY_KEY) ?? 'null')
    if (!Array.isArray(saved)) return [...allGameIds]
    return [...new Set(saved.filter((id): id is GameId => typeof id === 'string' && validGameIds.has(id)))]
  } catch {
    return [...allGameIds]
  }
}

export function saveEnabledGameIds(gameIds: readonly GameId[]) {
  const enabled = [...new Set(gameIds.filter(id => validGameIds.has(id)))]
  try {
    localStorage.setItem(GAME_LIBRARY_KEY, JSON.stringify(enabled))
  } catch {}
  return enabled
}

export function verifyParentPassword(password: string) {
  return /^\d{6}$/.test(password) && password === DEFAULT_PARENT_PASSWORD
}
