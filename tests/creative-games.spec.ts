import {expect, test} from '@playwright/test'

test('art supports drawing, undo, stamps and coloring', async ({page}) => {
  await page.goto('./')
  await page.getByRole('button', {name: /怪獸塗鴉屋/}).click()
  const board = page.getByLabel('塗鴉畫布')
  const rect = await board.boundingBox()
  await page.mouse.move(rect!.x + 40, rect!.y + 40)
  await page.mouse.down()
  await page.mouse.move(rect!.x + 120, rect!.y + 90, {steps: 5})
  await page.mouse.up()
  await expect(board.locator('polyline')).toHaveCount(1)
  await page.getByRole('button', {name: '復原上一筆'}).click()
  await expect(board.locator('polyline')).toHaveCount(0)
  await page.getByRole('button', {name: '⭐印章'}).click()
  await board.tap({position: {x: 50, y: 50}})
  await expect(board.locator('text')).toHaveText('⭐')
  await page.getByRole('button', {name: '天空藍'}).click()
  await page.getByRole('button', {name: '塗色', exact: true}).click()
  await page.getByRole('button', {name: '替小怪獸塗色'}).click()
  await expect(board.locator('g[role=button] > path').first()).toHaveAttribute('fill', '#649cde')
  await page.getByRole('button', {name: '清空畫布'}).click()
  await expect(board.locator('text')).toHaveCount(0)
})

test('hospital cares for a patient once per tool and resets for next friend', async ({page}) => {
  await page.goto('./')
  await page.getByRole('button', {name: /怪獸小醫院/}).click()
  for (const name of ['量體溫', '貼星星貼布', '蓋小被子']) {
    await page.getByRole('button', {name, exact: false}).filter({hasNotText: '點我'}).click()
    await page.getByRole('button', {name: '使用工具照顧怪獸'}).click()
    await expect(page.getByRole('button', {name, exact: false}).filter({hasNotText: '點我'})).toBeDisabled()
  }
  await expect(page.getByRole('status')).toContainText('照顧完成')
  await page.getByRole('button', {name: '照顧下一位'}).click()
  await expect(page.getByRole('button', {name: '使用工具照顧怪獸'})).toContainText('👻')
  await expect(page.getByRole('button', {name: /量體溫/})).toBeEnabled()
})

test('post keeps a wrong parcel and completes matching deliveries', async ({page}) => {
  await page.goto('./')
  await page.getByRole('button', {name: /幽靈郵差/}).click()
  await page.getByRole('button', {name: '星星包裹'}).tap()
  await page.getByRole('button', {name: '花朵的家'}).tap()
  await expect(page.getByRole('status')).toContainText('再看看圖案')
  await expect(page.getByRole('button', {name: '星星包裹'})).toHaveAttribute('aria-pressed', 'true')
  for (const name of ['星星', '花朵', '月亮']) {
    await page.getByRole('button', {name: `${name}包裹`}).tap()
    await page.getByRole('button', {name: `${name}的家`}).tap()
  }
  await expect(page.getByRole('status')).toContainText('全部送到了')
  await page.getByRole('button', {name: '再送一袋'}).tap()
  await expect(page.getByRole('status')).toContainText('0 / 3')
  await expect(page.locator('.post-house').first()).toHaveAttribute('aria-label', '花朵的家')
})

test('creative games fit phone and landscape and join parent controls', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'})
  for (const viewport of [{width: 390, height: 844}, {width: 1180, height: 820}]) {
    await page.setViewportSize(viewport)
    await page.goto('./')
    for (const name of ['怪獸塗鴉屋', '怪獸小醫院', '幽靈郵差']) {
      await page.getByRole('button', {name: new RegExp(name)}).tap()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await page.screenshot({path: `test-results/creative-${name}-${viewport.width}.png`, fullPage: true})
      await page.getByRole('button', {name: '← 回遊樂場'}).tap()
    }
  }
  await page.getByRole('button', {name: '家長管理'}).click()
  await page.getByLabel('六位數密碼').fill('666666')
  await page.getByRole('button', {name: '進入管理'}).click()
  await page.getByRole('checkbox', {name: /幽靈郵差/}).uncheck()
  await page.getByRole('button', {name: '儲存遊戲庫'}).click()
  await page.reload()
  await expect(page.getByRole('button', {name: /幽靈郵差/})).toHaveCount(0)
})
