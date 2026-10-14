import {useEffect,useRef,useState} from 'react'
import Skeleton from '../components/Skeleton'
import type {Outfit} from '../services/play'
import {sound} from '../services/sound'
import {mazes,nextMazePosition} from '../services/maze'
import {usePlayTimers} from './usePlayTimers'
import './adventure-games.css'

export function GhostMaze(){
  const [level,setLevel]=useState(0),[position,setPosition]=useState(8),[collected,setCollected]=useState<number[]>([])
  const map=mazes[level],won=position===40,walkable=map.join('').split('').flatMap((c,i)=>c==='.'&&i!==8&&i!==40?[i]:[]),treats=[walkable[2],walkable[Math.floor(walkable.length/2)]]
  const move=(dx:number,dy:number)=>{if(won)return;const next=nextMazePosition(map,position,dx,dy);if(next===position)return;setPosition(next);if(treats.includes(next)&&!collected.includes(next)){setCollected(c=>[...c,next]);sound.effect('pop')}if(next===40)sound.effect('spark')}
  useEffect(()=>{const key=(e:KeyboardEvent)=>{const directions:Record<string,number[]>={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};if(directions[e.key]){e.preventDefault();move(...directions[e.key] as [number,number])}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)})
  return <><p className="instruction">帶小幽靈走到城堡！路上的糖果也可以帶走。</p><div className="ghost-maze" aria-label="幽靈迷宮">{map.join('').split('').map((cell,i)=><div key={i} className={`maze-cell ${cell==='#'?'maze-wall':''}`} data-position={i===position?'ghost':undefined}>{cell==='#'?'':i===position?'👻':i===40?'🏰':treats.includes(i)&&!collected.includes(i)?'🍬':''}</div>)}</div><div className="maze-arrows"><button aria-label="迷宮向上" disabled={won} onClick={()=>move(0,-1)}>⬆</button><div><button aria-label="迷宮向左" disabled={won} onClick={()=>move(-1,0)}>⬅</button><button aria-label="迷宮向下" disabled={won} onClick={()=>move(0,1)}>⬇</button><button aria-label="迷宮向右" disabled={won} onClick={()=>move(1,0)}>➡</button></div></div><p className="game-message" role="status">{won?'到城堡了！小幽靈開心說 BOO！':`收集 ${collected.length} 顆糖果，慢慢找路！`}</p><button className="primary-button" onClick={()=>{setLevel(l=>(l+1)%mazes.length);setPosition(8);setCollected([]);sound.effect('change')}}>🗺️ 換一張迷宮</button></>
}

export function PumpkinPop(){
  const [active,setActive]=useState(0),[running,setRunning]=useState(false),[hits,setHits]=useState(0),[spark,setSpark]=useState<number|null>(null),activeRef=useRef<number|null>(0),previous=useRef(0),later=usePlayTimers()
  const show=()=>{const next=(previous.current+1+Math.floor(Math.random()*5))%6;previous.current=next;activeRef.current=next;setActive(next)}
  useEffect(()=>{if(!running)return;const timer=setInterval(show,2000);return()=>clearInterval(timer)},[running])
  useEffect(()=>{const hide=()=>{if(document.hidden)setRunning(false)};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide)},[])
  const hit=(i:number)=>{if(!running||activeRef.current!==i)return;activeRef.current=null;setHits(n=>n+1);setSpark(i);setActive(-1);sound.effect('pop');later(()=>setSpark(null),500)}
  return <><p className="instruction">南瓜探出頭了！輕輕點一下，變出糖果煙花。</p><div className="pumpkin-patch">{Array.from({length:6},(_,i)=><button key={i} aria-label={`南瓜洞 ${i+1}`} disabled={!running||active!==i} onClick={()=>hit(i)} className={`pumpkin-hole ${running&&active===i?'pumpkin-up':''}`}><span>{spark===i?'🍬':running&&active===i?'🎃':'🌱'}</span><small>{spark===i?'啵！':running&&active===i?'點我！':'小南瓜在休息'}</small></button>)}</div><p className="game-message" role="status">🎃 點到 {hits} 顆小南瓜！</p><button className="primary-button" onClick={()=>{sound.unlock();if(!running&&activeRef.current===null)show();setRunning(v=>!v)}}>{running?'⏸ 暫停':'▶ 南瓜出來玩'}</button><p className="game-message">漏掉也沒關係，小南瓜會再來！</p></>
}

const planets=[{emoji:'🌙',name:'月亮',text:'月亮軟軟的，一起跳太空舞！'},{emoji:'🪐',name:'土星',text:'繞著漂亮的星環滑一圈！'},{emoji:'🍬',name:'糖果星球',text:'哇！整顆星球都是甜甜的糖果！'}]
export function SkeletonRocket({outfit}:{outfit:Outfit}){
  const [planet,setPlanet]=useState(0),[phase,setPhase]=useState<'ready'|'flying'|'landed'>('ready'),[stars,setStars]=useState<number[]>([]),[flight,setFlight]=useState(0),locked=useRef(false),later=usePlayTimers()
  const launch=()=>{if(locked.current)return;locked.current=true;setPhase('flying');setStars([]);setFlight(n=>n+1);sound.effect('roll');later(()=>{setPhase('landed');locked.current=false;sound.effect('spark')},3000)}
  return <><p className="instruction">選一顆星球，帶骨頭人搭火箭！飛行時可以點星星。</p><div className="planet-picker">{planets.map((p,i)=><button key={p.name} aria-label={`前往${p.name}`} aria-pressed={planet===i} disabled={phase==='flying'} onClick={()=>{setPlanet(i);setPhase('ready')}}><span>{p.emoji}</span>{p.name}</button>)}</div><div className={`rocket-scene rocket-${phase}`}><span className="rocket-destination" aria-hidden="true">{planets[planet].emoji}</span>{phase==='flying'&&Array.from({length:5},(_,i)=><button key={`${flight}-${i}`} className="space-star" style={{left:`${[13,75,25,80,15][i]}%`,top:`${[12,20,43,60,75][i]}%`}} aria-label={`太空星星 ${i+1}`} disabled={stars.includes(i)} onClick={()=>{setStars(s=>s.includes(i)?s:[...s,i]);sound.effect('pop')}}>{stars.includes(i)?'✨':'⭐'}</button>)}<div className="skeleton-rocket"><div className="rocket-window"><Skeleton outfit={outfit} pose={phase==='landed'?'wiggle':'idle'}/></div><span className="rocket-nose"/><span className="rocket-fin fin-left"/><span className="rocket-fin fin-right"/>{phase==='flying'&&<span className="rocket-flame" aria-hidden="true">🔥</span>}</div><div className="space-ground"/></div><p className="game-message" role="status">{phase==='flying'?`咻——飛往${planets[planet].name}！點到 ${stars.length} 顆星星。`:phase==='landed'?`抵達${planets[planet].name}！${planets[planet].text}`:'骨頭人準備好了，出發吧！'}</p><button className="primary-button" disabled={phase==='flying'} onClick={launch}>🚀 {phase==='landed'?'再飛一次':'火箭出發'}</button></>
}
