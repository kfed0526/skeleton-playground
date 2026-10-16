import {expect, test} from '@playwright/test'

test('pumpkin adventure starts, jumps, crouches and pauses safely', async ({page}) => {
  await page.goto('./')
  await page.getByRole('button', {name: /南瓜橫向大冒險/}).click()
  await page.getByRole('button', {name: '開始冒險'}).click()
  await page.getByRole('button', {name: '跳躍'}).click()
  await expect(page.getByLabel('冒險中的南瓜')).toHaveClass(/jumping/)
  await page.getByRole('button', {name: '蹲下'}).click()
  await expect(page.getByLabel('冒險中的南瓜')).toHaveClass(/crouching/)
  await page.getByRole('button', {name: '暫停'}).click()
  await expect(page.getByRole('button', {name: '繼續冒險'})).toBeVisible()
  await page.getByRole('button', {name: '糖果城堡'}).click()
  await expect(page.getByText('第 3 關', {exact: true})).toBeVisible()
})

test('skeleton construction snaps blueprint pieces and supports free building', async ({page}) => {
  await page.goto('./')
  await page.evaluate(() => localStorage.setItem('nickson-skeleton-playground-v1', JSON.stringify({hat: 'witch', glasses: true, color: '#ffb9d4'})))
  await page.reload()
  await page.getByRole('button', {name: /骨頭人工地/}).click()
  await expect(page.locator('.builder-skeleton .bone-body')).toHaveAttribute('stroke', '#ffb9d4')
  await page.getByRole('button', {name: '屋頂積木'}).click()
  await page.getByRole('button', {name: '建築位置 地基'}).click()
  await expect(page.getByRole('status')).toContainText('再看看形狀')

  const basePiece = page.getByRole('button', {name: '地基積木'})
  const baseSlot = page.getByRole('button', {name: '建築位置 地基'})
  const source = await basePiece.boundingBox()
  const target = await baseSlot.boundingBox()
  await page.mouse.move(source!.x + source!.width / 2, source!.y + source!.height / 2)
  await page.mouse.down()
  await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2, {steps: 8})
  await page.mouse.up()
  await expect(basePiece).toHaveCount(0)

  for (const piece of ['牆壁', '屋頂', '門']) {
    await page.getByRole('button', {name: `${piece}積木`}).click()
    await page.getByRole('button', {name: `建築位置 ${piece}`}).click()
  }
  await expect(page.getByRole('alert')).toContainText('蓋好了')

  await page.getByRole('button', {name: '自由搭建模式'}).click()
  await page.getByRole('button', {name: '選擇紫色積木'}).click()
  await page.getByRole('button', {name: '自由格子 1', exact: true}).click()
  await expect(page.getByRole('button', {name: '自由格子 1', exact: true})).toContainText('🟪')
})

test('monster rhythm party demonstrates a pattern and allows free music', async ({page}) => {
  await page.goto('./')
  await page.evaluate(() => localStorage.setItem('nickson-skeleton-playground-v1', JSON.stringify({hat: 'pirate', glasses: false, color: '#a4e4cc'})))
  await page.reload()
  await page.getByRole('button', {name: /怪獸節奏派對/}).click()
  await expect(page.locator('.rhythm-skeleton .bone-body')).toHaveAttribute('stroke', '#a4e4cc')
  await page.getByRole('button', {name: '開始節奏'}).click()
  await expect(page.getByRole('status')).toContainText('換你', {timeout: 5000})
  await page.getByRole('button', {name: '糖果琴'}).click()
  await expect(page.getByRole('button', {name: '南瓜鼓'})).toBeDisabled()
  await expect(page.getByRole('alert')).toHaveCount(0)
  await expect(page.getByRole('status')).toContainText('換你', {timeout: 5000})
  await page.getByRole('button', {name: '南瓜鼓'}).click()
  await page.getByRole('button', {name: '幽靈鈴'}).click()
  await page.getByRole('button', {name: '怪獸鼓'}).click()
  await expect(page.getByRole('alert')).toContainText('節奏完成')

  await page.getByRole('button', {name: '自由演奏模式'}).click()
  await page.getByRole('button', {name: '糖果琴'}).click()
  await expect(page.getByRole('status')).toContainText('自由演奏')
})

test('monster pet house supports gentle care and dress-up', async ({page}) => {
  await page.goto('./')
  await page.getByRole('button', {name: /怪獸寵物屋/}).click()
  await page.getByRole('button', {name: '選擇幽靈貓'}).click()
  await expect(page.getByRole('button', {name: '選擇幽靈貓'})).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('button', {name: '餵點心'}).click()
  await expect(page.getByRole('progressbar', {name: '飽足度'})).toHaveAttribute('aria-valuenow', '85')
  await page.getByRole('button', {name: '洗泡泡澡'}).click()
  await expect(page.getByRole('progressbar', {name: '乾淨度'})).toHaveAttribute('aria-valuenow', '85')
  await page.getByRole('button', {name: '戴上皇冠'}).click()
  await expect(page.getByLabel('正在照顧的幽靈貓')).toContainText('👑')
  await page.getByRole('button', {name: '睡覺'}).click()
  await expect(page.getByRole('status')).toContainText('做甜甜的夢')
})

test('four new games fit a small touch screen with reduced motion', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844})
  await page.emulateMedia({reducedMotion: 'reduce'})
  await page.goto('./')
  for (const title of ['南瓜橫向大冒險', '骨頭人工地', '怪獸節奏派對', '怪獸寵物屋']) {
    await page.getByRole('button', {name: new RegExp(title)}).click()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.getByRole('button', {name: '← 回遊樂場'}).click()
  }
  await page.screenshot({path: 'test-results/v4-home-mobile.png', fullPage: true, animations: 'disabled'})
  await page.setViewportSize({width: 1180, height: 820})
  for (const title of ['南瓜橫向大冒險', '骨頭人工地', '怪獸節奏派對', '怪獸寵物屋']) {
    await page.getByRole('button', {name: new RegExp(title)}).tap()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.getByRole('button', {name: '← 回遊樂場'}).tap()
  }
})
