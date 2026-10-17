import {useRef, useState} from 'react'
import type {CSSProperties, PointerEvent} from 'react'
import {sound} from '../services/sound'
import './care-games.css'

const friends = [{name:'葡萄怪',color:'#b29cdb'},{name:'薄荷怪',color:'#8bd4bd'},{name:'草莓怪',color:'#efabca'}]

export function MonsterBrush() {
  const [friend,setFriend]=useState(0),[clean,setClean]=useState(()=>Array<number>(12).fill(0)),[brush,setBrush]=useState<{x:number;y:number}|null>(null)
  const drag=useRef(false),last=useRef<{index:number;x:number;y:number}|null>(null),skipClick=useRef(false)
  const mouth=useRef<HTMLDivElement>(null)
  const cleaned=clean.filter(value=>value>=3).length
  const scrub=(index:number)=>setClean(previous=>previous.map((value,i)=>i===index?Math.min(3,value+1):value))
  const move=(event:PointerEvent<HTMLDivElement>)=>{
    if(!drag.current)return
    const rect=event.currentTarget.getBoundingClientRect()
    setBrush({x:event.clientX-rect.left,y:event.clientY-rect.top})
    const teeth=mouth.current?.querySelectorAll<HTMLButtonElement>('.monster-tooth')
    teeth?.forEach((tooth,index)=>{const r=tooth.getBoundingClientRect();if(event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom){const p=last.current;if(!p||p.index!==index||Math.hypot(p.x-event.clientX,p.y-event.clientY)>10){scrub(index);last.current={index,x:event.clientX,y:event.clientY};skipClick.current=true}}})
  }
  return <><p className="instruction">怪獸張大嘴巴囉！在牙齒上來回刷，也可以點牙齒刷三下。</p>
    <div className="care-scene brush-scene" style={{'--friend-color':friends[friend].color} as CSSProperties} onPointerDown={event=>{drag.current=true;last.current=null;skipClick.current=false;event.currentTarget.setPointerCapture(event.pointerId);move(event)}} onPointerMove={move} onPointerUp={()=>{drag.current=false;setBrush(null)}} onPointerCancel={()=>{drag.current=false;setBrush(null)}} onLostPointerCapture={()=>{drag.current=false;setBrush(null)}}>
      <div className="care-horns" aria-hidden="true">▲　　　▲</div><div className="care-eyes" aria-hidden="true">◕　◕</div>
      <div ref={mouth} className="brushing-mouth" aria-label="怪獸張開的大嘴巴"><div className="pink-tongue" aria-hidden="true"/>{[0,1].map(row=><div key={row} className={`tooth-row tooth-row-${row}`}>{Array.from({length:6},(_,col)=>{const index=row*6+col;return <button key={index} className={`monster-tooth ${clean[index]>=3?'tooth-clean':''}`} aria-label={`第 ${index+1} 顆牙齒`} aria-description={clean[index]>=3?'刷乾淨了':`已刷 ${clean[index]} 下`} onClick={event=>{if(skipClick.current&&event.detail!==0){skipClick.current=false;return}scrub(index)}}><span className="tooth-dirt" style={{opacity:1-clean[index]/3}} aria-hidden="true">●<i>●</i></span>{clean[index]>0&&clean[index]<3&&<span className="tooth-foam" aria-hidden="true">○◦</span>}{clean[index]>=3&&<span className="tooth-shine" aria-hidden="true">✦</span>}</button>})}</div>)}</div>
      <span className="brush-hint" aria-hidden="true">{cleaned===12?'✨ 笑咪咪，亮晶晶！':'一起刷刷刷！'}</span>
      {brush&&<div className="moving-toothbrush" style={{left:brush.x,top:brush.y}} aria-hidden="true"><span/>━━</div>}
    </div>
    <div className="brushing-progress" role="progressbar" aria-label="刷牙進度" aria-valuenow={cleaned} aria-valuemin={0} aria-valuemax={12}><span style={{width:`${cleaned/12*100}%`}}/></div>
    <p className="game-message" role="status">{cleaned===12?'全部刷乾淨了！怪獸露出亮亮的笑容！':`已刷乾淨 ${cleaned} / 12 顆牙齒，慢慢刷就好。`}</p>
    <button className="primary-button" onClick={()=>{setClean(Array(12).fill(0));setFriend(value=>(value+1)%friends.length);drag.current=false;last.current=null;setBrush(null);sound.effect('change')}}>換一位怪獸刷牙</button>
  </>
}

const hairNames=['左邊頭髮','中間頭髮','右邊頭髮']
const styles=['蓬鬆頭','旁分頭','沖天頭']
export function MonsterDryer() {
  const [dry,setDry]=useState([0,0,0]),[style,setStyle]=useState(0),[power,setPower]=useState(1),[blowing,setBlowing]=useState<number|null>(null),[friend,setFriend]=useState(0)
  const hold=useRef(false),last=useRef<{x:number;y:number;index:number}|null>(null),skipClick=useRef(false),scene=useRef<HTMLDivElement>(null)
  const finished=dry.every(value=>value===4)
  const blow=(index:number)=>{setDry(previous=>previous.map((value,i)=>i===index?Math.min(4,value+power):value));setBlowing(index)}
  const move=(event:PointerEvent<HTMLDivElement>)=>{
    if(!hold.current)return
    scene.current?.querySelectorAll<HTMLButtonElement>('.hair-lock').forEach((lock,index)=>{const r=lock.getBoundingClientRect();if(event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom){const p=last.current;if(!p||p.index!==index||Math.hypot(p.x-event.clientX,p.y-event.clientY)>12){blow(index);last.current={x:event.clientX,y:event.clientY,index};skipClick.current=true}}})
  }
  return <><p className="instruction">拿吹風機幫怪獸吹頭髮！來回移動，或點每一束頭髮。</p>
    <div className="care-controls"><button aria-pressed={power===1} onClick={()=>setPower(1)}>微風吹吹</button><button aria-pressed={power===2} onClick={()=>setPower(2)}>大風吹吹</button></div>
    <div ref={scene} className={`care-scene dryer-scene hair-style-${style}`} style={{'--friend-color':friends[friend].color} as CSSProperties} onPointerDown={event=>{hold.current=true;last.current=null;skipClick.current=false;event.currentTarget.setPointerCapture(event.pointerId);move(event)}} onPointerMove={move} onPointerUp={()=>{hold.current=false;setBlowing(null)}} onPointerCancel={()=>{hold.current=false;setBlowing(null)}} onLostPointerCapture={()=>{hold.current=false;setBlowing(null)}}>
      <div className="hair-row">{hairNames.map((name,index)=><button key={name} aria-label={`吹乾${name}`} className={`hair-lock ${dry[index]===4?'hair-dry':''} ${blowing===index?'hair-blowing':''}`} onClick={event=>{if(skipClick.current&&event.detail!==0){skipClick.current=false;return}blow(index)}}><span className="hair-strands" aria-hidden="true">〰<br/>〰<br/>〰</span><span className="hair-drops" style={{opacity:1-dry[index]/4}} aria-hidden="true">💧</span><small>{dry[index]===4?'✨ 乾了':`${dry[index]} / 4`}</small></button>)}</div>
      <div className="dryer-face" aria-hidden="true"><span>◕　◕</span><strong>◡</strong></div>
      <div className={`hairdryer ${blowing!==null?'dryer-on':''}`} aria-hidden="true"><span className="dryer-nozzle"/><span className="dryer-body">✦</span><span className="dryer-handle"/><span className="dryer-air">〰 〰</span></div>
      <div className="dryer-caption">{finished?'蓬蓬鬆鬆，謝謝你！':'柔柔的風，好舒服！'}</div>
    </div>
    <div className="care-controls" aria-label="頭髮造型">{styles.map((name,index)=><button key={name} aria-pressed={style===index} onClick={()=>setStyle(index)}>{name}</button>)}</div>
    <p className="game-message" role="status">{finished?'頭髮全部吹乾了！選個喜歡的造型吧！':`吹乾 ${dry.filter(value=>value===4).length} / 3 束頭髮，濕濕的水滴會慢慢消失。`}</p>
    <button className="primary-button" onClick={()=>{setDry([0,0,0]);setFriend(value=>(value+1)%friends.length);setBlowing(null);last.current=null;hold.current=false;sound.effect('change')}}>換一位怪獸吹頭髮</button>
  </>
}
