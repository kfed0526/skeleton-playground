import {useRef,useState} from 'react'
import type {CSSProperties,PointerEvent} from 'react'
import Skeleton from '../components/Skeleton'
import type {Outfit} from '../services/play'
import {sound} from '../services/sound'
import {usePlayTimers} from './usePlayTimers'
import './more-games.css'

export function Drums({outfit}:{outfit:Outfit}){
  const [hit,setHit]=useState<{pad:number;id:number}|null>(null),serial=useRef(0);const later=usePlayTimers()
  const beat=(pad:number)=>{const id=++serial.current;setHit({pad,id});sound.tone([150,420,950][pad],.23);later(()=>{if(serial.current===id)setHit(null)},650)}
  return <><p className="instruction">咚！啪！叮！隨你敲，骨頭人跟著跳。</p><div className="drum-stage"><span className="music-note left-note" aria-hidden="true">♫</span><Skeleton outfit={outfit} pose={hit?'rock':'idle'}/><span className="music-note right-note" aria-hidden="true">♪</span><div className="beat-bubble" role="status">{hit?['咚咚！','啪啪！','叮叮！'][hit.pad]:'來敲一敲吧！'}</div></div><div className="drum-pads">{['南瓜大鼓','糖果小鼓','星星鈴鼓'].map((label,i)=><button className={`drum-pad drum-${i}`} key={label} aria-label={label} onClick={()=>beat(i)}><span className="drum-surface"><span aria-hidden="true">{['🎃','🍬','⭐'][i]}</span>{hit?.pad===i&&<span key={hit.id} className="drum-ripple"/>}</span><strong>{['咚！','啪！','叮！'][i]}</strong><small>{label}</small></button>)}</div></>
}
export function Trampoline({outfit}:{outfit:Outfit}){
  const [jump,setJump]=useState(0),[jumping,setJumping]=useState(false),serial=useRef(0);const later=usePlayTimers()
  const bounce=()=>{const id=++serial.current;setJump(id);setJumping(true);sound.tone(260+id%3*160,.22);later(()=>sound.tone(700,.12),260);later(()=>{if(serial.current===id)setJumping(false)},900)}
  return <><p className="instruction">點南瓜彈跳床，骨頭人就飛起來！</p><div className="trampoline-scene"><span className="bounce-cloud cloud-one" aria-hidden="true">☁️</span><span className="bounce-cloud cloud-two" aria-hidden="true">☁️</span><span className="bounce-stars" aria-hidden="true">✦　✦　✦</span><div key={jump} className={`bounce-friend ${jumping?'bouncing':''}`} style={{'--jump-height':[-60,-100,-130][jump%3]+'px'} as CSSProperties}><Skeleton outfit={outfit} pose="idle"/></div><button className="pumpkin-trampoline" aria-label="跳上南瓜彈跳床" onClick={bounce}><span className="trampoline-top">🎃</span><span className="trampoline-springs" aria-hidden="true">〰　〰　〰</span><strong>點我跳！</strong></button></div><p className="game-message" role="status">{jumping?'咻——骨頭人飛起來囉！':'軟軟的彈跳床，準備好了！'}</p><button className="primary-button" onClick={bounce}>🦴 再跳高一點！</button></>
}
const candies=['🍬','🍭','🍪']
export function CandyMonster(){
  const [selected,setSelected]=useState<number|null>(null),[eating,setEating]=useState(false),[fed,setFed]=useState(0),[lastCandy,setLastCandy]=useState(0),[drag,setDrag]=useState<{x:number;y:number;index:number}|null>(null)
  const locked=useRef(false),mouth=useRef<HTMLButtonElement>(null);const later=usePlayTimers()
  const feed=(index:number)=>{if(locked.current)return;locked.current=true;setEating(true);setLastCandy(index);setSelected(null);setFed(n=>n+1);sound.effect('pop');later(()=>{setEating(false);locked.current=false},850)}
  const down=(e:PointerEvent<HTMLButtonElement>,index:number)=>{if(locked.current)return;e.currentTarget.setPointerCapture(e.pointerId);setSelected(index);setDrag({x:e.clientX,y:e.clientY,index})}
  const up=(e:PointerEvent<HTMLButtonElement>,index:number)=>{const r=mouth.current?.getBoundingClientRect();setDrag(null);if(r&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)feed(index)}
  return <><p className="instruction">三種點心都喜歡！點糖果再點嘴巴，也可以拖進去。</p><button ref={mouth} className={`candy-monster ${eating?'monster-eating':''} mood-${fed%3}`} aria-label="餵小怪獸" onClick={()=>{if(selected!==null)feed(selected)}}><span className="monster-horns" aria-hidden="true">▲　　　▲</span><span className="monster-eyes" aria-hidden="true">◕　◕</span><span className="monster-mouth" aria-hidden="true">{eating?'😋':'◡'}</span>{eating&&<span className="fed-candy" aria-hidden="true">{candies[lastCandy]}</span>}<span className="monster-cheeks" aria-hidden="true">●　　　●</span><small>{eating?'嚼嚼！好好吃！':selected!==null?'啊——請放進來！':'我的肚子咕嚕咕嚕！'}</small></button><div className="candy-tray">{candies.map((emoji,i)=><button key={emoji} aria-label={['包裝糖果','棒棒糖','餅乾'][i]} aria-pressed={selected===i} disabled={eating} onPointerDown={e=>down(e,i)} onPointerMove={e=>{if(drag)setDrag({...drag,x:e.clientX,y:e.clientY})}} onPointerUp={e=>up(e,i)} onPointerCancel={()=>setDrag(null)} onClick={()=>{if(!locked.current)setSelected(i)}}><span>{emoji}</span><small>{['糖果','棒棒糖','餅乾'][i]}</small></button>)}</div><div className="game-message" role="status">{eating?'謝謝你！小怪獸開心扭一扭！':'想餵哪一種都可以！'}</div>{drag&&<div className="drag-candy" style={{left:drag.x,top:drag.y}} aria-hidden="true">{candies[drag.index]}</div>}</>
}
export function HideGhost(){
  const [hiding,setHiding]=useState(()=>Math.floor(Math.random()*5)),[opened,setOpened]=useState<number[]>([]),[found,setFound]=useState(false)
  const peek=(index:number)=>{if(found||opened.includes(index))return;setOpened(p=>[...p,index]);sound.effect(index===hiding?'spark':'pop');if(index===hiding)setFound(true)}
  return <><p className="instruction">小幽靈躲在哪裡？每個地方都可以看一看！</p><div className="hide-village">{['🏠','🎃','🌳','🏰','🎁'].map((emoji,i)=><button key={i} className={`hiding-place hiding-${i} ${opened.includes(i)?'opened':''} ${found&&hiding===i?'ghost-found':''}`} aria-label={['小房子','大南瓜','大樹','小城堡','禮物盒'][i]} disabled={found||opened.includes(i)} onClick={()=>peek(i)}><span className="hiding-cover" aria-hidden="true">{emoji}</span><span className="hidden-surprise" aria-hidden="true">{opened.includes(i)?i===hiding?'👻':'🍬':'？'}</span><small>{opened.includes(i)?i===hiding?'找到我啦！':'送你一顆糖！':'點我看看'}</small></button>)}</div><div className="game-message" role="status">{found?'BOO！找到小幽靈了！':opened.length?'哇，這裡有糖果！再看看別的地方。':'我躲好了，你來找我呀！'}</div>{found&&<button className="primary-button" onClick={()=>{setHiding((previous)=>(previous+1+Math.floor(Math.random()*4))%5);setOpened([]);setFound(false);sound.effect('change')}}>👻 再躲一次</button>}</>
}
