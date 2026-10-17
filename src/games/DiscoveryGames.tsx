import {useRef, useState} from 'react'
import type {CSSProperties, PointerEvent} from 'react'
import Skeleton from '../components/Skeleton'
import type {Outfit} from '../services/play'
import {sound} from '../services/sound'
import {usePlayTimers} from './usePlayTimers'
import './discovery-games.css'

const treasures = [{name:'星星',emoji:'⭐'}, {name:'蘑菇',emoji:'🍄'}, {name:'糖果',emoji:'🍬'}, {name:'花朵',emoji:'🌸'}, {name:'蝴蝶',emoji:'🦋'}, {name:'蘋果',emoji:'🍎'}]
const spots = [[18,24],[49,20],[80,30],[25,70],[57,65],[83,77]]
export function MonsterFlashlight() {
  const [round, setRound] = useState(0)
  const [beam, setBeam] = useState({x:50,y:45})
  const [found, setFound] = useState<number[]>([])
  const targets = [round % 6, (round + 2) % 6, (round + 4) % 6]
  const collect = (index:number) => {
    if (!targets.includes(index) || found.includes(index)) return
    setFound(previous => previous.includes(index) ? previous : [...previous,index]); sound.effect('pop')
  }
  const explore = (event:PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' && !event.buttons) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(100,(event.clientX-rect.left)/rect.width*100))
    const y = Math.max(0, Math.min(100,(event.clientY-rect.top)/rect.height*100))
    setBeam({x,y})
    treasures.forEach((_,index) => {const spot=spots[(index+round)%6];if(Math.hypot((spot[0]-x)*rect.width/100,(spot[1]-y)*rect.height/100)<55)collect(index)})
  }
  return <><p className="instruction">移動手電筒，找找清單上的三個寶物！也可以點點看。</p>
    <div className="discovery-list" aria-label="尋寶清單">{targets.map(index=><span key={index}>{found.includes(index)?'✅':treasures[index].emoji} {treasures[index].name}</span>)}</div>
    <div className="flashlight-scene" aria-label="夜晚尋寶花園" style={{'--beam-x':`${beam.x}%`,'--beam-y':`${beam.y}%`} as CSSProperties} onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId);explore(event)}} onPointerMove={explore}>
      <div className="night-scenery" aria-hidden="true">🌲　　　🌙　　　🌳<br/>🌿　　　　　🌿<br/>　🌱　　🌼　　🌱</div>
      {treasures.map((item,index)=>{const [x,y]=spots[(index+round)%6];return <button key={item.name} className={`hidden-treasure ${found.includes(index)?'treasure-found':''}`} style={{left:`${x}%`,top:`${y}%`}} aria-label={`尋找${item.name}`} onClick={()=>{setBeam({x,y});collect(index)}}>{item.emoji}</button>})}
      <div className="night-shade" aria-hidden="true"/>
    </div>
    <p className="game-message" role="status">{found.length===3?'都找到了！小怪獸謝謝你！':`🔦 找到 ${found.length} / 3 個寶物，慢慢找就好。`}</p>
    <button className="primary-button" onClick={()=>{setRound(value=>(value+1)%6);setFound([]);setBeam({x:50,y:45})}}>{found.length===3?'✨ 再找一輪':'🌙 換一座花園'}</button>
  </>
}

const bridges = [{gap:1,name:'小溪'}, {gap:2,name:'花園河'}, {gap:3,name:'糖果河'}]
export function PumpkinBridge() {
  const [level,setLevel]=useState(0),[plank,setPlank]=useState<number|null>(null),[placed,setPlaced]=useState(false),[crossed,setCrossed]=useState(false)
  const [message,setMessage]=useState('看看河有多寬，選一塊剛剛好的木板。')
  const reset=(next:number)=>{setLevel(next);setPlank(null);setPlaced(false);setCrossed(false);setMessage('看看河有多寬，選一塊剛剛好的木板。')}
  const gap=bridges[level].gap
  return <><p className="instruction">選木板，再點河上的位置，幫南瓜過河！</p>
    <div className="discovery-controls">{bridges.map((item,index)=><button key={item.name} aria-pressed={level===index} onClick={()=>reset(index)}>{item.name}</button>)}</div>
    <div className={`bridge-scene gap-${gap}`}><span className={`bridge-friend ${crossed?'across':''}`} aria-label="過河的南瓜">🎃</span><span className="bridge-destination" aria-hidden="true">🏡</span>
      <div className="river" aria-hidden="true">〰<br/>〰<br/>〰</div><button className={`bridge-slot ${placed?'plank-placed':''}`} aria-label="放置木板" disabled={placed} onClick={()=>{if(plank===null){setMessage('先選一塊木板吧！');return}if(plank!==gap){setMessage(plank<gap?'這塊太短了，再選長一點的木板。':'這塊太長了，再選短一點的木板。');sound.effect('change');return}setPlaced(true);setMessage('剛剛好！按出發，讓南瓜過河。');sound.effect('pop')}}>{placed?'橋搭好了':'點這裡搭橋'}</button>
    </div>
    <div className="discovery-controls plank-tray">{[1,2,3].map(length=><button key={length} aria-label={`${['短','中','長'][length-1]}木板`} aria-pressed={plank===length} disabled={placed} onClick={()=>setPlank(length)}><span style={{width:40+length*22}}>{'●'.repeat(length)}</span><small>{['短','中','長'][length-1]}</small></button>)}</div>
    <button className="primary-button" disabled={!placed||crossed} onClick={()=>{setCrossed(true);setMessage('過河了！南瓜開心到朋友家玩！');sound.effect('spark')}}>🎃 出發過河</button>
    <p className="game-message" role="status">{message}</p>{crossed&&<button className="soft-button" onClick={()=>reset((level+1)%3)}>🌉 再搭一座橋</button>}
  </>
}

type Track = -1|0|1
const slideLevels=[{name:'直達糖果屋',start:1,target:1},{name:'左邊的朋友',start:2,target:0},{name:'右邊的城堡',start:0,target:2}]
export function SkeletonSlide({outfit}:{outfit:Outfit}) {
  const [level,setLevel]=useState(0),[pieces,setPieces]=useState<Track[]>([0,0,0]),[running,setRunning]=useState(false),[ball,setBall]=useState<{x:number;y:number}|null>(null)
  const [message,setMessage]=useState('點每段滑梯換方向，讓小球滑到終點！')
  const serial=useRef(0),locked=useRef(false),later=usePlayTimers()
  const current=slideLevels[level]
  const reset=(next=level)=>{serial.current++;locked.current=false;setLevel(next);setPieces([0,0,0]);setBall(null);setRunning(false);setMessage('點每段滑梯換方向，讓小球滑到終點！')}
  let lane=current.start
  const segments=pieces.map((piece,index)=>{const from=lane;lane+=piece;return {from,to:lane,y:index*85+45}})
  const launch=()=>{
    if(locked.current)return
    if(segments.some(segment=>segment.to<0||segment.to>2)){setMessage('滑梯伸到外面了，換個方向接回來吧！');return}
    locked.current=true;setRunning(true);setMessage('小球出發囉！');const token=++serial.current
    setBall({x:70+current.start*100,y:45})
    segments.forEach((segment,index)=>{
      for(let step=1;step<=6;step++)later(()=>{
        if(token!==serial.current)return
        const t=step/6, x=70+segment.from*100
        setBall({x:x+t*t*(segment.to-segment.from)*100,y:segment.y+2*(1-t)*t*40+t*t*85})
        if(step===6)sound.tone(450+index*100,.12)
      },index*600+step*100)
    })
    later(()=>{if(token!==serial.current)return;locked.current=false;setRunning(false);const won=segments[2].to===current.target;setMessage(won?'抵達終點！骨頭人開心拍手！':'滑到另一邊了！調整方向，再試一次。');sound.effect(won?'spark':'change')},2500)
  }
  return <><p className="instruction">點滑梯換方向，再放小球，看看會滾到哪裡！</p>
    <div className="discovery-controls">{slideLevels.map((item,index)=><button key={item.name} aria-pressed={level===index} onClick={()=>reset(index)}>{item.name}</button>)}</div>
    <div className="slide-scene"><div className="slide-skeleton"><Skeleton outfit={outfit}/></div>
      <svg className="slide-board" viewBox="0 0 340 360" aria-label="小球滑梯路線"><rect width="340" height="360" rx="24" fill="#392c52"/>
        {[0,1,2].map(index=><g key={index}><path d={`M${70+index*100} 25 V310`} stroke="#ffffff15" strokeWidth="3" strokeDasharray="5 8"/><text x={70+index*100} y="345" textAnchor="middle" fontSize="32">{index===current.target?'🏰':'🌼'}</text></g>)}
        {segments.map((segment,index)=><path key={index} d={`M${70+segment.from*100} ${segment.y} Q${70+segment.from*100} ${segment.y+40} ${70+segment.to*100} ${segment.y+85}`} stroke={['#e8b2d2','#acdccc','#f3d48c'][index]} strokeWidth="18" fill="none" strokeLinecap="round"/>)}
        <text x={70+current.start*100} y="28" textAnchor="middle" fill="#fff1da" fontSize="16">起點</text>
        <circle className="slide-ball" data-moving={ball!==null} cx={ball?.x??70+current.start*100} cy={ball?.y??45} r="13" fill="#ffab63" stroke="#fff4d0" strokeWidth="3"/>
      </svg>
    </div>
    <div className="discovery-controls slide-pieces">{pieces.map((piece,index)=><button key={index} aria-label={`第 ${index+1} 段滑梯`} disabled={running} onClick={()=>{setBall(null);setPieces(previous=>previous.map((value,i)=>i===index?(value===0?1:value===1?-1:0):value));setMessage('方向換好了！再看看每段有沒有接到終點。')}}><small>第 {index+1} 段</small>{piece===0?'⬇️':piece===1?'↘️':'↙️'}</button>)}</div>
    <div className="discovery-controls"><button className="primary-button" disabled={running} onClick={launch}>🟠 放小球</button><button onClick={()=>reset()}>重新搭滑梯</button></div>
    <p className="game-message" role="status">{message}</p>
  </>
}
