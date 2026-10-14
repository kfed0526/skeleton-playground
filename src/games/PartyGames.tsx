import {useEffect,useRef,useState} from 'react'
import Skeleton from '../components/Skeleton'
import type {Outfit} from '../services/play'
import {sound} from '../services/sound'
import {usePlayTimers} from './usePlayTimers'
import './party-games.css'

export function Fishing({outfit}:{outfit:Outfit}){
  const [caught,setCaught]=useState<string[]>([]),[busy,setBusy]=useState<number|null>(null),locked=useRef(false),later=usePlayTimers()
  const fish=(i:number)=>{if(locked.current)return;locked.current=true;setBusy(i);sound.effect('pop');later(()=>{setCaught(c=>[...c.slice(-7),['🐟','🐠','🐡','🦑'][i]]);setBusy(null);locked.current=false;sound.effect('spark')},700)}
  return <><p className="instruction">點水裡的小魚，骨頭人就會甩竿釣起來！</p><div className="fishing-scene"><div className="fishing-pal"><Skeleton outfit={outfit} pose={busy!==null?'rock':'idle'}/><span aria-hidden="true">🎣</span></div><div className="fish-pond">{['🐟','🐠','🐡','🦑'].map((emoji,i)=><button key={i} aria-label={`釣${['小藍魚','小丑魚','河豚','小花枝'][i]}`} disabled={busy!==null} className={busy===i?'fish-caught':''} onClick={()=>fish(i)}><span>{emoji}</span><small>{busy===i?'拉起來囉！':'點我釣魚'}</small></button>)}</div></div><div className="party-status" role="status">{busy!==null?'嘿咻——拉竿！':caught.length?'釣到了！魚朋友來開派對！':'今天會釣到誰呢？'}</div><div className="fish-basket" aria-label="魚朋友籃子">{caught.length?caught.join('　'):'🧺 魚朋友在這裡集合'}</div></>
}

type Drop={id:number;lane:number;y:number}
export function CandyCatch(){
  const [lane,setLane]=useState(1),[drops,setDrops]=useState<Drop[]>([]),[running,setRunning]=useState(false),[count,setCount]=useState(0)
  const laneRef=useRef(1),world=useRef<{drops:Drop[];spawn:number;serial:number}>({drops:[],spawn:0,serial:0})
  const move=(n:number)=>{laneRef.current=Math.max(0,Math.min(2,n));setLane(laneRef.current)}
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(laneRef.current+(e.key==='ArrowLeft'?-1:1))}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[])
  useEffect(()=>{const hide=()=>{if(document.hidden)setRunning(false)};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide)},[])
  useEffect(()=>{if(!running)return;let last=performance.now(),frame=0;const tick=(now:number)=>{const dt=Math.min(now-last,50);last=now;const w=world.current;if(!document.hidden){w.spawn+=dt;if(w.spawn>=1600){w.spawn=0;w.drops.push({id:++w.serial,lane:Math.floor(Math.random()*3),y:-8})}w.drops=w.drops.filter(d=>{d.y+=dt*.02;if(d.y>=78&&d.lane===laneRef.current){setCount(c=>c+1);sound.effect('pop');return false}return d.y<105});setDrops(w.drops.map(d=>({...d})))}frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame)},[running])
  return <><p className="instruction">左右移動小幽靈，把天空落下的糖果接進籃子！</p><div className="catch-sky"><span className="party-counter" role="status">🍬 接到 {count} 顆糖果</span>{drops.map(d=><span className="falling-candy" key={d.id} style={{left:`${(d.lane+.5)*100/3}%`,top:`${d.y}%`}} aria-hidden="true">{['🍬','🍭','🍪'][d.id%3]}</span>)}<div className="ghost-basket" data-lane={lane} style={{left:`${(lane+.5)*100/3}%`}} aria-label="接糖果的小幽靈">👻<span>🧺</span></div></div><div className="party-controls"><button aria-label="向左接糖果" onClick={()=>move(laneRef.current-1)}>⬅ 左邊</button><button onClick={()=>{sound.unlock();setRunning(v=>!v)}}>{running?'⏸ 暫停':'▶ 接糖果'}</button><button aria-label="向右接糖果" onClick={()=>move(laneRef.current+1)}>右邊 ➡</button></div><p className="game-message">沒接到也沒關係，還有好多糖果！</p></>
}

const bumpers=[{x:85,y:130},{x:215,y:130},{x:150,y:230}]
type Ball={x:number;y:number;vx:number;vy:number}
export function PumpkinPinball(){
  const initial=():Ball=>({x:150,y:365,vx:40,vy:-390}),ball=useRef<Ball>(initial()),[view,setView]=useState(initial),[running,setRunning]=useState(false),[score,setScore]=useState(0),[flash,setFlash]=useState(-1),lastHit=useRef(-1)
  useEffect(()=>{const hide=()=>{if(document.hidden)setRunning(false)};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide)},[])
  useEffect(()=>{if(!running)return;let last=performance.now(),frame=0;const tick=(now:number)=>{const dt=Math.min((now-last)/1000,.025);last=now;const b=ball.current;if(!document.hidden){b.vy+=160*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<16||b.x>284){b.x=Math.max(16,Math.min(284,b.x));b.vx*=-1}if(b.y<16){b.y=16;b.vy=Math.abs(b.vy)}let touching=-1;bumpers.forEach((p,i)=>{const dx=b.x-p.x,dy=b.y-p.y,d=Math.hypot(dx,dy);if(d<40){touching=i;const nx=d?dx/d:0,ny=d?dy/d:-1;b.x=p.x+nx*41;b.y=p.y+ny*41;b.vx=nx*230;b.vy=ny*230;if(lastHit.current!==i){setScore(s=>s+1);setFlash(i);sound.effect('pop')}}});lastHit.current=touching;if(touching<0)setFlash(-1);if(b.y>402){b.x=150;b.y=365;b.vx=70*(Math.random()>.5?1:-1);b.vy=-390;sound.tone(420,.12)}setView({...b})}frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame)},[running])
  const flip=(dir:number)=>{ball.current.vx=dir*170;ball.current.vy=-350;setRunning(true);sound.tone(550,.12)}
  return <><p className="instruction">發射小南瓜！按左右彈板，把它彈向星星。</p><div className="pinball-machine"><span className="party-counter" role="status">⭐ 撞到 {score} 顆星星</span><svg viewBox="0 0 300 420" aria-label="南瓜彈珠台"><path d="M20 350L95 390M280 350L205 390" stroke="#ffc98c" strokeWidth="16" strokeLinecap="round"/>{bumpers.map((p,i)=><g key={i}><circle cx={p.x} cy={p.y} r="29" fill={flash===i?'#fff':'#ffe59d'} stroke="#b795df" strokeWidth="7"/><text x={p.x} y={p.y+11} textAnchor="middle" fontSize="30">⭐</text></g>)}<text x={view.x} y={view.y+12} textAnchor="middle" fontSize="29">🎃</text></svg></div><div className="party-controls"><button aria-label="左彈板" onClick={()=>flip(1)}>↗ 左彈板</button><button onClick={()=>{sound.unlock();setRunning(v=>!v)}}>{running?'⏸ 暫停':'▶ 發射南瓜'}</button><button aria-label="右彈板" onClick={()=>flip(-1)}>右彈板 ↖</button></div><p className="game-message">掉下去會自己彈回來，繼續玩！</p></>
}

export function MonsterStack(){
  const [blocks,setBlocks]=useState<{id:number;emoji:string;x:number}[]>([]),[moving,setMoving]=useState(false),serial=useRef(0),locked=useRef(false),later=usePlayTimers()
  const add=(emoji:string)=>{if(locked.current||blocks.length>=6)return;locked.current=true;setMoving(true);setBlocks(b=>[...b,{id:++serial.current,emoji,x:(Math.random()-.5)*24}]);sound.effect('pop');later(()=>{locked.current=false;setMoving(false)},350)}
  return <><p className="instruction">選一隻小怪獸，疊成高高的萬聖節塔！</p><div className="stack-scene"><span className="stack-moon" aria-hidden="true">☾</span><div className="monster-tower">{blocks.map((b,i)=><div className="monster-block" key={b.id} style={{bottom:i*49,marginLeft:b.x}}>{b.emoji}</div>)}</div><div className="stack-ground"/></div><div className="party-controls">{['👻','🎃','👾'].map((emoji,i)=><button key={emoji} aria-label={`疊${['小幽靈','南瓜','小怪獸'][i]}`} disabled={moving||blocks.length>=6} onClick={()=>add(emoji)}>{emoji}</button>)}</div><p className="game-message" role="status">{blocks.length===6?'哇！六層怪獸塔完成！':`疊了 ${blocks.length} 層，再來一隻！`}</p><button className="primary-button" disabled={moving||!blocks.length} onClick={()=>{setBlocks([]);sound.effect('change')}}>✨ 再蓋一座</button></>
}
