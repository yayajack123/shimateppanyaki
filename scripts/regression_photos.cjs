const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');

(async () => {
 const browser = await chromium.launch({headless:true, ...(process.env.CHROMIUM_EXECUTABLE ? {executablePath:process.env.CHROMIUM_EXECUTABLE} : {})});
 const base = process.env.BASE_URL || 'http://127.0.0.1:8765';
 const results = [];
 const dismiss = async page => {
  await page.waitForTimeout(700);
  const close = page.locator('.pum-active .pum-close').first();
  if(await close.isVisible()) await close.click();
 };
 for (const width of [390,1440]) {
  for (const name of ['index.html','restaurant.html','teppanyaki.html']) {
   const context = await browser.newContext({viewport:{width,height:850}});
   const page = await context.newPage();
   const errors=[];
   page.on('response',r=>{if(r.url().startsWith(base+'/')&&r.status()>=400)errors.push([r.status(),r.url()])});
   await page.goto(base+'/'+name,{waitUntil:'load'});
   await dismiss(page);
   assert.equal(await page.locator('body').innerText().then(x=>x.length>100),true);
   const geometry=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth,heading:document.querySelector('h2')?.textContent}));
   assert.equal(geometry.width<=geometry.viewport,true,`Overflow: ${name} ${width}`);
   await page.locator('.wa__btn_popup').click();
   await page.waitForTimeout(300);
   assert.equal(await page.locator('.wa__popup_chat_box').evaluate(x=>x.classList.contains('wa__active')),true);
   await page.locator('.wa__btn_popup').click();
   assert.equal(await page.locator('.wa__popup_chat_box').evaluate(x=>x.classList.contains('wa__active')),false);
   const menu = width===390 ? '#mobile-menu' : '#primary-menu';
   if(width===390){
    await page.locator('#mobile-menu-trigger').click();await page.waitForTimeout(300);
    assert.equal(await page.locator('#mobile-menu').isVisible(),true);
   }
   if(name==='teppanyaki.html') {
    const original=fs.readFileSync(path.join(root,'.optimization-backup/teppanyaki.html'),'utf8');
    const baseline=await context.newPage();
    await baseline.route(base+'/teppanyaki.html',r=>r.fulfill({body:original,contentType:'text/html'}));
    await baseline.goto(base+'/teppanyaki.html',{waitUntil:'load'});
    const content = p=>p.locator('body').evaluate(x=>({text:(()=>{const body=x.cloneNode(true);body.querySelectorAll('script, style').forEach(n=>n.remove());return body.textContent.replace(/\s+/g,' ').trim();})(),links:[...x.querySelectorAll('a')].map(a=>[a.getAttribute('href'),a.textContent]),alts:[...x.querySelectorAll('img')].map(a=>a.alt)}));
    assert.deepEqual(await content(page),await content(baseline),'Menu text, prices, links or alt text changed');
    await baseline.close();
   }
   await page.locator(menu+' a[href="restaurant.html"]').first().click();
   await page.waitForURL('**/restaurant.html');
   await dismiss(page);
   assert.equal(new URL(page.url()).pathname,'/restaurant.html');
   if(width===390){await page.locator('#mobile-menu-trigger').click();await page.waitForTimeout(300)}
   await page.locator(menu+' a[href="index.html"]').first().click();
   await page.waitForURL('**/index.html');
   if(name==='teppanyaki.html') {
    await dismiss(page);
    if(width===390){
     await page.locator('#mobile-menu-trigger').click();await page.waitForTimeout(300);
     await page.locator('#mobile-menu .sf-sub-indicator').first().click();await page.waitForTimeout(300);
    } else {
     await page.locator('#primary-menu a[data-unlinked-menu]').first().hover();
    }
    await page.locator(menu+' a[href="teppanyaki.html"]').first().click();
    await page.waitForURL('**/teppanyaki.html');
   }
   assert.equal(errors.length,0,JSON.stringify(errors));
   results.push({name,width,popup:'pass',navigation:'pass',overflow:false,errors});
   await context.close();
  }
 }
 await browser.close();
 fs.writeFileSync(path.join(__dirname,'browser-regression.json'),JSON.stringify(results,null,2)+'\n');
 console.log(JSON.stringify(results,null,2));
})().catch(error=>{console.error(error);process.exit(1)});
