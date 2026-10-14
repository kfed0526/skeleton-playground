export type GameId='ghost-maze'|'pumpkin-pop'|'skeleton-rocket'|'fishing'|'candy-catch'|'pinball'|'monster-stack'|'ghost-race'|'skeleton-shooter'|'dance'|'bowling'|'bubbles'|'dressup'|'fireworks'|'drums'|'trampoline'|'candy-monster'|'hide-ghost'
export const games:{id:GameId;title:string;emoji:string;description:string;color:string}[]=[
  {id:'ghost-maze',title:'幽靈迷宮',emoji:'🏰',description:'帶小幽靈找城堡，順路撿糖果！',color:'lilac'},
  {id:'pumpkin-pop',title:'敲敲南瓜',emoji:'🎃',description:'南瓜探出頭，啵！變出糖果！',color:'peach'},
  {id:'skeleton-rocket',title:'骨頭人搭火箭',emoji:'🚀',description:'選一顆星球，飛向太空收星星！',color:'mint'},
  {id:'fishing',title:'骨頭人釣魚',emoji:'🎣',description:'甩竿拉一拉，魚朋友來集合！',color:'mint'},
  {id:'candy-catch',title:'幽靈接糖果',emoji:'🧺',description:'左右移動，接住甜甜糖果雨！',color:'pink'},
  {id:'pinball',title:'南瓜彈珠台',emoji:'⭐',description:'彈板拍一拍，南瓜撞星星！',color:'yellow'},
  {id:'monster-stack',title:'怪獸疊疊樂',emoji:'👾',description:'疊高高，蓋一座怪獸小塔！',color:'lilac'},
  {id:'ghost-race',title:'幽靈賽車',emoji:'🏎️',description:'小幽靈開車，左右閃過骨頭人！',color:'mint'},
  {id:'skeleton-shooter',title:'骨頭人射擊',emoji:'🍭',description:'發射魔法糖果，打中南瓜靶！',color:'peach'},
  {id:'drums',title:'骨頭人打鼓',emoji:'♫',description:'咚咚啪啪，自己開一場演奏會！',color:'peach'},
  {id:'trampoline',title:'南瓜彈跳床',emoji:'🎃',description:'咻——骨頭人跳得好高！',color:'mint'},
  {id:'candy-monster',title:'小怪獸餵糖果',emoji:'🍭',description:'三種點心，小怪獸都愛吃！',color:'pink'},
  {id:'hide-ghost',title:'幽靈躲貓貓',emoji:'👻',description:'掀開小房子，小幽靈在哪裡？',color:'yellow'},
  {id:'dance',title:'骨頭人跳舞',emoji:'♫',description:'扭一扭，跟著節拍動起來！',color:'lilac'},
  {id:'bowling',title:'南瓜保齡球',emoji:'🎃',description:'南瓜滾過去，骨頭人倒一片！',color:'peach'},
  {id:'bubbles',title:'幽靈泡泡',emoji:'👻',description:'啵！啵！讓幽靈出來玩！',color:'mint'},
  {id:'dressup',title:'骨頭人變裝',emoji:'🎩',description:'帽子、眼鏡，今天怎麼穿？',color:'pink'},
  {id:'fireworks',title:'糖果煙火',emoji:'🍬',description:'點點天空，放出甜甜的煙火！',color:'yellow'},
]
export type Outfit={hat:'none'|'witch'|'party'|'pirate';glasses:boolean;color:string}
export const defaultOutfit:Outfit={hat:'party',glasses:false,color:'#fff5d5'}
const KEY='nickson-skeleton-playground-v1'
export function readOutfit():Outfit{try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');if(raw&&['none','witch','party','pirate'].includes(raw.hat)&&typeof raw.glasses==='boolean'&&/^#[a-f\d]{6}$/i.test(raw.color))return raw}catch{}return {...defaultOutfit}}
export function saveOutfit(outfit:Outfit){try{localStorage.setItem(KEY,JSON.stringify(outfit))}catch{}}
export function bowlingPins(lane:number){return Array.from({length:6},(_,i)=>Math.abs([.36,.5,.64,.3,.5,.7][i]-lane)<.28)}
export function clampLane(x:number){return Math.min(.8,Math.max(.2,x))}
