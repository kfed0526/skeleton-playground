export type GameId='dance'|'bowling'|'bubbles'|'dressup'|'fireworks'
export const games:{id:GameId;title:string;emoji:string;description:string;color:string}[]=[
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
