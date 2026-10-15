import {expect, test} from '@playwright/test'

test('puzzle offers six pictures, five difficulties and click or drag placement', async ({page}) => {
  await page.goto('./')
  await page.getByRole('button', {name: /南瓜拼圖王/}).click()

  await expect(page.getByRole('button', {name: /^選擇拼圖：/})).toHaveCount(6)
  await expect(page.getByRole('button', {name: '2 × 2'})).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', {name: /^拼圖片/})).toHaveCount(4)

  for (let piece = 1; piece <= 4; piece += 1) {
    await page.getByRole('button', {name: `拼圖片 ${piece}`}).click()
    await page.getByRole('button', {name: `拼圖位置 ${piece}`}).click()
  }
  await expect(page.getByRole('alert')).toContainText('拼好了')
  await page.getByRole('button', {name: '下一張圖片'}).click()

  await page.getByRole('button', {name: '3 × 3'}).click()
  const pieceOne = page.getByRole('button', {name: '拼圖片 1'})
  const slotOne = page.getByRole('button', {name: '拼圖位置 1'})
  const from = await pieceOne.boundingBox()
  const to = await slotOne.boundingBox()
  await page.mouse.move(from!.x + from!.width / 2, from!.y + from!.height / 2)
  await page.mouse.down()
  await page.mouse.move(to!.x + to!.width / 2, to!.y + to!.height / 2, {steps: 8})
  await page.mouse.up()
  await expect(slotOne).toHaveAttribute('data-filled', 'true')
  await page.getByRole('button', {name: '拼圖片 2'}).click()
  const slotTwo = page.getByRole('button', {name: '拼圖位置 2'})
  await slotTwo.click()
  await expect(slotTwo).toHaveAttribute('data-filled', 'true')

  await page.getByRole('button', {name: '4 × 4'}).click()
  await expect(page.getByRole('button', {name: /^拼圖片/})).toHaveCount(16)
  await page.getByRole('button', {name: '6 × 6'}).click()
  await expect(page.getByRole('button', {name: /^拼圖片/})).toHaveCount(36)
  await page.getByRole('button', {name: '9 × 9'}).click()
  await expect(page.getByRole('button', {name: /^拼圖片/})).toHaveCount(81)

  await page.setViewportSize({width: 390, height: 844})
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({path: 'test-results/puzzle-v3-mobile.png', fullPage: true, animations: 'disabled'})
})
