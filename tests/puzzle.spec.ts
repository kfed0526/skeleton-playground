import {expect, test} from '@playwright/test'

test('puzzle switches between 3x3, 6x6 and 9x9 and swaps chosen pieces', async ({page}) => {
  await page.goto('./')
  await page.getByRole('button', {name: /萬聖拼圖/}).click()

  await expect(page.getByRole('button', {name: '3 × 3'})).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', {name: /^拼圖片/})).toHaveCount(9)

  await page.getByRole('button', {name: '6 × 6'}).click()
  await expect(page.getByRole('button', {name: /^拼圖片/})).toHaveCount(36)
  const pieces = page.getByRole('button', {name: /^拼圖片/})
  await pieces.nth(0).click()
  await expect(pieces.nth(0)).toHaveAttribute('aria-pressed', 'true')
  await pieces.nth(1).click()
  await expect(page.getByRole('status')).toContainText('已移動 1 次')

  await page.getByRole('button', {name: '9 × 9'}).click()
  await expect(page.getByRole('button', {name: /^拼圖片/})).toHaveCount(81)
  await page.getByRole('button', {name: '重新洗牌'}).click()
  await expect(page.getByRole('status')).toContainText('已移動 0 次')
  await page.setViewportSize({width: 390, height: 844})
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({path: 'test-results/puzzle-mobile.png', fullPage: true, animations: 'disabled'})
})
