import {expect,test} from '@playwright/test'

test('brushing supports repeated taps, drag, completion and new monster',async({page})=>{
  await page.goto('./');await page.getByRole('button',{name:/怪獸刷牙屋/}).click()
  const first=page.getByRole('button',{name:'第 1 顆牙齒',exact:true})
  const rect=await first.boundingBox()
  await page.mouse.move(rect!.x+8,rect!.y+25);await page.mouse.down()
  await page.mouse.move(rect!.x+rect!.width-8,rect!.y+25,{steps:8})
  await page.mouse.move(rect!.x+8,rect!.y+25,{steps:8});await page.mouse.up()
  await expect(first).toHaveClass(/tooth-clean/)
  for(let tooth=2;tooth<=12;tooth++)for(let i=0;i<3;i++)await page.getByRole('button',{name:`第 ${tooth} 顆牙齒`,exact:true}).tap()
  await expect(page.getByRole('progressbar',{name:'刷牙進度'})).toHaveAttribute('aria-valuenow','12')
  await expect(page.getByRole('status')).toContainText('全部刷乾淨')
  await page.getByRole('button',{name:'換一位怪獸刷牙'}).tap()
  await expect(page.locator('.tooth-clean')).toHaveCount(0)
  await first.focus();await page.keyboard.press('Enter')
  await expect(first).toHaveAttribute('aria-description','已刷 1 下')
})

test('dryer supports both wind speeds, styling and restart',async({page})=>{
  await page.goto('./');await page.getByRole('button',{name:/怪獸吹風屋/}).click()
  for(let i=0;i<4;i++)await page.getByRole('button',{name:'吹乾左邊頭髮'}).tap()
  await expect(page.getByRole('button',{name:'吹乾左邊頭髮'})).toHaveClass(/hair-dry/)
  await page.getByRole('button',{name:'大風吹吹'}).click()
  for(const name of ['中間','右邊'])for(let i=0;i<2;i++)await page.getByRole('button',{name:`吹乾${name}頭髮`}).tap()
  await expect(page.getByRole('status')).toContainText('全部吹乾')
  await page.getByRole('button',{name:'沖天頭'}).click()
  await expect(page.locator('.dryer-scene')).toHaveClass(/hair-style-2/)
  await page.getByRole('button',{name:'換一位怪獸吹頭髮'}).tap()
  await expect(page.locator('.hair-dry')).toHaveCount(0)
  const rect=await page.getByRole('button',{name:'吹乾中間頭髮'}).boundingBox()
  await page.mouse.move(rect!.x+10,rect!.y+40);await page.mouse.down()
  await page.mouse.move(rect!.x+rect!.width-10,rect!.y+40,{steps:10});await page.mouse.up()
  await expect(page.getByRole('button',{name:'吹乾中間頭髮'})).toHaveClass(/hair-dry/)
})

test('care games work offline, fit phone and landscape and join parent controls',async({page,context})=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message))
  await page.goto('./');await page.evaluate(()=>navigator.serviceWorker.ready)
  await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true)
  await context.setOffline(true);await page.reload();await page.emulateMedia({reducedMotion:'reduce'})
  for(const viewport of [{width:390,height:844},{width:1180,height:820}]){
    await page.setViewportSize(viewport)
    for(const name of ['怪獸刷牙屋','怪獸吹風屋']){
      await page.getByRole('button',{name:new RegExp(name)}).tap()
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
      await page.screenshot({path:`test-results/care-${name}-${viewport.width}.png`,fullPage:true})
      await page.getByRole('button',{name:'← 回遊樂場'}).click()
    }
  }
  await page.getByRole('button',{name:'家長管理'}).click();await page.getByLabel('六位數密碼').fill('666666')
  await page.getByRole('button',{name:'進入管理'}).click()
  for(const name of ['怪獸刷牙屋','怪獸吹風屋'])await expect(page.getByRole('checkbox',{name:new RegExp(name)})).toBeChecked()
  expect(errors).toEqual([])
})
