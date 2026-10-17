export type GameId='ghost-maze'|'pumpkin-pop'|'skeleton-rocket'|'fishing'|'candy-catch'|'pinball'|'monster-stack'|'ghost-race'|'skeleton-shooter'|'dance'|'bowling'|'bubbles'|'dressup'|'fireworks'|'drums'|'trampoline'|'candy-monster'|'hide-ghost'|'ice-cream-shop'|'car-wash'|'pumpkin-train'|'monster-market'|'puzzle'|'pumpkin-adventure'|'skeleton-construction'|'monster-rhythm'|'monster-pet-house'|'monster-art'|'monster-hospital'|'ghost-post'
export type GameDifficulty = '輕鬆' | '適中' | '挑戰'
export type GameInfo = {id:GameId;title:string;emoji:string;description:string;color:string;difficulty:GameDifficulty;minAge:number;guidance?:string}
export const games:GameInfo[]=[
  {id:'ghost-maze',title:'幽靈迷宮',emoji:'🏰',description:'帶小幽靈找城堡，順路撿糖果！',color:'lilac',difficulty:'適中',minAge:4},
  {id:'pumpkin-pop',title:'敲敲南瓜',emoji:'🎃',description:'南瓜探出頭，啵！變出糖果！',color:'peach',difficulty:'適中',minAge:3},
  {id:'skeleton-rocket',title:'骨頭人搭火箭',emoji:'🚀',description:'選一顆星球，飛向太空收星星！',color:'mint',difficulty:'輕鬆',minAge:3},
  {id:'fishing',title:'骨頭人釣魚',emoji:'🎣',description:'甩竿拉一拉，魚朋友來集合！',color:'mint',difficulty:'輕鬆',minAge:3},
  {id:'candy-catch',title:'幽靈接糖果',emoji:'🧺',description:'左右移動，接住甜甜糖果雨！',color:'pink',difficulty:'挑戰',minAge:4},
  {id:'pinball',title:'南瓜彈珠台',emoji:'⭐',description:'彈板拍一拍，南瓜撞星星！',color:'yellow',difficulty:'挑戰',minAge:4},
  {id:'monster-stack',title:'怪獸疊疊樂',emoji:'👾',description:'疊高高，蓋一座怪獸小塔！',color:'lilac',difficulty:'輕鬆',minAge:3},
  {id:'ghost-race',title:'幽靈賽車',emoji:'🏎️',description:'小幽靈開車，左右閃過骨頭人！',color:'mint',difficulty:'挑戰',minAge:4},
  {id:'skeleton-shooter',title:'骨頭人射擊',emoji:'🍭',description:'發射魔法糖果，打中南瓜靶！',color:'peach',difficulty:'適中',minAge:3},
  {id:'drums',title:'骨頭人打鼓',emoji:'♫',description:'咚咚啪啪，自己開一場演奏會！',color:'peach',difficulty:'輕鬆',minAge:2},
  {id:'trampoline',title:'南瓜彈跳床',emoji:'🎃',description:'咻——骨頭人跳得好高！',color:'mint',difficulty:'輕鬆',minAge:2},
  {id:'candy-monster',title:'小怪獸餵糖果',emoji:'🍭',description:'三種點心，小怪獸都愛吃！',color:'pink',difficulty:'輕鬆',minAge:2},
  {id:'hide-ghost',title:'幽靈躲貓貓',emoji:'👻',description:'掀開小房子，小幽靈在哪裡？',color:'yellow',difficulty:'輕鬆',minAge:2},
  {id:'dance',title:'骨頭人跳舞',emoji:'♫',description:'扭一扭，跟著節拍動起來！',color:'lilac',difficulty:'輕鬆',minAge:2},
  {id:'bowling',title:'南瓜保齡球',emoji:'🎃',description:'南瓜滾過去，骨頭人倒一片！',color:'peach',difficulty:'適中',minAge:3},
  {id:'bubbles',title:'幽靈泡泡',emoji:'👻',description:'啵！啵！讓幽靈出來玩！',color:'mint',difficulty:'輕鬆',minAge:2},
  {id:'dressup',title:'骨頭人變裝',emoji:'🎩',description:'帽子、眼鏡，今天怎麼穿？',color:'pink',difficulty:'輕鬆',minAge:3},
  {id:'fireworks',title:'糖果煙火',emoji:'🍬',description:'點點天空，放出甜甜的煙火！',color:'yellow',difficulty:'輕鬆',minAge:2},
  {id:'ice-cream-shop',title:'怪獸冰淇淋店',emoji:'🍦',description:'照著訂單疊口味，也能自由創作！',color:'pink',difficulty:'適中',minAge:4,guidance:'自由創作較輕鬆；訂單會逐步增加內容。'},
  {id:'car-wash',title:'骨頭人洗車場',emoji:'🚗',description:'沖水、擦泡泡，再把汽車改裝漂亮！',color:'mint',difficulty:'適中',minAge:3},
  {id:'pumpkin-train',title:'南瓜小火車',emoji:'🚂',description:'接怪獸上車，選路線前往五座車站！',color:'peach',difficulty:'適中',minAge:4},
  {id:'monster-market',title:'怪獸小超市',emoji:'🛒',description:'照圖片找商品，推著購物車去結帳！',color:'yellow',difficulty:'適中',minAge:4,guidance:'自由購物較輕鬆；購物清單會逐步增加數量。'},
  {id:'puzzle',title:'南瓜拼圖王',emoji:'🧩',description:'六張圖片、五種難度，拖曳或點選拼圖！',color:'lilac',difficulty:'適中',minAge:3,guidance:'建議從 2 × 2 開始；6 × 6、9 × 9 適合熟悉拼圖後親子挑戰。'},
  {id:'pumpkin-adventure',title:'南瓜橫向大冒險',emoji:'🎃',description:'跳過木頭、蹲過蝙蝠，前往糖果城堡！',color:'peach',difficulty:'挑戰',minAge:4},
  {id:'skeleton-construction',title:'骨頭人工地',emoji:'🧱',description:'照藍圖蓋房子，也能自由堆積木！',color:'mint',difficulty:'適中',minAge:4,guidance:'可先自由堆積木，再嘗試依藍圖搭建。'},
  {id:'monster-rhythm',title:'怪獸節奏派對',emoji:'🎵',description:'跟著怪獸記節奏，也能自由演奏！',color:'pink',difficulty:'挑戰',minAge:5,guidance:'自由演奏較輕鬆；跟奏需要記住節奏順序。'},
  {id:'monster-pet-house',title:'怪獸寵物屋',emoji:'🐾',description:'餵食、洗澡、換裝，陪寵物開心玩！',color:'yellow',difficulty:'輕鬆',minAge:3},
  {id:'monster-art',title:'怪獸塗鴉屋',emoji:'🎨',description:'畫一畫、蓋印章，替怪獸塗顏色！',color:'pink',difficulty:'輕鬆',minAge:2},
  {id:'monster-hospital',title:'怪獸小醫院',emoji:'🩺',description:'量體溫、貼貼布，陪朋友好好休息！',color:'mint',difficulty:'輕鬆',minAge:3},
  {id:'ghost-post',title:'幽靈郵差',emoji:'📮',description:'看看包裹圖案，送到一樣的家！',color:'yellow',difficulty:'適中',minAge:3},
]
export type Outfit={hat:'none'|'witch'|'party'|'pirate';glasses:boolean;color:string}
export const defaultOutfit:Outfit={hat:'party',glasses:false,color:'#fff5d5'}
const KEY='nickson-skeleton-playground-v1'
export function readOutfit():Outfit{try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');if(raw&&['none','witch','party','pirate'].includes(raw.hat)&&typeof raw.glasses==='boolean'&&/^#[a-f\d]{6}$/i.test(raw.color))return raw}catch{}return {...defaultOutfit}}
export function saveOutfit(outfit:Outfit){try{localStorage.setItem(KEY,JSON.stringify(outfit))}catch{}}
export function bowlingPins(lane:number){return Array.from({length:6},(_,i)=>Math.abs([.36,.5,.64,.3,.5,.7][i]-lane)<.28)}
export function clampLane(x:number){return Math.min(.8,Math.max(.2,x))}
