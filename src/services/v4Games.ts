export type AdventureAction = 'run' | 'jump' | 'crouch'
export type AdventureObstacle = {at: number; action: Exclude<AdventureAction, 'run'>}

export function advanceAdventure(
  distance: number,
  amount: number,
  action: AdventureAction,
  obstacle?: AdventureObstacle,
) {
  const next = Math.min(100, distance + amount)
  if (obstacle && distance < obstacle.at && next >= obstacle.at) {
    if (action !== obstacle.action) return {distance, cleared: false, bumped: true}
    return {distance: next, cleared: true, bumped: false}
  }
  return {distance: next, cleared: false, bumped: false}
}

export function placeBuildingPiece(
  placed: Record<string, boolean>,
  piece: string,
  slot: string,
) {
  if (piece !== slot || placed[slot]) return {placed, accepted: false, complete: Object.values(placed).every(Boolean)}
  const next = {...placed, [slot]: true}
  return {placed: next, accepted: true, complete: Object.values(next).every(Boolean)}
}

export function checkRhythmInput(pattern: readonly number[], entered: readonly number[], next: number) {
  const index = entered.length
  const correct = pattern[index] === next
  return {correct, complete: correct && index + 1 === pattern.length}
}

export type PetNeeds = {fullness: number; clean: number; energy: number; happiness: number}
export type PetCareAction = 'feed' | 'bath' | 'sleep' | 'play'

export function careForPet(needs: PetNeeds, action: PetCareAction): PetNeeds {
  const next = {...needs, happiness: Math.min(100, needs.happiness + 10)}
  if (action === 'feed') next.fullness = Math.min(100, needs.fullness + 25)
  if (action === 'bath') next.clean = Math.min(100, needs.clean + 25)
  if (action === 'sleep') next.energy = Math.min(100, needs.energy + 25)
  if (action === 'play') next.happiness = Math.min(100, needs.happiness + 25)
  return next
}
