import {useEffect,useState} from 'react'
import {DiscoIcon,BubbleIcon} from './components/PlayIcons'
import Skeleton from './components/Skeleton'
import {games,readOutfit,saveOutfit} from './services/play'
import type {GameId} from './services/play'
import {sound} from './services/sound'
import {Dance,Bowling,Bubbles,Dressup,Fireworks} from './games/Games'
export default function App(){
  const [game,setGame]=useState<GameId|null>(null),[outfit,setOutfit]=useState(readOutfit),[muted,setMuted]=useState(sound.muted)
  useEffect(()=>saveOutfit(outfit),[outfit])
  useEffect(()=>{sound.stop();window.scrollTo(0,0);return ()=>sound.stop()},[game])
  const current=games.find(g=>g.id===game)
  return <div className="app"><header className="topbar"><button className="brand" aria-label="回遊樂場" onClick={()=>setGame(null)}><span>🦴</span><span>骨頭人遊樂場<small>NICKSON'S SPOOKY PLAYGROUND</small></span></button><button className="sound-button" aria-label={muted?'開啟音效':'靜音'} onClick={()=>{sound.mute(!muted);setMuted(!muted)}}>{muted?'🔇':'🔊'}</button></header>{!game?<main className="home"><section className="hero"><div className="hero-copy"><p className="eyebrow">BOO! LET'S PLAY</p><h1>Nickson，<br/>今天來搗蛋吧！</h1><p>骨頭人、小幽靈和南瓜都到齊了。<br/>沒有考題，只有好多好多好玩的！</p><button className="primary-button" aria-label="直接開始跳舞" onClick={()=>{sound.unlock();setGame('dance')}}>♫ 跟骨頭人跳舞</button><div className="hero-confetti" aria-hidden="true">🍬　✦　👻　✦　🎃</div></div><div className="hero-character"><span className="hero-moon" aria-hidden="true">☾</span><Skeleton outfit={outfit} pose="wiggle"/><span className="character-label">你的搗蛋好朋友</span></div></section><section className="game-section"><div className="section-heading"><h2>想玩哪一個？</h2><span>點一下，就出發！ ↗</span></div><div className="game-grid">{games.map((g,i)=><button className={`game-tile ${g.color}`} key={g.id} onClick={()=>{sound.unlock();setGame(g.id)}}><span className="tile-number">0{i+1}</span><span className="tile-art">{g.id==='dance'?<DiscoIcon/>:g.id==='bubbles'?<BubbleIcon/>:g.emoji}</span><strong>{g.title}</strong><small>{g.description}</small><span className="tile-arrow" aria-hidden="true">↗</span></button>)}</div></section><p className="parent-note">👨‍👩‍👦 一起扭扭、笑笑，想休息隨時回來。第一次開啟需要網路，載入完成後也能離線玩。</p></main>:<main className={`game game-${game}`}><div className="game-heading"><button className="back-button" onClick={()=>setGame(null)}>← 回遊樂場</button><h1>{current?.emoji} {current?.title}</h1><span className="free-play">隨你玩，慢慢來 ✦</span></div>{game==='dance'&&<Dance outfit={outfit}/>} {game==='bowling'&&<Bowling/>}{game==='bubbles'&&<Bubbles/>}{game==='dressup'&&<Dressup outfit={outfit} onChange={setOutfit}/>} {game==='fireworks'&&<Fireworks outfit={outfit}/>}</main>}<footer>MADE FOR LITTLE MONSTERS　·　給 Nickson 的萬聖節小天地 🦴</footer></div>
}
