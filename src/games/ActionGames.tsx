import {useEffect,useRef,useState} from 'react'
import Skeleton from '../components/Skeleton'
import type {Outfit} from '../services/play'
import {sound} from '../services/sound'
import {usePlayTimers} from './usePlayTimers'
import './action-games.css'

type Traffic={id:number;lane:number;y:number}
export function GhostRace({outfit}:{outfit:Outfit}){
  const [lane,setLane]=useState(1),[running,setRunning]=useState(false),[traffic,setTraffic]=useState<Traffic[]>([]),[passed,setPassed]=useState(0),[message,setMessage]=useState('小幽靈準備出發！')
  const laneRef=useRef(1),serial=useRef(0),invincible=useRef(0),carsRef=useRef<Traffic[]>([]),spawnRef=useRef(0)
  const steer=(direction:number)=>{laneRef.current=Math.max(0,Math.min(2,laneRef.current+direction));setLane(laneRef.current)}
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();steer(e.key==='ArrowLeft'?-1:1)}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[])
  useEffect(()=>{if(!running)return;let cars=carsRef.current,spawn=spawnRef.current,last=performance.now(),frame=0;const tick=(now:number)=>{const dt=Math.min(now-last,60);last=now;if(!document.hidden){spawn+=dt;if(spawn>=1500){spawn=0;cars.push({id:++serial.current,lane:Math.floor(Math.random()*3),y:-12})}cars=cars.filter(car=>{car.y+=dt*.017;if(car.lane===laneRef.current&&car.y>71&&car.y<87&&now>invincible.current){invincible.current=now+1400;setMessage('輕輕碰到朋友了，再閃一次！');sound.tone(180,.15);return false}if(car.y>110){setPassed(n=>n+1);setMessage('咻——閃過朋友了！');return false}return true});carsRef.current=cars;spawnRef.current=spawn;setTraffic(cars.map(car=>({...car})))}frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame)},[running])
  useEffect(()=>{const hide=()=>{if(document.hidden)setRunning(false)};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide)},[])
  return <><p className="instruction">左右轉，閃過路上的骨頭人！碰到也可以繼續開。</p><div className={`ghost-road ${running?'road-running':''}`} aria-label="幽靈賽道"><span className="road-moon" aria-hidden="true">☾</span><div className="lane-lines"/>{traffic.map(car=><div key={car.id} className="road-friend" style={{left:`${(car.lane+.5)*100/3}%`,top:`${car.y}%`}}><Skeleton outfit={outfit} pose="idle"/></div>)}<div className="ghost-car" data-lane={lane} style={{left:`${(lane+.5)*100/3}%`}} aria-label="幽靈主車"><span>👻</span><strong>🏎️</strong></div><span className="road-score">🌟 閃過 {passed} 位朋友</span></div><div className="race-controls"><button aria-label="向左轉" onClick={()=>steer(-1)}>⬅️ 左轉</button><button className="primary-button" onClick={()=>{sound.unlock();setRunning(v=>!v)}}>{running?'⏸ 暫停': '🏁 '+(traffic.length||passed?'繼續開':'出發')}</button><button aria-label="向右轉" onClick={()=>steer(1)}>右轉 ➡️</button></div><p className="game-message" role="status">{message}</p></>
}

export function SkeletonShooter({outfit}:{outfit:Outfit}){
  const [targets,setTargets]=useState([0,1,2,3,4,5]),[hits,setHits]=useState<number[]>([]),[score,setScore]=useState(0),[shot,setShot]=useState<number|null>(null)
  const locked=useRef(new Set<number>()),later=usePlayTimers(),shotSerial=useRef(0)
  const fire=(id:number)=>{if(locked.current.has(id))return;locked.current.add(id);setHits(h=>[...h,id]);setScore(n=>n+1);const serial=++shotSerial.current;setShot(id);sound.effect('spark');later(()=>{if(shotSerial.current===serial)setShot(null)},500);later(()=>{setTargets(t=>t.map(target=>target===id?id+6:target));setHits(h=>h.filter(hit=>hit!==id));locked.current.delete(id)},1000)}
  return <><p className="instruction">骨頭人拿起糖果發射器！點南瓜靶，射出魔法糖果。</p><div className="shooting-stage"><div className="target-grid">{targets.map((id,i)=><button key={id} className={`pumpkin-target ${hits.includes(id)?'target-hit':''}`} aria-label={`射擊南瓜靶 ${i+1}`} disabled={hits.includes(id)} onClick={()=>fire(id)}><span>{hits.includes(id)?'✨':'🎃'}</span><small>{hits.includes(id)?'命中！':'點我發射'}</small></button>)}</div><div className="skeleton-gunner"><Skeleton outfit={outfit} pose={shot!==null?'rock':'idle'}/><span className="candy-launcher" aria-hidden="true">🍭</span>{shot!==null&&<span key={shot} className="magic-shot" aria-hidden="true">🍬 ✦</span>}</div><div className="shoot-score" role="status">⭐ 打中 {score} 個南瓜靶！</div></div><p className="game-message">南瓜會再回來，想玩多久都可以！</p></>
}
