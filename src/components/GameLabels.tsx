import type {GameInfo} from '../services/play'

export default function GameLabels({game}: {game: GameInfo}) {
  return <span className="game-labels">
    <span className="difficulty-label">{game.difficulty === '輕鬆' ? '●' : game.difficulty === '適中' ? '●●' : '●●●'} {game.difficulty}</span>
    <span className="age-label">建議 {game.minAge} 歲以上</span>
  </span>
}
