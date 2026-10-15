import {useState} from 'react'
import {createPuzzle, isPuzzleSolved, swapPuzzlePieces} from '../services/puzzle'
import type {PuzzleSize} from '../services/puzzle'
import {sound} from '../services/sound'
import './puzzle-game.css'

const difficulties: {size: PuzzleSize; label: string; hint: string}[] = [
  {size: 3, label: '3 × 3', hint: '輕鬆'},
  {size: 6, label: '6 × 6', hint: '挑戰'},
  {size: 9, label: '9 × 9', hint: '高手'},
]

export default function PuzzleGame() {
  const [size, setSize] = useState<PuzzleSize>(3)
  const [pieces, setPieces] = useState(() => createPuzzle(3))
  const [selected, setSelected] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const complete = isPuzzleSolved(pieces)

  const restart = (nextSize: PuzzleSize = size) => {
    setSize(nextSize)
    setPieces(createPuzzle(nextSize))
    setSelected(null)
    setMoves(0)
    sound.effect('change')
  }

  const choosePiece = (index: number) => {
    if (complete) return
    if (selected === null) {
      setSelected(index)
      sound.effect('pop')
      return
    }
    if (selected === index) {
      setSelected(null)
      return
    }
    const next = swapPuzzlePieces(pieces, selected, index)
    setPieces(next)
    setSelected(null)
    setMoves(current => current + 1)
    sound.effect(isPuzzleSolved(next) ? 'spark' : 'change')
  }

  return <div className="puzzle-game">
    <p className="instruction">先點一片，再點另一片交換位置，把萬聖節橫幅拼回來！</p>
    <div className="puzzle-toolbar" aria-label="選擇拼圖難度">
      {difficulties.map(difficulty => <button
        key={difficulty.size}
        aria-pressed={size === difficulty.size}
        onClick={() => restart(difficulty.size)}
      >
        <strong>{difficulty.label}</strong>
        <small>{difficulty.hint}</small>
      </button>)}
    </div>
    <div className="puzzle-layout">
      <aside className="puzzle-preview">
        <span>完整圖片</span>
        <img src={`${import.meta.env.BASE_URL}puzzle-scene.svg`} alt="月光下骨頭人與幽靈參加南瓜派對的完整拼圖" />
        <button className="soft-button" onClick={() => restart()}>重新洗牌</button>
      </aside>
      <div
        className={`puzzle-board puzzle-${size} ${complete ? 'is-complete' : ''}`}
        style={{'--puzzle-size': size} as React.CSSProperties}
        aria-label={`${size} 乘 ${size} 拼圖區`}
      >
        {pieces.map((piece, index) => {
          const column = piece % size
          const row = Math.floor(piece / size)
          const positionX = column / (size - 1) * 100
          const positionY = row / (size - 1) * 100
          return <button
            key={`${size}-${index}`}
            className="puzzle-piece"
            aria-label={`拼圖片 ${index + 1}`}
            aria-pressed={selected === index}
            onClick={() => choosePiece(index)}
            style={{
              backgroundPosition: `${positionX}% ${positionY}%`,
              backgroundSize: `${size * 100}% ${size * 100}%`,
            }}
          ><span>{piece + 1}</span></button>
        })}
        {complete && <div className="puzzle-complete" role="alert">🎉 拼好了！太厲害了！</div>}
      </div>
    </div>
    <p className="puzzle-status" role="status">
      {complete ? `完成！一共移動 ${moves} 次` : selected === null ? `已移動 ${moves} 次・請選一片` : `已移動 ${moves} 次・再選一片交換`}
    </p>
  </div>
}
