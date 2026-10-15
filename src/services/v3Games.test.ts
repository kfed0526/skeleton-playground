import {expect, it} from 'vitest'
import {advanceWash, buildIceCreamOrder, buildShoppingList, isIceCreamOrderComplete, isShoppingListComplete, nextTrainStation} from './v3Games'

it('builds progressively larger ice cream orders and checks them without punishing mistakes', () => {
  expect(buildIceCreamOrder(1, 0)).toEqual({scoops: ['strawberry'], topping: null})
  expect(buildIceCreamOrder(4, 1)).toEqual({scoops: ['banana', 'chocolate', 'mint'], topping: 'cherry'})
  expect(isIceCreamOrderComplete(['banana', 'chocolate', 'mint'], 'cherry', buildIceCreamOrder(4, 1))).toBe(true)
  expect(isIceCreamOrderComplete(['banana'], null, buildIceCreamOrder(4, 1))).toBe(false)
})

it('builds supermarket lists with quantities and recognizes a complete cart', () => {
  const easy = buildShoppingList(1, 0)
  const hard = buildShoppingList(4, 0)
  expect(easy).toHaveLength(1)
  expect(hard).toHaveLength(4)
  expect(new Set(hard.map(item => item.id)).size).toBe(4)
  expect(hard[0].quantity).toBe(2)
  expect(buildShoppingList(4, 0)).toEqual(hard)
  expect(buildShoppingList(4, 1)).not.toEqual(hard)
  const completeCart = Object.fromEntries(hard.map(item => [item.id, item.quantity]))
  expect(isShoppingListComplete(completeCart, hard)).toBe(true)
  expect(isShoppingListComplete({[easy[0].id]: 1}, easy)).toBe(true)
  expect(isShoppingListComplete({}, easy)).toBe(false)
})

it('routes the train around all five safe stations without leaving the track', () => {
  expect(nextTrainStation(0, 'left')).toBe(1)
  expect(nextTrainStation(1, 'right')).toBe(3)
  expect(nextTrainStation(4, 'left')).toBe(0)
  expect(nextTrainStation(4, 'right')).toBe(1)
})

it('advances through every wash stage when enough of the car is cleaned', () => {
  expect(advanceWash('water', 70, 20)).toEqual({stage: 'water', progress: 90})
  expect(advanceWash('water', 90, 20)).toEqual({stage: 'soap', progress: 0})
  expect(advanceWash('soap', 95, 10)).toEqual({stage: 'rinse', progress: 0})
  expect(advanceWash('rinse', 95, 10)).toEqual({stage: 'dry', progress: 0})
  expect(advanceWash('dry', 95, 10)).toEqual({stage: 'customize', progress: 100})
})
