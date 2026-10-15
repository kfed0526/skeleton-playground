import {useRef, useState} from 'react'
import type {PointerEvent} from 'react'
import {createPuzzle, placePuzzlePiece} from '../services/puzzle'
import type {PuzzleSize} from '../services/puzzle'
import {sound} from '../services/sound'
import './puzzle-game.css'

const themes = [
  {id: 'pumpkin', name: '開心南瓜', emoji: '🎃', file: 'puzzles/happy-pumpkin.svg'},
  {id: 'ghost', name: '跳舞幽靈', emoji: '👻', file: 'puzzles/dancing-ghost.svg'},
  {id: 'car', name: '骨頭人開車', emoji: '🚗', file: 'puzzles/skeleton-car.svg'},
  {id: 'castle', name: '南瓜城堡', emoji: '🏰', file: 'puzzle-scene.svg'},
  {id: 'icecream', name: '怪獸冰淇淋店', emoji: '🍦', file: 'puzzles/ice-cream-shop.svg'},
  {id: 'train', name: '南瓜小火車', emoji: '🚂', file: 'puzzles/pumpkin-train.svg'},
] as const

const difficulties: {size: PuzzleSize; label: string; hint: string}[] = [
  {size: 2, label: '2 × 2', hint: '簡單'},
  {size: 3, label: '3 × 3', hint: '普通'},
  {size: 4, label: '4 × 4', hint: '挑戰'},
  {size: 6, label: '6 × 6', hint: '高手'},
  {size: 9, label: '9 × 9', hint: '大師'},
]

export default function PuzzleGame() {
  const [themeIndex, setThemeIndex] = useState(0)
  const [size, setSize] = useState<PuzzleSize>(2)
  const [tray, setTray] = useState(() => createPuzzle(2))
  const [board, setBoard] = useState<(number | null)[]>(() => Array(4).fill(null))
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const [hintSlot, setHintSlot] = useState<number | null>(null)
  const [showGuide, setShowGuide] = useState(true)
  const [message, setMessage] = useState('選一片，再點圖片中相同的位置！')
  const draggedPiece = useRef<number | null>(null)
  const suppressClick = useRef(false)
  const theme = themes[themeIndex]
  const imageUrl = `${import.meta.env.BASE_URL}${theme.file}`
  const complete = tray.length === 0

  const restart = (nextSize: PuzzleSize = size, nextTheme = themeIndex) => {
    setSize(nextSize)
    setThemeIndex(nextTheme)
    setTray(createPuzzle(nextSize))
    setBoard(Array(nextSize * nextSize).fill(null))
    setSelectedPiece(null)
    setHintSlot(null)
    setMessage('新拼圖準備好囉！選一片開始吧！')
    sound.effect('change')
  }
  const place = (piece: number, slot: number) => {
    const trayIndex = tray.indexOf(piece)
    if (trayIndex < 0) return
    const result = placePuzzlePiece(board, tray, trayIndex, slot)
    if (!result.placed) {
      setMessage('差一點！拼圖片回到下面了，再看看完整圖片。')
      setHintSlot(slot)
      sound.effect('change')
      return
    }
    setBoard([...result.board])
    setTray([...result.tray])
    setSelectedPiece(null)
    setHintSlot(null)
    if (result.tray.length === 0) {
      setMessage('🎉 拼好了！星星和彩帶都來慶祝！')
      sound.effect('spark')
    } else {
      setMessage(`放對了！還有 ${result.tray.length} 片。`)
      sound.effect('pop')
    }
  }
  const pieceStyle = (piece: number) => {
    const column = piece % size
    const row = Math.floor(piece / size)
    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundPosition: `${column / (size - 1) * 100}% ${row / (size - 1) * 100}%`,
      backgroundSize: `${size * 100}% ${size * 100}%`,
    }
  }
  const pointerDown = (event: PointerEvent<HTMLButtonElement>, piece: number) => {
    draggedPiece.current = piece
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const pointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const piece = draggedPiece.current
    draggedPiece.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (piece === null) return
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-slot-index]')
    if (target) {
      suppressClick.current = true
      place(piece, Number(target.dataset.slotIndex))
      window.setTimeout(() => { suppressClick.current = false }, 0)
    }
  }

  return <div className="puzzle-game-v3">
    <p className="instruction">拖曳拼圖片到正確位置，也可以先點拼圖片、再點空格。</p>
    <div className="puzzle-theme-picker" aria-label="選擇拼圖圖片">{themes.map((item, index) => <button
      key={item.id}
      aria-label={`選擇拼圖：${item.name}`}
      aria-pressed={themeIndex === index}
      onClick={() => restart(size, index)}
    ><span>{item.emoji}</span><small>{item.name}</small></button>)}</div>
    <div className="puzzle-toolbar" aria-label="選擇拼圖難度">{difficulties.map(difficulty => <button
      key={difficulty.size}
      aria-pressed={size === difficulty.size}
      onClick={() => restart(difficulty.size)}
    ><strong>{difficulty.label}</strong><small>{difficulty.hint}</small></button>)}</div>
    <div className="puzzle-v3-layout">
      <aside className="puzzle-preview-v3">
        <strong>完整圖片</strong><img src={imageUrl} alt={`${theme.name}完整拼圖`}/>
        <button className="soft-button" onClick={() => setShowGuide(value => !value)}>{showGuide ? '隱藏底圖' : '顯示底圖'}</button>
        <button className="soft-button" onClick={() => {const piece = selectedPiece ?? tray[0]; setSelectedPiece(piece); setHintSlot(piece); setMessage('閃亮的格子就是這片的位置！')}}>💡 提示位置</button>
        <button className="soft-button" onClick={() => restart()}>↻ 重新拼圖</button>
      </aside>
      <div className="puzzle-play-area">
        <div className="puzzle-place-board" style={{'--puzzle-size': size, '--guide-image': `url(${imageUrl})`} as React.CSSProperties} aria-label={`${size} 乘 ${size} 拼圖區`}>
          {board.map((piece, slot) => <button
            key={slot}
            className={`puzzle-slot ${hintSlot === slot ? 'hinted' : ''}`}
            aria-label={`拼圖位置 ${slot + 1}`}
            data-slot-index={slot}
            data-filled={piece !== null ? 'true' : 'false'}
            disabled={piece !== null}
            onClick={() => selectedPiece !== null && place(selectedPiece, slot)}
          >
            {showGuide && piece === null && <span className="puzzle-guide" style={pieceStyle(slot)}/>}
            {piece !== null && <span className="placed-piece" style={pieceStyle(piece)}/>}
          </button>)}
          {complete && <div className="puzzle-celebration" role="alert"><span>🎉 ✦ 🎊 ✦ ⭐</span><strong>拼好了！太厲害了！</strong><div><button onClick={() => restart()}>重新拼圖</button><button onClick={() => restart(size, (themeIndex + 1) % themes.length)}>下一張圖片</button></div></div>}
        </div>
        <div className={`puzzle-tray tray-${size}`} aria-label="待放置的拼圖片">{tray.map(piece => <button
          key={piece}
          className="tray-piece"
          aria-label={`拼圖片 ${piece + 1}`}
          aria-pressed={selectedPiece === piece}
          onClick={() => {
            if (suppressClick.current) { suppressClick.current = false; return }
            setSelectedPiece(piece); setHintSlot(null); setMessage('選好了！再點圖片中的正確位置。')
          }}
          onPointerDown={event => pointerDown(event, piece)}
          onPointerUp={pointerUp}
          onPointerCancel={() => {draggedPiece.current = null}}
          style={pieceStyle(piece)}
        ><span>{piece + 1}</span></button>)}</div>
      </div>
    </div>
    <p className="puzzle-status" role="status">{message}</p>
  </div>
}
