import {expect, test} from '@playwright/test'

test('release announcement starts collapsed and can be opened or closed', async ({page}) => {
  await page.goto('./')

  const toggle = page.getByRole('button', {name: '查看公告'})
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByText(/新增南瓜橫向大冒險/)).toBeHidden()

  await toggle.click()
  const close = page.getByRole('button', {name: '收合公告'})
  await expect(close).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByText(/新增南瓜橫向大冒險/)).toBeVisible()

  await close.click()
  await expect(page.getByText(/新增南瓜橫向大冒險/)).toBeHidden()
})
