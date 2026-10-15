import {expect, test} from '@playwright/test'

test('parent can hide a game and the saved library survives reload', async ({page}) => {
  await page.goto('./')
  await expect(page.locator('.game-tile')).toHaveCount(23)

  await page.getByRole('button', {name: '家長管理'}).click()
  await expect(page.getByRole('dialog', {name: '家長管理'})).toBeVisible()
  await expect(page.getByLabel('六位數密碼')).toBeFocused()
  await page.getByLabel('六位數密碼').fill('123456')
  await page.getByRole('button', {name: '進入管理'}).click()
  await expect(page.getByRole('alert')).toHaveText('密碼不正確，請再試一次。')

  await page.getByLabel('六位數密碼').fill('666666')
  await page.getByRole('button', {name: '進入管理'}).click()
  await expect(page.getByRole('checkbox').first()).toBeFocused()
  await page.getByRole('button', {name: '關閉家長管理'}).focus()
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('button', {name: '儲存遊戲庫'})).toBeFocused()
  await page.getByRole('checkbox', {name: /骨頭人跳舞/}).uncheck()
  await page.getByRole('button', {name: '儲存遊戲庫'}).click()

  await expect(page.getByRole('button', {name: '家長管理'})).toBeFocused()
  await expect(page.locator('.game-tile')).toHaveCount(22)
  await expect(page.getByRole('button', {name: /跳舞/})).toHaveCount(0)

  await page.reload()
  await expect(page.locator('.game-tile')).toHaveCount(22)
  await expect(page.getByRole('button', {name: /跳舞/})).toHaveCount(0)
})
