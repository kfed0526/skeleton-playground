import {useEffect, useState} from 'react'
import Announcement from './components/Announcement'
import ParentAdmin from './components/ParentAdmin'
import {BubbleIcon, DiscoIcon} from './components/PlayIcons'
import Skeleton from './components/Skeleton'
import {MonsterArt, MonsterHospital, GhostPost} from './games/CreativeGames'
import {GhostRace, SkeletonShooter} from './games/ActionGames'
import {GhostMaze, PumpkinPop, SkeletonRocket} from './games/AdventureGames'
import {Bowling, Bubbles, Dance, Dressup, Fireworks} from './games/Games'
import {CandyMonster, Drums, HideGhost, Trampoline} from './games/MoreGames'
import {CandyCatch, Fishing, MonsterStack, PumpkinPinball} from './games/PartyGames'
import PuzzleGame from './games/PuzzleGame'
import {CarWash, IceCreamShop, MonsterSupermarket, PumpkinTrain} from './games/V3Games'
import {MonsterPetHouse, MonsterRhythmParty, PumpkinAdventure, SkeletonConstruction} from './games/V4Games'
import {latestAnnouncement} from './services/announcements'
import {readEnabledGameIds, saveEnabledGameIds} from './services/parentSettings'
import {games, readOutfit, saveOutfit} from './services/play'
import type {GameId} from './services/play'
import {sound} from './services/sound'

export default function App() {
  const [game, setGame] = useState<GameId | null>(null)
  const [outfit, setOutfit] = useState(readOutfit)
  const [muted, setMuted] = useState(sound.muted)
  const [enabledGameIds, setEnabledGameIds] = useState(readEnabledGameIds)

  useEffect(() => saveOutfit(outfit), [outfit])
  useEffect(() => {
    sound.stop()
    window.scrollTo(0, 0)
    return () => sound.stop()
  }, [game])

  const current = games.find(item => item.id === game)
  const visibleGames = games.filter(item => enabledGameIds.includes(item.id))
  const featuredGame = visibleGames.find(item => item.id === 'dance') ?? visibleGames[0]
  const updateGameLibrary = (gameIds: GameId[]) => {
    const saved = saveEnabledGameIds(gameIds)
    setEnabledGameIds(saved)
    if (game && !saved.includes(game)) setGame(null)
  }
  const openGame = (gameId: GameId) => {
    sound.unlock()
    setGame(gameId)
  }

  return <div className="app">
    <header className="topbar">
      <button className="brand" aria-label="回遊樂場" onClick={() => setGame(null)}>
        <span>🦴</span><span>骨頭人遊樂場<small>NICKSON'S SPOOKY PLAYGROUND</small></span>
      </button>
      <button className="sound-button" aria-label={muted ? '開啟音效' : '靜音'} onClick={() => {sound.mute(!muted); setMuted(!muted)}}>{muted ? '🔇' : '🔊'}</button>
    </header>

    {!game ? <main className="home">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">BOO! LET'S PLAY</p>
          <h1>Nickson，<br/>今天來搗蛋吧！</h1>
          <p>骨頭人、小幽靈和南瓜都到齊了。<br/>沒有考題，只有好多好多好玩的！</p>
          {featuredGame && <button className="primary-button" aria-label="直接開始主打遊戲" onClick={() => openGame(featuredGame.id)}>{featuredGame.emoji} 開始玩{featuredGame.title}</button>}
          <div className="hero-confetti" aria-hidden="true">🍬　✦　👻　✦　🎃</div>
        </div>
        <div className="hero-character"><span className="hero-moon" aria-hidden="true">☾</span><Skeleton outfit={outfit} pose="wiggle"/><span className="character-label">你的搗蛋好朋友</span></div>
      </section>
      <Announcement announcement={latestAnnouncement}/>
      <section className="game-section">
        <div className="section-heading"><h2>想玩哪一個？</h2><span>點一下，就出發！ ↗</span></div>
        {visibleGames.length ? <div className="game-grid">{visibleGames.map((item, index) => <button className={`game-tile ${item.color}`} key={item.id} onClick={() => openGame(item.id)}>
          <span className="tile-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="tile-art">{item.id === 'dance' ? <DiscoIcon/> : item.id === 'bubbles' ? <BubbleIcon/> : item.emoji}</span>
          <strong>{item.title}</strong><small>{item.description}</small><span className="tile-arrow" aria-hidden="true">↗</span>
        </button>)}</div> : <p className="empty-game-library">目前沒有開放的遊戲，請由家長管理選擇遊戲。</p>}
      </section>
      <p className="parent-note">👨‍👩‍👦 一起扭扭、笑笑，想休息隨時回來。第一次開啟需要網路，載入完成後也能離線玩。</p>
    </main> : <main className={`game game-${game}`}>
      <div className="game-heading"><button className="back-button" onClick={() => setGame(null)}>← 回遊樂場</button><h1>{current?.emoji} {current?.title}</h1><span className="free-play">隨你玩，慢慢來 ✦</span></div>
      {game === 'monster-art' && <MonsterArt/>}
      {game === 'monster-hospital' && <MonsterHospital/>}
      {game === 'ghost-post' && <GhostPost/>}
      {game === 'ghost-maze' && <GhostMaze/>}
      {game === 'pumpkin-pop' && <PumpkinPop/>}
      {game === 'skeleton-rocket' && <SkeletonRocket outfit={outfit}/>}
      {game === 'fishing' && <Fishing outfit={outfit}/>}
      {game === 'candy-catch' && <CandyCatch/>}
      {game === 'pinball' && <PumpkinPinball/>}
      {game === 'monster-stack' && <MonsterStack/>}
      {game === 'ghost-race' && <GhostRace outfit={outfit}/>}
      {game === 'skeleton-shooter' && <SkeletonShooter outfit={outfit}/>}
      {game === 'drums' && <Drums outfit={outfit}/>}
      {game === 'trampoline' && <Trampoline outfit={outfit}/>}
      {game === 'candy-monster' && <CandyMonster/>}
      {game === 'hide-ghost' && <HideGhost/>}
      {game === 'dance' && <Dance outfit={outfit}/>}
      {game === 'bowling' && <Bowling/>}
      {game === 'bubbles' && <Bubbles/>}
      {game === 'dressup' && <Dressup outfit={outfit} onChange={setOutfit}/>}
      {game === 'fireworks' && <Fireworks outfit={outfit}/>}
      {game === 'ice-cream-shop' && <IceCreamShop/>}
      {game === 'car-wash' && <CarWash/>}
      {game === 'pumpkin-train' && <PumpkinTrain/>}
      {game === 'monster-market' && <MonsterSupermarket/>}
      {game === 'puzzle' && <PuzzleGame/>}
      {game === 'pumpkin-adventure' && <PumpkinAdventure/>}
      {game === 'skeleton-construction' && <SkeletonConstruction outfit={outfit}/>}
      {game === 'monster-rhythm' && <MonsterRhythmParty outfit={outfit}/>}
      {game === 'monster-pet-house' && <MonsterPetHouse/>}
    </main>}

    <ParentAdmin enabledGameIds={enabledGameIds} onSave={updateGameLibrary}/>
    <footer>MADE FOR LITTLE MONSTERS　·　給 Nickson 的萬聖節小天地 🦴</footer>
  </div>
}
