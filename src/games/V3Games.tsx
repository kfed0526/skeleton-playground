import {useMemo, useRef, useState} from 'react'
import type {PointerEvent} from 'react'
import {
  advanceWash,
  buildIceCreamOrder,
  buildShoppingList,
  iceCreamFlavors,
  iceCreamToppings,
  isIceCreamOrderComplete,
  isShoppingListComplete,
  nextTrainStation,
  supermarketProducts,
} from '../services/v3Games'
import type {IceCreamFlavor, IceCreamTopping, ProductId, WashStage} from '../services/v3Games'
import {sound} from '../services/sound'
import {usePlayTimers} from './usePlayTimers'
import './v3-games.css'
import './v3-games-enhancements.css'

type IceCreamMode = 'order' | 'free'

export function IceCreamShop() {
  const [mode, setMode] = useState<IceCreamMode>('order')
  const [served, setServed] = useState(0)
  const [scoops, setScoops] = useState<IceCreamFlavor[]>([])
  const [topping, setTopping] = useState<IceCreamTopping | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [message, setMessage] = useState('看看客人的訂單，做一杯一樣的冰淇淋吧！')
  const level = Math.min(4, Math.floor(served / 3) + 1) as 1 | 2 | 3 | 4
  const order = useMemo(() => buildIceCreamOrder(level, served), [level, served])
  const customers = ['👻', '🎃', '💀', '👾']
  const flavorLimit = mode === 'free' ? iceCreamFlavors.length : [0, 3, 4, 6, 6][level]
  const availableFlavors = iceCreamFlavors.slice(0, flavorLimit)

  const clearCone = () => {
    setScoops([])
    setTopping(null)
    setMistakes(0)
    setMessage(mode === 'order' ? '重新做一杯，慢慢來！' : '想放什麼都可以！')
  }
  const changeMode = (next: IceCreamMode) => {
    setMode(next)
    setScoops([])
    setTopping(null)
    setMistakes(0)
    setMessage(next === 'order' ? '看看客人的訂單吧！' : '自由創作，做一座大冰淇淋！')
  }
  const addScoop = (flavor: IceCreamFlavor) => {
    if (scoops.length >= (mode === 'free' ? 6 : 3)) return
    setScoops(current => [...current, flavor])
    sound.effect('pop')
  }
  const finish = () => {
    if (scoops.length === 0) {
      setMessage('先放一球冰淇淋吧！')
      return
    }
    if (mode === 'order' && !isIceCreamOrderComplete(scoops, topping, order)) {
      const nextMistakes = mistakes + 1
      setMistakes(nextMistakes)
      setMessage(nextMistakes >= 2 ? '提示亮起來囉！照著發亮的口味由下往上放。' : '快完成了！再看看訂單圖片，可以重做喔。')
      sound.effect('change')
      return
    }
    sound.effect('spark')
    if (mode === 'order') {
      const next = served + 1
      setServed(next)
      setMessage(`🎉 完成 ${next} 張訂單！下一位客人來囉！`)
    } else {
      setMessage('🎉 怪獸好喜歡你的創作！再做一杯吧！')
    }
    setScoops([])
    setTopping(null)
    setMistakes(0)
  }

  return <div className="ice-shop">
    <div className="v3-mode-switch" aria-label="冰淇淋遊戲模式">
      <button aria-pressed={mode === 'order'} onClick={() => changeMode('order')}>🧾 訂單模式</button>
      <button aria-pressed={mode === 'free'} onClick={() => changeMode('free')}>🎨 自由創作模式</button>
      <button onClick={() => {setServed(0); clearCone()}}>↻ 重新開始</button>
    </div>
    <section className="ice-counter">
      <div className="monster-queue" aria-label="排隊的怪獸客人">
        <span className="active-customer">{customers[served % customers.length]}</span>
        <span>{customers[(served + 1) % customers.length]}</span>
        <span>{customers[(served + 2) % customers.length]}</span>
      </div>
      <div className="order-bubble">
        {mode === 'order' ? <>
          <small>Level {level} 訂單</small>
          <div>{order.scoops.map((id, index) => {
            const flavor = iceCreamFlavors.find(item => item.id === id)!
            return <span key={`${id}-${index}`} style={{background: flavor.color}} title={flavor.name}>●</span>
          })}</div>
          {order.topping && <b>{iceCreamToppings.find(item => item.id === order.topping)?.emoji}</b>}
        </> : <><small>自由創作</small><b>✨ 想怎麼做都可以</b></>}
      </div>
      <div className="ice-creation" aria-label="正在製作的冰淇淋">
        {topping && <span className="ice-topping">{iceCreamToppings.find(item => item.id === topping)?.emoji}</span>}
        <div className="ice-scoops">{scoops.slice().reverse().map((id, index) => {
          const flavor = iceCreamFlavors.find(item => item.id === id)!
          return <span key={`${id}-${scoops.length - index}`} style={{background: flavor.color}} title={flavor.name}/>
        })}</div>
        <span className="ice-cone">▽</span>
      </div>
    </section>
    <section className="ice-menu">
      <h2>選口味</h2>
      <div className="ice-options">{availableFlavors.map(flavor => <button
        key={flavor.id}
        className={`ice-flavor ${mistakes >= 2 && order.scoops.includes(flavor.id) ? 'hinted' : ''}`}
        aria-label={`${flavor.name}口味`}
        onClick={() => addScoop(flavor.id)}
      ><span style={{background: flavor.color}}/> {flavor.name}</button>)}</div>
      <h2>加配料</h2>
      <div className="ice-options toppings">{(mode === 'free' || level === 4 ? iceCreamToppings : []).map(item => <button
        key={item.id}
        aria-label={`${item.name}配料`}
        aria-pressed={topping === item.id}
        onClick={() => {setTopping(item.id); sound.effect('pop')}}
      ><span>{item.emoji}</span>{item.name}</button>)}</div>
    </section>
    <div className="v3-actions">
      <button className="soft-button" onClick={clearCone}>清空甜筒</button>
      <button className="primary-button" onClick={finish}>完成冰淇淋</button>
    </div>
    <p className="v3-status" role="status">{message}</p>
  </div>
}

const washStageDetails: Record<WashStage, {title: string; tool: string; hint: string}> = {
  water: {title: '1．噴水', tool: '🚿 水槍', hint: '在車身上來回沖水'},
  soap: {title: '2．泡泡', tool: '🧽 海綿', hint: '用海綿擦出好多泡泡'},
  rinse: {title: '3．沖洗', tool: '💦 水槍', hint: '把泡泡沖乾淨'},
  dry: {title: '4．擦乾', tool: '🧻 毛巾', hint: '把水滴擦乾，亮晶晶'},
  customize: {title: '5．汽車改裝', tool: '✨ 裝飾', hint: '選你喜歡的顏色、輪胎和貼紙'},
}

export function CarWash() {
  const [stage, setStage] = useState<WashStage>('water')
  const stageRef = useRef<WashStage>('water')
  const [progress, setProgress] = useState(0)
  const [carIndex, setCarIndex] = useState(0)
  const [color, setColor] = useState('#ff8a75')
  const [wheel, setWheel] = useState('一般')
  const [sticker, setSticker] = useState('⭐')
  const [lights, setLights] = useState(false)
  const [wheelsSpinning, setWheelsSpinning] = useState(false)
  const [message, setMessage] = useState('拿起水槍，在車身上滑一滑！')
  const dragging = useRef(false)
  const dragStage = useRef<WashStage>('water')
  const lastPoint = useRef({x: 0, y: 0})
  const cleanedCells = useRef(new Set<string>())
  const cars = [
    {name: '南瓜小汽車', face: '🎃'}, {name: '幽靈跑車', face: '👻'},
    {name: '骨頭人巴士', face: '💀'}, {name: '怪獸吉普車', face: '👾'},
  ]
  const car = cars[carIndex % cars.length]

  const resetWash = (nextCar = carIndex) => {
    stageRef.current = 'water'
    setStage('water')
    setProgress(0)
    setCarIndex(nextCar)
    setColor('#ff8a75')
    setWheel('一般')
    setSticker('⭐')
    setLights(false)
    setWheelsSpinning(false)
    cleanedCells.current.clear()
    setMessage('新車來囉！拿起水槍沖一沖！')
  }
  const clean = (amount: number) => {
    if (stageRef.current === 'customize') return
    setProgress(current => {
      const result = advanceWash(stageRef.current, current, amount)
      if (result.stage !== stageRef.current) {
        stageRef.current = result.stage
        cleanedCells.current.clear()
        setStage(result.stage)
        setMessage(result.stage === 'customize' ? '洗乾淨了！現在來改裝汽車！' : washStageDetails[result.stage].hint)
        sound.effect('spark')
      }
      return result.progress
    })
  }
  const cleanAt = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width
    const y = (event.clientY - box.top) / box.height
    if (x < .12 || x > .88 || y < .28 || y > .9) return
    const cell = `${Math.floor(x * 8)}-${Math.floor(y * 4)}`
    if (cleanedCells.current.has(cell)) return
    cleanedCells.current.add(cell)
    clean(16)
  }
  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (stageRef.current === 'customize') return
    dragging.current = true
    dragStage.current = stageRef.current
    lastPoint.current = {x: event.clientX, y: event.clientY}
    event.currentTarget.setPointerCapture(event.pointerId)
    cleanAt(event)
  }
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || stageRef.current !== dragStage.current) return
    const distance = Math.hypot(event.clientX - lastPoint.current.x, event.clientY - lastPoint.current.y)
    if (distance < 18) return
    lastPoint.current = {x: event.clientX, y: event.clientY}
    cleanAt(event)
  }
  const stopDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return <div className="car-wash">
    <div className="wash-topline">
      <div><h2>{washStageDetails[stage].title}</h2><p>{washStageDetails[stage].hint}</p></div>
      <div className="wash-progress" aria-label={`清潔進度 ${progress}%`}><span style={{width: `${progress}%`}}/></div>
      <button className="soft-button" onClick={() => resetWash()}>↻ 重新開始</button>
    </div>
    <div className="wash-tools" aria-label="洗車工具">
      {(['water', 'soap', 'rinse', 'dry'] as const).map(item => <button key={item} aria-pressed={stage === item} disabled={stage !== item}>{washStageDetails[item].tool}</button>)}
      {stage !== 'customize' && <button aria-label="繼續清潔車身" onClick={() => clean(25)}>✨ 繼續清潔</button>}
    </div>
    <div className={`car-bay wash-${stage}`} role="application" aria-label="洗車操作區" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
      <div className="wash-brush left"/><div className="wash-brush right"/>
      <div className="cartoon-car" style={{'--car-color': color} as React.CSSProperties}>
        <div className={`car-light ${lights ? 'on' : ''}`}/>
        <div className="car-roof"><span>{car.face}</span></div>
        <div className="car-body"><span className="car-sticker">{sticker}</span><strong>{car.name}</strong></div>
        <button className={`car-wheel wheel-${wheel} ${wheelsSpinning ? 'spinning' : ''}`} aria-label="旋轉前輪" onClick={() => {setWheelsSpinning(true); sound.effect('pop')}}><span>{wheel === '星星' ? '⭐' : wheel === '南瓜' ? '🎃' : ''}</span></button>
        <button className={`car-wheel rear wheel-${wheel} ${wheelsSpinning ? 'spinning' : ''}`} aria-label="旋轉後輪" onClick={() => {setWheelsSpinning(true); sound.effect('pop')}}><span>{wheel === '星星' ? '⭐' : wheel === '南瓜' ? '🎃' : ''}</span></button>
        {stage === 'water' && <div className="mud-layer" style={{opacity: Math.max(.1, 1 - progress / 100)}}>●　●　●<br/>　●　●</div>}
        {stage === 'soap' && <div className="soap-layer" style={{opacity: .25 + progress / 130}}>○ ◯ ○<br/>◯ ○ ◯</div>}
        {stage === 'rinse' && <div className="soap-layer" style={{opacity: Math.max(0, 1 - progress / 100)}}>○ ◯ ○<br/>◯ ○ ◯</div>}
        {stage === 'dry' && <div className="water-layer" style={{opacity: Math.max(0, 1 - progress / 100)}}>💧　💧<br/>　💧</div>}
      </div>
      {stage !== 'customize' && <div className="active-tool">{washStageDetails[stage].tool}</div>}
    </div>
    {stage === 'customize' && <section className="car-customizer">
      <div className="custom-row"><strong>車身</strong>{[
        ['紅色', '#ff6f61'], ['黃色', '#ffd85d'], ['藍色', '#70b7e6'], ['綠色', '#7bd39b'], ['紫色', '#ad83da'],
      ].map(([name, value]) => <button key={name} aria-label={`${name}車身`} aria-pressed={color === value} style={{background: value}} onClick={() => setColor(value)}>●</button>)}</div>
      <div className="custom-row"><strong>輪胎</strong>{['一般', '星星', '南瓜'].map(value => <button key={value} aria-label={`${value}輪胎`} aria-pressed={wheel === value} onClick={() => setWheel(value)}>{value === '一般' ? '⚫' : value === '星星' ? '⭐' : '🎃'}</button>)}</div>
      <div className="custom-row"><strong>貼紙</strong>{[['星星', '⭐'], ['閃電', '⚡'], ['南瓜', '🎃'], ['愛心', '💖']].map(([name, value]) => <button key={name} aria-label={`${name}貼紙`} aria-pressed={sticker === value} onClick={() => setSticker(value)}>{value}</button>)}</div>
      <div className="v3-actions"><button className="soft-button" onClick={() => {sound.tone(330, .12); sound.tone(440, .16, .1); setMessage('叭叭！')}} aria-label="按喇叭">📣 按喇叭</button><button className="soft-button" onClick={() => setLights(value => !value)}>💡 {lights ? '關車燈' : '開車燈'}</button><button className="primary-button" onClick={() => resetWash(carIndex + 1)}>完成改裝，下一台車</button></div>
    </section>}
    <p className="v3-status" role="status">{message}</p>
  </div>
}

const trainStations = [
  {name: '南瓜車站', emoji: '🎃'}, {name: '幽靈森林', emoji: '🌲'},
  {name: '糖果工廠', emoji: '🍬'}, {name: '骨頭人城堡', emoji: '🏰'},
  {name: '星星遊樂園', emoji: '🎡'},
]

export function PumpkinTrain() {
  const [mode, setMode] = useState<'mission' | 'free'>('mission')
  const [station, setStation] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('left')
  const [missionDestination, setMissionDestination] = useState(2)
  const [passenger, setPassenger] = useState(false)
  const [running, setRunning] = useState(false)
  const [detourRunning, setDetourRunning] = useState(false)
  const [stars, setStars] = useState(0)
  const [candies, setCandies] = useState<number[]>([])
  const [message, setMessage] = useState('點幽靈乘客，請他上車吧！')
  const runningRef = useRef(false)
  const tripToken = useRef(0)
  const later = usePlayTimers()
  const destination = mode === 'mission' ? missionDestination : nextTrainStation(station, direction)

  const arrive = (token: number, target: number, missionTrip: boolean) => {
    if (!runningRef.current || tripToken.current !== token) return
    runningRef.current = false
    setRunning(false)
    setDetourRunning(false)
    setStation(target)
    setPassenger(false)
    setCandies([])
    if (missionTrip) {
      setStars(value => value + 1)
      setMissionDestination((target + 2) % trainStations.length)
    }
    setMessage(`叮咚！抵達${trainStations[target].name}！乘客開心下車囉！`)
    sound.effect('spark')
  }
  const depart = () => {
    if (mode === 'mission' && !passenger) {
      setMessage('先請月台上的幽靈乘客上車！')
      return
    }
    const target = nextTrainStation(station, direction)
    const finalTarget = mode === 'mission' ? missionDestination : target
    const detour = mode === 'mission' && target !== missionDestination
    const token = ++tripToken.current
    runningRef.current = true
    setRunning(true)
    setDetourRunning(detour)
    setMessage(detour ? '這條路會繞一圈，火車會安全回到正確路線！' : `嗚——前往${trainStations[finalTarget].name}！`)
    sound.tone(392, .25)
    sound.tone(523, .35, .18)
    later(() => arrive(token, finalTarget, mode === 'mission'), detour ? 2100 : 1500)
  }
  const stop = () => {
    runningRef.current = false
    tripToken.current += 1
    setRunning(false)
    setDetourRunning(false)
    setMessage('火車安全停車了，想走時再按繼續出發！')
    sound.stop()
  }
  const reset = () => {
    stop()
    setStation(0)
    setMissionDestination(2)
    setPassenger(false)
    setStars(0)
    setCandies([])
    setMessage(mode === 'mission' ? '新的旅程！請乘客上車吧！' : '自由開車，想去哪裡都可以！')
  }
  const changeMode = (next: 'mission' | 'free') => {
    runningRef.current = false
    tripToken.current += 1
    setRunning(false)
    setMode(next)
    setPassenger(false)
    setMessage(next === 'mission' ? '任務模式：請幽靈乘客上車！' : '自由開車模式：直接按出發！')
  }

  return <div className="pumpkin-train-game">
    <div className="v3-mode-switch">
      <button aria-pressed={mode === 'mission'} onClick={() => changeMode('mission')}>🎫 任務模式</button>
      <button aria-pressed={mode === 'free'} onClick={() => changeMode('free')}>🚂 自由開車模式</button>
      <button onClick={reset}>↻ 重新開始</button>
    </div>
    <div className="train-mission">
      <span>目前：{trainStations[station].emoji} {trainStations[station].name}</span>
      <span>目的地：{trainStations[destination].emoji} {trainStations[destination].name}</span>
      <strong>⭐ {stars}</strong>
    </div>
    <div className="train-map">
      <div className="rail-loop"/>
      {trainStations.map((item, index) => <div className={`train-station station-${index} ${station === index ? 'current' : ''}`} key={item.name}><span>{item.emoji}</span><small>{item.name}</small></div>)}
      {mode === 'mission' && !passenger && !running && <button className="train-passenger" aria-label="讓幽靈乘客上車" onClick={() => {setPassenger(true); setMessage('乘客坐好囉，選路線再出發！'); sound.effect('pop')}}>👻<small>點我上車</small></button>}
      <div className={`train-set station-at-${station} ${running ? 'running' : ''} ${detourRunning ? 'detour' : ''}`} style={{'--train-from-left': `${[12, 28, 57, 66, 39][station]}%`, '--train-from-top': `${[56, 22, 22, 56, 70][station]}%`, '--train-to-left': `${[12, 28, 57, 66, 39][destination]}%`, '--train-to-top': `${[56, 22, 22, 56, 70][destination]}%`} as React.CSSProperties} aria-label="南瓜小火車">
        <span className="train-engine">🎃<i>⭐</i></span><span className="train-carriage">{passenger ? '👻' : '　'}</span><span className="train-carriage">👾</span><span className="train-smoke">✦　✦</span>
      </div>
      {[0, 1, 2].map(index => <button key={index} className={`track-candy candy-${index}`} aria-label={`星星糖果 ${index + 1}`} disabled={candies.includes(index)} onClick={() => {setCandies(value => [...value, index]); setStars(value => value + 1); sound.effect('spark')}}>{candies.includes(index) ? '✨' : '⭐'}</button>)}
      <div className="train-river">🐟　～～　🐠</div><div className="train-tunnel">◖　◗</div><div className="train-crossing">🚧</div>
    </div>
    <div className="train-controls">
      <button aria-label="選左轉路線" aria-pressed={direction === 'left'} disabled={running} onClick={() => setDirection('left')}>↙ 左轉</button>
      <button aria-label="選右轉路線" aria-pressed={direction === 'right'} disabled={running} onClick={() => setDirection('right')}>右轉 ↘</button>
      {!running ? <button className="train-go" aria-label={message.includes('停車') ? '繼續出發' : '出發'} onClick={depart}>▶ {message.includes('停車') ? '繼續出發' : '出發'}</button> : <button className="train-stop" aria-label="停車" onClick={stop}>■ 停車</button>}
      <button aria-label="按火車喇叭" onClick={() => {sound.tone(330, .2); sound.tone(494, .25, .15); setMessage('嗚——嗚——！')}}>📣 喇叭</button>
    </div>
    <p className="v3-status" role="status">{message}</p>
  </div>
}

export function MonsterSupermarket() {
  const [mode, setMode] = useState<'list' | 'free'>('list')
  const [round, setRound] = useState(0)
  const [cart, setCart] = useState<Partial<Record<ProductId, number>>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [lastAdded, setLastAdded] = useState<ProductId | null>(null)
  const [scanningItem, setScanningItem] = useState({emoji: '', step: 0})
  const [message, setMessage] = useState('看看圖片清單，找到一樣的商品吧！')
  const later = usePlayTimers()
  const checkoutToken = useRef(0)
  const [shoppingSeed, setShoppingSeed] = useState(() => Math.floor(Math.random() * 1_000_000_000))
  const level = Math.min(4, round + 1) as 1 | 2 | 3 | 4
  const list = useMemo(() => buildShoppingList(level, shoppingSeed + round), [level, round, shoppingSeed])
  const cartCount = Object.values(cart).reduce((total, quantity) => total + (quantity ?? 0), 0)
  const ready = mode === 'free' ? cartCount > 0 : isShoppingListComplete(cart, list)
  const sections = ['水果', '飲料', '點心', '玩具']

  const addProduct = (id: ProductId) => {
    setCart(current => ({...current, [id]: (current[id] ?? 0) + 1}))
    setLastAdded(id)
    const wanted = list.some(item => item.id === id)
    setMessage(mode === 'free' || wanted ? '放進購物車囉！' : '這個不在清單上，也可以帶去結帳或放回貨架。')
    sound.effect('pop')
    later(() => setLastAdded(current => current === id ? null : current), 450)
  }
  const removeProduct = (id: ProductId) => {
    setCart(current => {
      const next = {...current}
      const quantity = next[id] ?? 0
      if (quantity <= 1) delete next[id]
      else next[id] = quantity - 1
      return next
    })
    setMessage('商品放回貨架了！')
  }
  const checkout = () => {
    if (!ready || scanning) return
    setScanning(true)
    const token = ++checkoutToken.current
    const items = supermarketProducts.flatMap(product => Array(cart[product.id] ?? 0).fill(product.emoji))
    const scanNext = (index: number) => {
      if (checkoutToken.current !== token) return
      if (index >= items.length) {
        setScanning(false); setScanningItem({emoji: '🛍️', step: index}); setCart({}); setRound(value => value + 1)
        setMessage('🎉 完成結帳！商品裝進購物袋，骨頭人收銀員向你揮手！'); sound.effect('spark'); return
      }
      setScanningItem({emoji: items[index], step: index}); setMessage(`嗶！正在掃描第 ${index + 1} 件商品……`); sound.tone(880, .1)
      later(() => scanNext(index + 1), 350)
    }
    scanNext(0)
  }
  const cancelCheckout = () => { checkoutToken.current += 1; setScanning(false); setScanningItem({emoji: '', step: 0}) }
  const changeMode = (next: 'list' | 'free') => {
    cancelCheckout()
    setMode(next)
    setCart({})
    setMessage(next === 'list' ? '新購物清單準備好囉！' : '自由購物，喜歡什麼都可以拿！')
  }

  return <div className="monster-market">
    <div className="v3-mode-switch">
      <button aria-pressed={mode === 'list'} onClick={() => changeMode('list')}>📝 購物清單模式</button>
      <button aria-pressed={mode === 'free'} onClick={() => changeMode('free')}>🛒 自由購物模式</button>
      <button onClick={() => {cancelCheckout(); setShoppingSeed(Math.floor(Math.random() * 1_000_000_000)); setRound(0); setCart({}); setMessage('重新開始購物！')}}>↻ 重新開始</button>
    </div>
    <section className="shopping-list" aria-label="圖片購物清單">
      <strong>{mode === 'list' ? `Level ${level} 購物清單` : '自由購物清單'}</strong>
      <div>{mode === 'list' ? list.map(item => {
        const product = supermarketProducts.find(value => value.id === item.id)!
        const done = (cart[item.id] ?? 0) >= item.quantity
        return <span key={item.id} className={done ? 'done' : ''}>{product.emoji}<small>×{item.quantity}</small><b>{done ? '✓' : ''}</b></span>
      }) : <span>✨ 喜歡什麼就拿什麼！</span>}</div>
    </section>
    <div className="market-shelves">
      {sections.map(section => <section className={`market-section market-${section}`} key={section}>
        <h2>{section === '水果' ? '🍎' : section === '飲料' ? '🥛' : section === '點心' ? '🍪' : '🧸'} {section}區</h2>
        <div>{supermarketProducts.filter(product => product.section === section).map(product => <button
          key={product.id}
          className={lastAdded === product.id ? 'product-added' : ''}
          data-wanted={list.some(item => item.id === product.id) ? 'true' : 'false'}
          aria-label={`${product.name}，加入購物車`}
          onClick={() => addProduct(product.id)}
        ><span>{product.emoji}</span><small>{product.name}</small></button>)}</div>
      </section>)}
    </div>
    <div className={`checkout-counter ${ready ? 'ready' : ''} ${scanning ? 'scanning' : ''}`}>
      <button className="cashier" aria-label="按收銀機" onClick={() => {sound.tone(1046, .12); setMessage('叮噹！收銀機打開了！')}}>💀<small>骨頭人收銀員</small></button>
      <div className="scanner"><span/>{scanningItem.emoji && <b key={scanningItem.step} className="scanning-item">{scanningItem.emoji}</b>}<strong>{scanning ? '嗶！逐件掃描中' : ready ? '可以結帳囉！' : '找齊清單商品'}</strong></div>
      <button aria-label="查看購物車" onClick={() => setCartOpen(true)}>🛒 購物車 <b>{cartCount}</b></button>
      <button className="primary-button" aria-label="前往結帳" disabled={!ready || scanning} onClick={checkout}>前往結帳</button>
    </div>
    {cartOpen && <div className="market-cart-overlay"><section role="dialog" aria-modal="true" aria-label="購物車內容" className="market-cart-dialog">
      <h2>🛒 購物車內容</h2>
      {cartCount === 0 ? <p>購物車還是空的</p> : supermarketProducts.filter(product => cart[product.id]).map(product => <div key={product.id}><span>{product.emoji} {product.name} ×{cart[product.id]}</span><button aria-label={`放回${product.name}`} onClick={() => removeProduct(product.id)}>放回貨架</button></div>)}
      <button className="soft-button" aria-label="關閉購物車" onClick={() => setCartOpen(false)}>關閉購物車</button>
    </section></div>}
    <p className="v3-status" role="status">{message}</p>
  </div>
}
