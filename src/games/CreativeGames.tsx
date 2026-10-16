import {useRef, useState} from 'react'
import type {PointerEvent} from 'react'
import {sound} from '../services/sound'
import './creative-games.css'

const colors = [['草莓紅', '#ed638b'], ['南瓜橘', '#f49b45'], ['陽光黃', '#efcd46'], ['薄荷綠', '#59bfa4'], ['天空藍', '#649cde'], ['葡萄紫', '#a378cd']] as const
type Mark = {points: string; color: string; width: number; stamp?: string; x?: number; y?: number}

export function MonsterArt() {
  const [color, setColor] = useState<string>(colors[0][1])
  const [tool, setTool] = useState('畫筆')
  const [thick, setThick] = useState(false)
  const [marks, setMarks] = useState<Mark[]>([])
  const [fill, setFill] = useState('#cbb9ed')
  const [template, setTemplate] = useState(true)
  const active = useRef<number | null>(null)
  const point = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return {x: Math.max(0, Math.min(600, (event.clientX - rect.left) / rect.width * 600)), y: Math.max(0, Math.min(400, (event.clientY - rect.top) / rect.height * 400))}
  }
  const start = (event: PointerEvent<SVGSVGElement>) => {
    if (active.current !== null || tool === '塗色') return
    event.currentTarget.setPointerCapture(event.pointerId)
    const {x, y} = point(event)
    if (tool !== '畫筆') {setMarks(previous => [...previous, {points: '', color, width: 0, stamp: tool, x, y}]); return}
    active.current = event.pointerId
    setMarks(previous => [...previous, {points: `${x},${y} ${x + .1},${y}`, color, width: thick ? 20 : 8}])
  }
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (active.current !== event.pointerId) return
    const {x, y} = point(event)
    setMarks(previous => previous.map((mark, index) => index === previous.length - 1 ? {...mark, points: `${mark.points} ${x},${y}`} : mark))
  }
  return <>
    <p className="instruction">畫一畫、蓋印章！選塗色，再點小怪獸換顏色。</p>
    <div className="creative-tools" aria-label="畫具">{['畫筆', '塗色', '⭐', '🌸', '👻', '🎃'].map(item => <button key={item} aria-label={['畫筆', '塗色'].includes(item) ? item : `${item}印章`} aria-pressed={tool === item} onClick={() => setTool(item)}>{item}</button>)}</div>
    <div className="creative-tools">{colors.map(([name, value]) => <button key={value} aria-label={name} aria-pressed={color === value} onClick={() => setColor(value)} style={{background: value}}>●</button>)}<button aria-pressed={thick} onClick={() => setThick(value => !value)}>粗畫筆</button></div>
    <svg className="art-board" viewBox="0 0 600 400" aria-label="塗鴉畫布" onPointerDown={start} onPointerMove={move} onPointerUp={() => {active.current = null}} onPointerCancel={() => {active.current = null}} onLostPointerCapture={() => {active.current = null}}>
      <rect width="600" height="400" fill="#fff9e9"/>
      {template && <g role="button" aria-label="替小怪獸塗色" tabIndex={0} onClick={() => {if (tool === '塗色') setFill(color)}} onKeyDown={event => {if (event.key === 'Enter' || event.key === ' ') {event.preventDefault(); setFill(color)}}}>
        <path d="M180 155 L165 75 L235 110 Q300 70 365 110 L435 75 L420 155 Q465 330 380 345 L220 345 Q135 330 180 155" fill={fill} stroke="#513d64" strokeWidth="6"/>
        <ellipse cx="255" cy="190" rx="22" ry="28" fill="white"/><ellipse cx="345" cy="190" rx="22" ry="28" fill="white"/>
        <circle cx="260" cy="195" r="9" fill="#513d64"/><circle cx="340" cy="195" r="9" fill="#513d64"/>
        <path d="M260 250 Q300 290 340 250" fill="none" stroke="#513d64" strokeWidth="8" strokeLinecap="round"/>
      </g>}
      <g pointerEvents="none">{marks.map((mark, index) => mark.stamp ? <text key={index} x={mark.x} y={mark.y} textAnchor="middle" dominantBaseline="central" fontSize="44">{mark.stamp}</text> : <polyline key={index} points={mark.points} stroke={mark.color} strokeWidth={mark.width} fill="none" strokeLinecap="round" strokeLinejoin="round"/>)}</g>
    </svg>
    <div className="creative-tools"><button onClick={() => setMarks(previous => previous.slice(0, -1))} disabled={!marks.length}>復原上一筆</button><button aria-pressed={!template} onClick={() => {setTemplate(value => !value); setMarks([])}}>{template ? '換成白紙' : '畫小怪獸'}</button><button onClick={() => {setMarks([]); setFill('#cbb9ed')}}>清空畫布</button></div>
    <p className="game-message" role="status">你的作品，你來決定！離開畫室後會換一張新畫紙。</p>
  </>
}

const patients = [{name: '紫毛怪', emoji: '👾'}, {name: '小幽靈', emoji: '👻'}, {name: '南瓜怪', emoji: '🎃'}]
const care = [{name: '量體溫', emoji: '🌡️', message: '量好了！一起慢慢休息。'}, {name: '貼星星貼布', emoji: '🩹', message: '星星貼布貼好了，謝謝你！'}, {name: '蓋小被子', emoji: '🛏️', message: '暖暖的被子，真舒服！'}]

export function MonsterHospital() {
  const [patient, setPatient] = useState(0)
  const [done, setDone] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [message, setMessage] = useState('選一個小工具，再點怪獸照顧牠。')
  const complete = done.length === care.length
  const apply = () => {
    if (selected === null || done.includes(selected)) return
    const next = [...done, selected]
    setDone(next); setSelected(null)
    setMessage(next.length === 3 ? '照顧完成！小怪獸送你一顆愛心！' : care[selected].message)
    sound.effect(next.length === 3 ? 'spark' : 'pop')
  }
  return <>
    <p className="instruction">當個溫柔的小醫生，陪怪獸好好休息。</p>
    <div className="creative-tools">{patients.map((item, index) => <button key={item.name} aria-label={`照顧${item.name}`} aria-pressed={patient === index} onClick={() => {setPatient(index); setDone([]); setSelected(null); setMessage('選一個小工具，再點怪獸照顧牠。')}}>{item.emoji} {item.name}</button>)}</div>
    <div className="clinic-scene"><span className="clinic-sign">✚ 怪獸小診所</span><button className="clinic-patient" aria-label="使用工具照顧怪獸" onClick={apply}><span className="patient-face">{patients[patient].emoji}</span>{done.includes(1) && <span className="patient-bandage">🩹</span>}{done.includes(2) && <span className="patient-blanket">⭐　🌙　⭐</span>}<small>{complete ? '💗 謝謝小醫生' : selected !== null ? `點我${care[selected].name}` : '我準備好囉'}</small></button><div className="care-progress" aria-label="照顧進度">{care.map((item, index) => <span key={item.name}>{done.includes(index) ? '✅' : '○'} {item.name}</span>)}</div></div>
    <div className="creative-tools">{care.map((item, index) => <button key={item.name} aria-pressed={selected === index} disabled={done.includes(index)} onClick={() => {setSelected(index); setMessage(`拿好了！點怪獸${item.name}。`)}}>{item.emoji} {item.name}</button>)}</div>
    <p className="game-message" role="status">{message}</p>
    {complete && <button className="primary-button" onClick={() => {setPatient(value => (value + 1) % patients.length); setDone([]); setSelected(null); setMessage('下一位朋友來了，選工具照顧牠吧！')}}>💗 照顧下一位</button>}
  </>
}

const addresses = [{symbol: '⭐', name: '星星', color: '#f4d77e'}, {symbol: '🌸', name: '花朵', color: '#efb5cd'}, {symbol: '🌙', name: '月亮', color: '#b9c9ef'}]
export function GhostPost() {
  const [round, setRound] = useState(0)
  const [delivered, setDelivered] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [message, setMessage] = useState('選包裹，找找門牌上一樣的圖案！')
  const deliver = (address: number) => {
    if (selected === null) {setMessage('先從郵袋選一個包裹吧！'); return}
    if (selected !== address) {setMessage('再看看圖案，包裹等你送到一樣的家！'); return}
    if (delivered.includes(address)) return
    const next = [...delivered, address]
    setDelivered(next); setSelected(null); sound.effect(next.length === 3 ? 'spark' : 'pop')
    setMessage(next.length === 3 ? '全部送到了！謝謝幽靈郵差！' : '叮咚！送對了，朋友收到包裹好開心！')
  }
  return <>
    <p className="instruction">小幽靈出發送信！點包裹，再點相同圖案的家。</p>
    <div className="post-scene"><div className="post-carrier" aria-hidden="true">👻 📮</div><div className="post-houses">{addresses.map((_, position) => {const index = (position + round) % 3; const item = addresses[index]; return <button key={index} className="post-house" style={{background: item.color}} aria-label={`${item.name}的家`} disabled={delivered.includes(index)} onClick={() => deliver(index)}><span className="house-roof"/><span className="house-sign">{item.symbol}</span><span className="house-door">{delivered.includes(index) ? '🎁' : '🚪'}</span><strong>{delivered.includes(index) ? '收到囉！' : `${item.name}的家`}</strong></button>})}</div></div>
    <div className="creative-tools post-parcels" aria-label="郵袋">{addresses.map((item, index) => <button key={item.name} aria-label={`${item.name}包裹`} aria-pressed={selected === index} disabled={delivered.includes(index)} onClick={() => {setSelected(index); setMessage(`拿著${item.name}包裹，去找一樣的門牌吧！`)}}><span>📦</span><span>{item.symbol}</span><small>{delivered.includes(index) ? '已送達' : item.name}</small></button>)}</div>
    <p className="game-message" role="status">{message}（{delivered.length} / 3）</p>
    {delivered.length === 3 && <button className="primary-button" onClick={() => {setRound(value => value + 1); setDelivered([]); setSelected(null); setMessage('新郵袋來了！房子換了位置，再找找圖案。')}}>📮 再送一袋</button>}
  </>
}
