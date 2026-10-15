export const iceCreamFlavors = [
  {id: 'strawberry', name: '草莓', color: '#ff9abd'},
  {id: 'banana', name: '香蕉', color: '#ffe36e'},
  {id: 'chocolate', name: '巧克力', color: '#9a654d'},
  {id: 'mint', name: '薄荷', color: '#9ee5bf'},
  {id: 'grape', name: '葡萄', color: '#b89ae8'},
  {id: 'vanilla', name: '香草', color: '#fff4d7'},
] as const

export const iceCreamToppings = [
  {id: 'sprinkles', name: '彩色糖粒', emoji: '🌈'},
  {id: 'cherry', name: '櫻桃', emoji: '🍒'},
  {id: 'chocolate-sauce', name: '巧克力醬', emoji: '🍫'},
  {id: 'star-cookie', name: '星星餅乾', emoji: '⭐'},
] as const

export type IceCreamFlavor = typeof iceCreamFlavors[number]['id']
export type IceCreamTopping = typeof iceCreamToppings[number]['id']
export type IceCreamOrder = {scoops: IceCreamFlavor[]; topping: IceCreamTopping | null}

export function buildIceCreamOrder(level: 1 | 2 | 3 | 4, seed: number): IceCreamOrder {
  const flavorCount = [0, 3, 4, 6, 6][level]
  const scoopCount = Math.min(level, 3)
  return {
    scoops: Array.from({length: scoopCount}, (_, index) => iceCreamFlavors[(seed + index) % flavorCount].id),
    topping: level === 4 ? iceCreamToppings[seed % iceCreamToppings.length].id : null,
  }
}

export function isIceCreamOrderComplete(
  scoops: readonly IceCreamFlavor[],
  topping: IceCreamTopping | null,
  order: IceCreamOrder,
) {
  return scoops.length === order.scoops.length
    && scoops.every((scoop, index) => scoop === order.scoops[index])
    && topping === order.topping
}

export type WashStage = 'water' | 'soap' | 'rinse' | 'dry' | 'customize'
const washStages: WashStage[] = ['water', 'soap', 'rinse', 'dry', 'customize']

export function advanceWash(stage: WashStage, progress: number, amount: number) {
  if (stage === 'customize') return {stage, progress: 100}
  const nextProgress = Math.min(100, progress + amount)
  if (nextProgress < 100) return {stage, progress: nextProgress}
  const nextStage = washStages[washStages.indexOf(stage) + 1]
  return {stage: nextStage, progress: nextStage === 'customize' ? 100 : 0}
}

export function nextTrainStation(current: number, direction: 'left' | 'right') {
  return (current + (direction === 'left' ? 1 : 2)) % 5
}

export const supermarketProducts = [
  {id: 'apple', name: '蘋果', emoji: '🍎', section: '水果'},
  {id: 'banana', name: '香蕉', emoji: '🍌', section: '水果'},
  {id: 'grape', name: '葡萄', emoji: '🍇', section: '水果'},
  {id: 'strawberry', name: '草莓', emoji: '🍓', section: '水果'},
  {id: 'milk', name: '牛奶', emoji: '🥛', section: '飲料'},
  {id: 'juice', name: '果汁', emoji: '🧃', section: '飲料'},
  {id: 'water', name: '水', emoji: '💧', section: '飲料'},
  {id: 'bread', name: '麵包', emoji: '🍞', section: '點心'},
  {id: 'cookie', name: '餅乾', emoji: '🍪', section: '點心'},
  {id: 'donut', name: '甜甜圈', emoji: '🍩', section: '點心'},
  {id: 'candy', name: '糖果', emoji: '🍬', section: '點心'},
  {id: 'toy-car', name: '小汽車', emoji: '🚗', section: '玩具'},
  {id: 'toy-train', name: '玩具火車', emoji: '🚂', section: '玩具'},
  {id: 'teddy', name: '玩具熊', emoji: '🧸', section: '玩具'},
] as const

export type ProductId = typeof supermarketProducts[number]['id']
export type ShoppingListItem = {id: ProductId; quantity: number}

export function buildShoppingList(level: 1 | 2 | 3 | 4, seed: number): ShoppingListItem[] {
  let state = (seed + 1) >>> 0
  const pool = supermarketProducts.map(product => product.id)
  return Array.from({length: level}, (_, index) => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    const [id] = pool.splice(state % pool.length, 1)
    return {id, quantity: level === 4 && index === 0 ? 2 : 1}
  })
}

export function isShoppingListComplete(cart: Partial<Record<ProductId, number>>, list: readonly ShoppingListItem[]) {
  return list.every(item => (cart[item.id] ?? 0) >= item.quantity)
}
