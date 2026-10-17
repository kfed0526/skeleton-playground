import {test,expect} from '@playwright/test'

test('flashlight finds requested treasures and changes garden',async({page})=>{
  await page.goto('./')
  await page.getByRole('button',{name:/怪獸手電筒/}).click()
  for(const name of ['星星','糖果','蝴蝶'])await page.getByRole('button',{name:`尋找${name}`}).tap()
  await expect(page.getByRole('status')).toContainText('都找到了')
  await page.getByRole('button',{name:'再找一輪'}).click()
  await expect(page.getByRole('status')).toContainText('0 / 3')
  await expect(page.getByLabel('尋寶清單')).toContainText('蘑菇')
  const item=await page.getByRole('button',{name:'尋找蘑菇'}).boundingBox()
  await page.mouse.move(item!.x+item!.width/2,item!.y+item!.height/2)
  await expect(page.getByRole('status')).toContainText('1 / 3')
})

test('bridge checks lengths and crosses all rivers',async({page})=>{
  await page.goto('./');await page.getByRole('button',{name:/南瓜搭橋/}).click()
  await page.getByRole('button',{name:'長木板',exact:true}).click()
  await page.getByRole('button',{name:'放置木板'}).click()
  await expect(page.getByRole('status')).toContainText('太長')
  for(const length of ['短','中','長']){
    await page.getByRole('button',{name:`${length}木板`,exact:true}).click()
    await page.getByRole('button',{name:'放置木板'}).click()
    await page.getByRole('button',{name:'出發過河'}).click()
    await expect(page.getByRole('status')).toContainText('過河了')
    await expect(page.getByLabel('過河的南瓜')).toHaveClass(/across/)
    await page.getByRole('button',{name:'再搭一座橋'}).click()
  }
})

test('slide validates route, locks launch and clears timers on reset',async({page})=>{
  await page.goto('./');await page.getByRole('button',{name:/骨頭人溜滑梯/}).click()
  await page.getByRole('button',{name:'放小球'}).click()
  await expect(page.getByRole('button',{name:'放小球'})).toBeDisabled()
  await expect(page.getByRole('status')).toContainText('抵達終點')
  await page.getByRole('button',{name:'左邊的朋友'}).click()
  for(const name of ['第 1 段滑梯','第 2 段滑梯']){
    await page.getByRole('button',{name,exact:true}).click()
    await page.getByRole('button',{name,exact:true}).click()
  }
  await page.getByRole('button',{name:'放小球'}).click()
  await expect(page.getByRole('status')).toContainText('抵達終點')
  await page.getByRole('button',{name:'右邊的城堡'}).click()
  await page.getByRole('button',{name:'放小球'}).click()
  await expect(page.getByRole('status')).toContainText('另一邊')
  await page.getByRole('button',{name:'第 1 段滑梯',exact:true}).click()
  await page.getByRole('button',{name:'第 2 段滑梯',exact:true}).click()
  await page.getByRole('button',{name:'放小球'}).click()
  await expect(page.getByRole('status')).toContainText('抵達終點')
  await page.getByRole('button',{name:'放小球'}).click()
  await page.getByRole('button',{name:'重新搭滑梯'}).click()
  await page.waitForTimeout(2600)
  await expect(page.locator('.slide-ball')).toHaveAttribute('data-moving','false')
  await expect(page.getByRole('status')).toContainText('點每段滑梯')
})

test('new games work offline on phone and landscape and appear in parent controls',async({page,context})=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message))
  await page.goto('./');await page.evaluate(()=>navigator.serviceWorker.ready)
  await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true)
  await context.setOffline(true);await page.reload()
  await page.emulateMedia({reducedMotion:'reduce'})
  for(const viewport of [{width:390,height:844},{width:1180,height:820}]){
    await page.setViewportSize(viewport)
    for(const name of ['怪獸手電筒','南瓜搭橋','骨頭人溜滑梯']){
      await page.getByRole('button',{name:new RegExp(name)}).tap()
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
      await page.screenshot({path:`test-results/discovery-${name}-${viewport.width}.png`,fullPage:true})
      await page.getByRole('button',{name:'← 回遊樂場'}).tap()
    }
  }
  await page.getByRole('button',{name:'家長管理'}).click()
  await page.getByLabel('六位數密碼').fill('666666');await page.getByRole('button',{name:'進入管理'}).click()
  for(const name of ['怪獸手電筒','南瓜搭橋','骨頭人溜滑梯'])await expect(page.getByRole('checkbox',{name:new RegExp(name)})).toBeChecked()
  expect(errors).toEqual([])
})
