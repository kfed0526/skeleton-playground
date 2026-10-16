import {useEffect, useRef, useState} from 'react'
import type {PointerEvent} from 'react'
import {advanceAdventure, careForPet, checkRhythmInput, placeBuildingPiece} from '../services/v4Games'
import type {AdventureAction, PetCareAction, PetNeeds} from '../services/v4Games'
import type {Outfit} from '../services/play'
import {sound} from '../services/sound'
import Skeleton from '../components/Skeleton'
import {usePlayTimers} from './usePlayTimers'
import './v4-games.css'

const adventureLevels = [
  {name: '南瓜村', sky: 'village', scenery: '🏠　🌳　🏡　🍂', finish: '🎃'},
  {name: '幽靈森林', sky: 'forest', scenery: '🌲　👻　🌳　🍄', finish: '🌙'},
  {name: '糖果城堡', sky: 'castle', scenery: '🍭　🍬　🏰　⭐', finish: '🏰'},
]
const adventureObstacles = [
  {at: 20, action: 'jump' as const, emoji: '🪵'},
  {at: 40, action: 'crouch' as const, emoji: '🦇'},
  {at: 60, action: 'jump' as const, emoji: '🕳️'},
  {at: 80, action: 'crouch' as const, emoji: '🕸️'},
]

export function PumpkinAdventure() {
  const [level, setLevel] = useState(0)
  const [distance, setDistance] = useState(0)
  const [action, setAction] = useState<AdventureAction>('run')
  const [running, setRunning] = useState(false)
  const [candies, setCandies] = useState(0)
  const [cleared, setCleared] = useState<number[]>([])
  const [message, setMessage] = useState('選一個關卡，再按開始冒險！')
  const actionRef = useRef<AdventureAction>('run')
  const actionToken = useRef(0)
  const lastBump = useRef<number | null>(null)
  const later = usePlayTimers()

  const reset = (nextLevel = level) => {
    setLevel(nextLevel); setDistance(0); setAction('run'); actionRef.current = 'run'
    setRunning(false); setCandies(0); setCleared([])
    lastBump.current = null
    setMessage(`第 ${nextLevel + 1} 關準備好囉！`)
  }
  const doAction = (next: Exclude<AdventureAction, 'run'>) => {
    const token = ++actionToken.current
    lastBump.current = null
    actionRef.current = next; setAction(next); sound.effect(next === 'jump' ? 'spark' : 'change')
    later(() => {
      if (actionToken.current !== token) return
      actionRef.current = 'run'; setAction('run')
    }, 650)
  }

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setDistance(current => {
        const obstacle = adventureObstacles.find(item => !cleared.includes(item.at) && item.at > current && item.at <= current + 2)
        const result = advanceAdventure(current, 2, actionRef.current, obstacle)
        if (result.bumped) {
          setMessage(obstacle?.action === 'jump' ? '碰到木頭囉！按跳躍再試一次。' : '蝙蝠飛來囉！蹲下就能通過。')
          if (lastBump.current !== obstacle?.at) {sound.effect('change'); lastBump.current = obstacle?.at ?? null}
        }
        if (result.cleared && obstacle) {
          lastBump.current = null
          setCleared(values => [...values, obstacle.at]); setCandies(value => value + 1)
          setMessage('做得好！撿到一顆糖果！'); sound.effect('pop')
        }
        if (result.distance >= 100) {
          window.clearInterval(timer); setRunning(false)
          setMessage(`🎉 抵達${adventureLevels[level].name}終點！`); sound.effect('spark')
        }
        return result.distance
      })
    }, 120)
    return () => window.clearInterval(timer)
  }, [running, cleared, level])

  useEffect(() => {
    const hide = () => { if (document.hidden) { setRunning(false); setMessage('冒險已安全暫停。') } }
    document.addEventListener('visibilitychange', hide)
    return () => document.removeEventListener('visibilitychange', hide)
  }, [])

  const currentLevel = adventureLevels[level]
  return <div className="pumpkin-adventure">
    <div className="v4-levels" aria-label="選擇冒險關卡">{adventureLevels.map((item, index) => <button key={item.name} aria-pressed={level === index} onClick={() => reset(index)}>{index + 1}．{item.name}</button>)}</div>
    <div className="adventure-hud"><strong>第 {level + 1} 關</strong><span>🍬 {candies}</span><div aria-label={`冒險進度 ${distance}%`}><i style={{width: `${distance}%`}}/></div></div>
    <div className={`adventure-stage ${currentLevel.sky}`}>
      <div className="adventure-scenery" style={{transform: `translateX(${-distance * 2.5}px)`}}>{currentLevel.scenery}　{currentLevel.scenery}　{currentLevel.finish}</div>
      {adventureObstacles.map(item => <span key={item.at} className={`adventure-obstacle ${cleared.includes(item.at) ? 'cleared' : ''}`} style={{left: `${22 + (item.at - distance) * 3}%`}}>{item.emoji}</span>)}
      <div className={`adventure-pumpkin ${action === 'jump' ? 'jumping' : action === 'crouch' ? 'crouching' : ''}`} aria-label="冒險中的南瓜">🎃<small>👟</small></div>
      <div className="adventure-road"/>
    </div>
    <div className="adventure-controls">
      <button aria-label="跳躍" onClick={() => doAction('jump')}>⬆️ 跳躍</button>
      <button aria-label="蹲下" onClick={() => doAction('crouch')}>⬇️ 蹲下</button>
      {!running ? <button className="primary-button" aria-label={distance > 0 && distance < 100 ? '繼續冒險' : '開始冒險'} onClick={() => {if (distance >= 100) reset(); setRunning(true); setMessage('出發！看到障礙就按跳躍或蹲下。')}}>▶ {distance > 0 && distance < 100 ? '繼續冒險' : '開始冒險'}</button> : <button className="soft-button" aria-label="暫停" onClick={() => {setRunning(false); setMessage('冒險暫停中，慢慢來！')}}>⏸ 暫停</button>}
      <button className="soft-button" onClick={() => reset()}>↻ 重新開始</button>
    </div>
    <p className="v3-status" role="status">{message}</p>
  </div>
}

type BuildPiece = {id: string; name: string; emoji: string}
const blueprints: {name: string; icon: string; pieces: BuildPiece[]}[] = [
  {name: '糖果小屋', icon: '🏠', pieces: [{id: 'base', name: '地基', emoji: '🟫'}, {id: 'wall', name: '牆壁', emoji: '🧱'}, {id: 'roof', name: '屋頂', emoji: '🔺'}, {id: 'door', name: '門', emoji: '🚪'}]},
  {name: '幽靈小橋', icon: '🌉', pieces: [{id: 'pillar', name: '橋墩', emoji: '🪨'}, {id: 'deck', name: '橋面', emoji: '🟫'}, {id: 'rail', name: '欄杆', emoji: '🪵'}, {id: 'flag', name: '旗子', emoji: '🚩'}]},
  {name: '南瓜城堡', icon: '🏰', pieces: [{id: 'base', name: '地基', emoji: '🟫'}, {id: 'tower', name: '高塔', emoji: '🗼'}, {id: 'wall', name: '城牆', emoji: '🧱'}, {id: 'gate', name: '城門', emoji: '🚪'}, {id: 'flag', name: '旗子', emoji: '🚩'}]},
]

export function SkeletonConstruction({outfit}: {outfit: Outfit}) {
  const [mode, setMode] = useState<'blueprint' | 'free'>('blueprint')
  const [blueprintIndex, setBlueprintIndex] = useState(0)
  const blueprint = blueprints[blueprintIndex]
  const emptyPlaced = () => Object.fromEntries(blueprint.pieces.map(piece => [piece.id, false]))
  const [placed, setPlaced] = useState<Record<string, boolean>>(emptyPlaced)
  const [selected, setSelected] = useState<string | null>(null)
  const [freeBlock, setFreeBlock] = useState('🟪')
  const [freeGrid, setFreeGrid] = useState<(string | null)[]>(Array(18).fill(null))
  const [message, setMessage] = useState('選一塊積木，再放到相同形狀的位置！')
  const draggedPiece = useRef<string | null>(null)
  const complete = blueprint.pieces.every(piece => placed[piece.id])

  const chooseBlueprint = (index: number) => {
    const next = blueprints[index]
    setBlueprintIndex(index); setPlaced(Object.fromEntries(next.pieces.map(piece => [piece.id, false])))
    setSelected(null); setMessage(`來蓋${next.name}！`); sound.effect('change')
  }
  const place = (piece: string, slot: string) => {
    const result = placeBuildingPiece(placed, piece, slot)
    if (!result.accepted) { setMessage('這裡差一點，再看看形狀和顏色！'); sound.effect('change'); return }
    setPlaced(result.placed); setSelected(null)
    setMessage(result.complete ? '🎉 蓋好了！骨頭人要搬進去囉！' : '放對了！繼續蓋高高！')
    sound.effect(result.complete ? 'spark' : 'pop')
  }
  const pointerDown = (event: PointerEvent<HTMLButtonElement>, piece: string) => {
    draggedPiece.current = piece; event.currentTarget.setPointerCapture(event.pointerId)
  }
  const pointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const piece = draggedPiece.current; draggedPiece.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-build-slot]')
    if (piece && target?.dataset.buildSlot) place(piece, target.dataset.buildSlot)
  }

  return <div className="skeleton-construction">
    <div className="v3-mode-switch">
      <button aria-pressed={mode === 'blueprint'} onClick={() => {setMode('blueprint'); setMessage('照著藍圖一起蓋吧！')}}>📐 藍圖任務</button>
      <button aria-pressed={mode === 'free'} onClick={() => {setMode('free'); setMessage('自由搭建，想怎麼蓋都可以！')}}>🎨 自由搭建模式</button>
      <button onClick={() => {if (mode === 'blueprint') chooseBlueprint(blueprintIndex); else {setFreeGrid(Array(18).fill(null)); setMessage('工地清空，可以重新搭建！')}}}>↻ 重新開始</button>
    </div>
    {mode === 'blueprint' ? <>
      <div className="v4-levels" aria-label="選擇建築藍圖">{blueprints.map((item, index) => <button key={item.name} aria-pressed={blueprintIndex === index} onClick={() => chooseBlueprint(index)}>{item.icon} {item.name}</button>)}</div>
      <div className="construction-yard">
        <div className="construction-preview" aria-label={`${blueprint.name}藍圖`}><span>{blueprint.icon}</span><small>藍圖</small></div>
        <div className="construction-frame">{blueprint.pieces.map(piece => <button
          key={piece.id} className={`build-slot slot-${piece.id} ${placed[piece.id] ? 'filled' : ''}`}
          aria-label={`建築位置 ${piece.name}`} data-build-slot={piece.id}
          onClick={() => selected && place(selected, piece.id)}
        >{placed[piece.id] ? piece.emoji : <span>{piece.name}</span>}</button>)}</div>
        <div className="builder-skeleton"><Skeleton outfit={outfit} pose={complete ? 'wiggle' : 'idle'}/><small>工地主任</small></div>
      </div>
      <div className="building-pieces" aria-label="待使用的積木">{blueprint.pieces.filter(piece => !placed[piece.id]).map(piece => <button
        key={piece.id} aria-label={`${piece.name}積木`} aria-pressed={selected === piece.id}
        onClick={() => {setSelected(piece.id); setMessage(`拿起${piece.name}，放到藍圖裡！`)}}
        onPointerDown={event => pointerDown(event, piece.id)} onPointerUp={pointerUp}
        onPointerCancel={() => {draggedPiece.current = null}}
      ><span>{piece.emoji}</span>{piece.name}</button>)}</div>
      {complete && <div className="construction-complete" role="alert"><strong>🎉 蓋好了！</strong><span>💀 正在參觀新建築！</span><button onClick={() => chooseBlueprint((blueprintIndex + 1) % blueprints.length)}>下一張藍圖</button></div>}
    </> : <>
      <div className="free-block-picker">{[['紫色', '🟪'], ['橘色', '🟧'], ['藍色', '🟦'], ['綠色', '🟩'], ['窗戶', '🪟'], ['門', '🚪']].map(([name, block]) => <button key={name} aria-label={`選擇${name}積木`} aria-pressed={freeBlock === block} onClick={() => setFreeBlock(block)}>{block}<small>{name}</small></button>)}</div>
      <div className="free-build-grid">{freeGrid.map((block, index) => <button key={index} aria-label={`自由格子 ${index + 1}`} onClick={() => {setFreeGrid(grid => grid.map((value, cell) => cell === index ? freeBlock : value)); sound.effect('pop')}}>{block}</button>)}</div>
    </>}
    <p className="v3-status" role="status">{message}</p>
  </div>
}

const rhythmPads = [
  {name: '南瓜鼓', emoji: '🎃', color: '#ff9b55', tone: 262},
  {name: '幽靈鈴', emoji: '👻', color: '#bba4eb', tone: 392},
  {name: '怪獸鼓', emoji: '👾', color: '#7ed5a2', tone: 330},
  {name: '糖果琴', emoji: '🍬', color: '#f49bc0', tone: 523},
]
const rhythmLevels = [[0, 1, 2], [0, 2, 1, 3], [3, 1, 0, 2, 1], [0, 3, 2, 1, 0, 2]]

export function MonsterRhythmParty({outfit}: {outfit: Outfit}) {
  const [mode, setMode] = useState<'follow' | 'free'>('follow')
  const [level, setLevel] = useState(0)
  const [entered, setEntered] = useState<number[]>([])
  const [showing, setShowing] = useState(false)
  const [activePad, setActivePad] = useState<number | null>(null)
  const [complete, setComplete] = useState(false)
  const [stars, setStars] = useState(0)
  const [message, setMessage] = useState('按開始，先聽怪獸們演奏！')
  const playToken = useRef(0)
  const later = usePlayTimers()
  const pattern = rhythmLevels[level]

  const playNote = (index: number) => {
    setActivePad(index); sound.tone(rhythmPads[index].tone, .22)
    later(() => setActivePad(current => current === index ? null : current), 230)
  }
  const demonstrate = () => {
    const token = ++playToken.current
    setComplete(false); setEntered([]); setShowing(true); setMessage('仔細聽，也看看誰亮起來！')
    pattern.forEach((pad, index) => later(() => {
      if (playToken.current === token) playNote(pad)
    }, 250 + index * 430))
    later(() => {
      if (playToken.current !== token) return
      setShowing(false); setMessage('換你演奏！照剛才的順序按按看。')
    }, 350 + pattern.length * 430)
  }
  const hitPad = (index: number) => {
    playNote(index)
    if (mode === 'free') {setMessage(`自由演奏：${rhythmPads[index].name}響起來！`); return}
    if (showing || complete) return
    const result = checkRhythmInput(pattern, entered, index)
    if (!result.correct) {
      setEntered([]); setShowing(true); setMessage('沒關係！再聽一次，就會越來越熟。'); sound.effect('change')
      later(demonstrate, 550); return
    }
    const next = [...entered, index]; setEntered(next)
    if (result.complete) {
      setComplete(true); setStars(value => value + 1); setMessage('🎉 節奏完成！怪獸們一起跳舞！'); sound.effect('spark')
    } else setMessage(`答對 ${next.length} 個！繼續跟著節奏。`)
  }
  const changeMode = (next: 'follow' | 'free') => {
    playToken.current += 1; setMode(next); setShowing(false); setComplete(false); setEntered([]); setActivePad(null)
    setMessage(next === 'follow' ? '按開始，挑戰跟打節奏！' : '自由演奏，四種樂器隨你敲！')
  }

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      const index = Number(event.key) - 1
      if (index >= 0 && index < rhythmPads.length) hitPad(index)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  })

  return <div className="monster-rhythm">
    <div className="v3-mode-switch">
      <button aria-pressed={mode === 'follow'} onClick={() => changeMode('follow')}>🎼 跟打節奏</button>
      <button aria-pressed={mode === 'free'} onClick={() => changeMode('free')}>🎹 自由演奏模式</button>
      <button onClick={() => {setLevel(0); setStars(0); changeMode(mode)}}>↻ 重新開始</button>
    </div>
    <div className="rhythm-stage">
      <div className="rhythm-lights" aria-hidden="true">✦　⭐　✦　⭐　✦</div>
      <div className={`rhythm-band ${complete ? 'dancing' : ''}`} aria-label="怪獸樂團"><span>👻</span><span>👾</span><div className="rhythm-skeleton"><Skeleton outfit={outfit} pose={complete ? 'wiggle' : 'idle'}/></div></div>
      <div className="rhythm-info"><strong>{mode === 'follow' ? `Level ${level + 1}・${pattern.length} 個音` : '自由舞台'}</strong><span>⭐ {stars}</span></div>
      <div className="rhythm-pads">{rhythmPads.map((pad, index) => <button
        key={pad.name} aria-label={pad.name} className={activePad === index ? 'active' : ''}
        style={{'--pad-color': pad.color} as React.CSSProperties} disabled={mode === 'follow' && showing}
        onClick={() => hitPad(index)}
      ><span>{pad.emoji}</span><strong>{pad.name}</strong><small>鍵盤 {index + 1}</small></button>)}</div>
    </div>
    <div className="v3-actions">
      {mode === 'follow' && <button className="primary-button" aria-label="開始節奏" onClick={demonstrate}>{entered.length || complete ? '再聽一次' : '開始節奏'}</button>}
      {mode === 'follow' && level < rhythmLevels.length - 1 && complete && <button className="soft-button" onClick={() => {setLevel(value => value + 1); setComplete(false); setEntered([]); setMessage('下一關會多一個音，準備好了！')}}>下一關</button>}
    </div>
    {complete && <p className="rhythm-complete" role="alert">🎉 節奏完成！</p>}
    <p className="v3-status" role="status">{message}</p>
  </div>
}

const pets = [
  {name: '南瓜犬', emoji: '🐶', color: '#f2a25e'},
  {name: '幽靈貓', emoji: '🐱', color: '#c8b8ed'},
  {name: '小怪獸', emoji: '👾', color: '#8bd5a7'},
  {name: '骨頭兔', emoji: '🐰', color: '#f2d9e8'},
]
const initialPetNeeds: PetNeeds = {fullness: 60, clean: 60, energy: 60, happiness: 60}

export function MonsterPetHouse() {
  const [petIndex, setPetIndex] = useState(0)
  const [needs, setNeeds] = useState<PetNeeds>(initialPetNeeds)
  const [accessory, setAccessory] = useState('🎀')
  const [reaction, setReaction] = useState('happy')
  const [message, setMessage] = useState('選一隻寵物，陪牠玩吧！')
  const reactionToken = useRef(0)
  const later = usePlayTimers()
  const pet = pets[petIndex]

  const selectPet = (index: number) => {
    setPetIndex(index); setNeeds(initialPetNeeds); setAccessory('🎀'); setReaction('happy')
    setMessage(`${pets[index].name}跑來和你打招呼！`); sound.effect('pop')
  }
  const care = (action: PetCareAction) => {
    const token = ++reactionToken.current
    setNeeds(current => careForPet(current, action))
    const responses = {
      feed: ['eating', '好好吃！寵物吃得飽飽的。'],
      bath: ['bathing', '泡泡香香，洗得亮晶晶！'],
      sleep: ['sleeping', '蓋好小被子，做甜甜的夢！'],
      play: ['playing', '一起玩球，寵物開心得跳起來！'],
    } as const
    setReaction(responses[action][0]); setMessage(responses[action][1]); sound.effect(action === 'sleep' ? 'change' : 'spark')
    later(() => {if (reactionToken.current === token) setReaction('happy')}, action === 'sleep' ? 1800 : 900)
  }
  const needRows: {key: keyof PetNeeds; label: string; icon: string}[] = [
    {key: 'fullness', label: '飽足度', icon: '🍎'}, {key: 'clean', label: '乾淨度', icon: '🫧'},
    {key: 'energy', label: '精神值', icon: '🌙'}, {key: 'happiness', label: '開心度', icon: '💖'},
  ]

  return <div className="monster-pet-house">
    <div className="pet-picker" aria-label="選擇寵物">{pets.map((item, index) => <button key={item.name} aria-label={`選擇${item.name}`} aria-pressed={petIndex === index} onClick={() => selectPet(index)}><span>{item.emoji}</span>{item.name}</button>)}</div>
    <div className="pet-room" style={{'--pet-color': pet.color} as React.CSSProperties}>
      <div className="pet-room-item bed">🛏️<small>睡覺區</small></div><div className="pet-room-item bath">🛁<small>洗澡區</small></div><div className="pet-room-item food">🥣<small>點心區</small></div>
      <div className={`pet-character ${reaction}`} aria-label={`正在照顧的${pet.name}`}><span className="pet-accessory">{accessory}</span><b>{pet.emoji}</b><i>{reaction === 'sleeping' ? '💤' : reaction === 'bathing' ? '🫧' : reaction === 'eating' ? '😋' : reaction === 'playing' ? '🎾' : '✨'}</i><strong>{pet.name}</strong></div>
    </div>
    <div className="pet-needs">{needRows.map(row => <div key={row.key}><span>{row.icon} {row.label}</span><div role="progressbar" aria-label={row.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={needs[row.key]}><i style={{width: `${needs[row.key]}%`}}/></div></div>)}</div>
    <div className="pet-care-actions">
      <button aria-label="餵點心" onClick={() => care('feed')}>🍎<strong>餵點心</strong></button>
      <button aria-label="洗泡泡澡" onClick={() => care('bath')}>🫧<strong>洗泡泡澡</strong></button>
      <button aria-label="睡覺" onClick={() => care('sleep')}>🌙<strong>睡覺</strong></button>
      <button aria-label="一起玩" onClick={() => care('play')}>🎾<strong>一起玩</strong></button>
    </div>
    <section className="pet-dressup"><h2>幫寵物換裝</h2><div>{[['蝴蝶結', '🎀'], ['皇冠', '👑'], ['派對帽', '🥳'], ['花朵', '🌼'], ['不戴配件', '']].map(([name, item]) => <button key={name} aria-label={item ? `戴上${name}` : name} aria-pressed={accessory === item} onClick={() => {setAccessory(item); setMessage(`${pet.name}的新造型好可愛！`); sound.effect('change')}}>{item || '✕'}</button>)}</div></section>
    <div className="v3-actions"><button className="soft-button" onClick={() => selectPet(petIndex)}>↻ 重新照顧</button></div>
    <p className="v3-status" role="status">{message}</p>
  </div>
}
