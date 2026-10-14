import {useEffect,useRef,useState} from 'react'
import type {PointerEvent} from 'react'
import {DiscoIcon} from '../components/PlayIcons'
import Skeleton from '../components/Skeleton'
import type {Outfit} from '../services/play'
import {bowlingPins,clampLane} from '../services/play'
import {sound} from '../services/sound'

import {usePlayTimers as useTimers} from './usePlayTimers'

export function Dance({outfit}:{outfit:Outfit}){
  const [pose,setPose]=useState('wiggle'),[playing,setPlaying]=useState(false)
  useEffect(()=>()=>sound.stop(),[])
  const play=(next:string)=>{setPose(next);setPlaying(true);sound.dance()}
  return <><div className="disco-scene"><span className="disco-ball" aria-hidden="true"><DiscoIcon/></span><div className="spotlight"/><Skeleton outfit={outfit} pose={playing?pose:'idle'}/><span className="stage-stars" aria-hidden="true">✦　✧　✦</span></div><div className="controls dance-controls">{[['wiggle','🕺','扭扭舞'],['robot','🤖','機器舞'],['rock','🎸','搖滾舞']].map(([id,emoji,title])=><button key={id} aria-pressed={playing&&pose===id} onClick={()=>play(id)}><span>{emoji}</span>{title}</button>)}</div><button className="soft-button" onClick={()=>{if(playing){setPlaying(false);sound.stop()}else play(pose)}}>{playing?'⏸ 休息一下':'▶ 開始跳舞'}</button></>
}
export function Bowling(){
  const [lane,setLane]=useState(.5),[rolling,setRolling]=useState(false),[down,setDown]=useState<boolean[]>(Array(6).fill(false)),[done,setDone]=useState(false)
  const locked=useRef(false),drag=useRef<{x:number;y:number}|null>(null),track=useRef<HTMLDivElement>(null);const later=useTimers()
  const roll=(aim=lane)=>{if(locked.current)return;locked.current=true;setRolling(true);setDone(false);sound.effect('roll');later(()=>{setDown(bowlingPins(aim));sound.effect('spark')},700);later(()=>{setDone(true)},1300)}
  const up=(e:PointerEvent)=>{if(!drag.current)return;const distance=Math.hypot(e.clientX-drag.current.x,e.clientY-drag.current.y);drag.current=null;if(distance>15&&track.current){const r=track.current.getBoundingClientRect(),aim=clampLane((e.clientX-r.left)/r.width);setLane(aim);roll(aim)}}
  return <><p className="instruction">選方向，再點南瓜！也可以把南瓜往前推。</p><div ref={track} className="bowling-track" aria-label="南瓜保齡球球道"><div className="pin-rack">{down.map((value,i)=><div key={i} data-testid="pin" data-down={value} className={`bone-pin pin-${i} ${value?'fallen':''}`}><Skeleton outfit={{hat:'none',glasses:false,color:'#fff5d5'}}/></div>)}</div><div className="aim-line" style={{left:lane*100+'%'}}/><button aria-label="滾出南瓜" disabled={rolling} className={`pumpkin-ball ${rolling?'rolling':''}`} style={{left:lane*100+'%'}} onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerUp={up} onPointerCancel={()=>{drag.current=null}} onClick={()=>roll()}>🎃</button></div><div className="controls directions">{[[.25,'↖ 左邊'],[.5,'↑ 中間'],[.75,'↗ 右邊']].map(([value,title])=><button key={value} disabled={rolling} aria-pressed={lane===value} onClick={()=>setLane(Number(value))}>{title}</button>)}</div><div className="game-message" role="status">{done?'哈哈！骨頭人東倒西歪！':rolling?'咕嚕咕嚕……':'南瓜準備出發囉！'}</div>{done&&<button className="primary-button" onClick={()=>{locked.current=false;setRolling(false);setDown(Array(6).fill(false));setDone(false)}}>🎃 再滾一次</button>}</>
}
export function Bubbles(){
  const [popped,setPopped]=useState<number[]>([]);const later=useTimers()
  const pop=(i:number)=>{if(popped.includes(i))return;setPopped(p=>[...p,i]);sound.effect('pop');later(()=>setPopped(p=>p.filter(x=>x!==i)),900)}
  return <><p className="instruction">點點泡泡，和小幽靈打招呼！</p><div className="bubble-garden">{Array.from({length:8},(_,i)=><button key={i} className={`ghost-bubble bubble-${i%4} ${popped.includes(i)?'popped':''}`} aria-label={`幽靈泡泡 ${i+1}`} disabled={popped.includes(i)} onClick={()=>pop(i)}><span className="bubble-shine"/><span className="bubble-ghost">{popped.includes(i)?'✨':'👻'}</span><span className="pop-word">啵！</span></button>)}</div></>
}
export function Dressup({outfit,onChange}:{outfit:Outfit;onChange:(value:Outfit)=>void}){
  const change=(patch:Partial<Outfit>)=>{onChange({...outfit,...patch});sound.effect('change')}
  return <><div className="dressing-room"><span className="mirror-sparkle" aria-hidden="true">✦</span><Skeleton outfit={outfit} pose="wiggle"/><p>今天的我，是萬聖節大明星！</p></div><div className="wardrobe"><div className="controls hats">{(['none','witch','party','pirate'] as const).map((hat,i)=><button aria-pressed={outfit.hat===hat} key={hat} onClick={()=>change({hat})}>{['🙂 不戴帽子','🧙 巫師帽','🎉 派對帽','🏴‍☠️ 海盜帽'][i]}</button>)}</div><div className="controls accessories"><button aria-pressed={outfit.glasses} onClick={()=>change({glasses:!outfit.glasses})}>👓 {outfit.glasses?'拿掉眼鏡':'戴上眼鏡'}</button>{['#fff5d5','#ffb9d4','#a4e4cc','#cbb4f2'].map((color,i)=><button className="color-button" key={color} aria-label={['奶油骨頭','粉紅骨頭','薄荷骨頭','紫色骨頭'][i]} aria-pressed={outfit.color===color} style={{background:color}} onClick={()=>change({color})}>🦴</button>)}</div></div></>
}
type Burst={id:number;x:number;y:number;emoji:string}
export function Fireworks({outfit}:{outfit:Outfit}){
  const [bursts,setBursts]=useState<Burst[]>([]),id=useRef(0);const later=useTimers()
  const fire=(x:number,y:number)=>{const next=++id.current;setBursts(p=>[...p.slice(-11),{id:next,x,y,emoji:['🍬','⭐','🎃','🍭','💜'][next%5]}]);sound.effect('spark');later(()=>setBursts(p=>p.filter(b=>b.id!==next)),1500)}
  return <><p className="instruction">點天空！放一朵甜甜的煙火。</p><div className="firework-sky" role="button" tabIndex={0} aria-label="糖果煙火天空" onPointerDown={e=>{const r=e.currentTarget.getBoundingClientRect();fire((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100)}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fire(50,35)}}}><span className="sky-moon" aria-hidden="true">☾</span><span className="sky-prompt" aria-hidden="true">✦ 點這裡放煙火 ✦</span>{bursts.map(b=><div className="candy-burst" key={b.id} style={{left:b.x+'%',top:b.y+'%'}}>{Array.from({length:8},(_,i)=><span key={i} style={{'--angle':i*45+'deg'} as React.CSSProperties}>{b.emoji}</span>)}</div>)}<div className="firework-friend"><Skeleton outfit={outfit} pose={bursts.length?'rock':'idle'}/></div><div className="sky-town" aria-hidden="true">🏰　🎃　🏠　🌳</div></div><button className="primary-button" onClick={()=>fire(25+Math.random()*50,20+Math.random()*35)}>🍬 再放一朵！</button></>
}
