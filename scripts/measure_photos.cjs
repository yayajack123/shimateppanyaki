const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('fs');
(async () => {
 const browser = await chromium.launch({headless:true, ...(process.env.CHROMIUM_EXECUTABLE ? {executablePath:process.env.CHROMIUM_EXECUTABLE} : {})});
 const results = [];
 const base = process.env.BASE_URL || 'http://127.0.0.1:8765';
 for (const [width,dpr] of [[390,1],[390,2],[600,1],[601,1],[768,1],[991,1],[992,1],[1200,1],[1440,1],[1440,2]]) {
  const context = await browser.newContext({viewport:{width,height:850},deviceScaleFactor:dpr});
  const page = await context.newPage();
  const errors=[];
  page.on('response',r=>{if(r.url().startsWith(base + '/')&&r.status()>=400)errors.push([r.status(),r.url()])});
  await page.addInitScript(()=>{
   window.metrics={lcp:0,cls:0};
   new PerformanceObserver(l=>{for(const e of l.getEntries())window.metrics.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});
   new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.metrics.cls+=e.value}).observe({type:'layout-shift',buffered:true});
  });
  if (process.env.BASELINE_HTML) await page.route(base + '/teppanyaki.html', route => route.fulfill({contentType:'text/html',body:fs.readFileSync(process.env.BASELINE_HTML,'utf8')}));
  await page.goto(base + '/teppanyaki.html',{waitUntil:'load'});
  await page.waitForTimeout(1500);
  const initial = await page.evaluate(()=>({metrics:window.metrics,requests:performance.getEntriesByType('resource').length,bytes:performance.getEntriesByType('resource').reduce((s,e)=>s+e.transferSize,0),loadedMenu:[...document.querySelectorAll('img[loading="lazy"]')].filter(x=>x.complete&&x.naturalWidth>0).length,cards:[...document.querySelectorAll('.menu-photo-card img')].map(x=>({width:x.getBoundingClientRect().width,source:x.currentSrc})),includes:document.querySelector('img[style*="max-width: 360px"]')?.getBoundingClientRect().width}));
  for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(70)}
  await page.waitForTimeout(700);
  const full = await page.evaluate(()=>({menuBytes:performance.getEntriesByType('resource').filter(e=>/generated-|menu-steak/.test(e.name)).reduce((s,e)=>s+e.transferSize,0),requests:performance.getEntriesByType('resource').length,bytes:performance.getEntriesByType('resource').reduce((s,e)=>s+e.transferSize,0),images:[...document.querySelectorAll('img[loading="lazy"]')].map(x=>({source:x.currentSrc,width:x.getBoundingClientRect().width,loaded:x.complete&&x.naturalWidth>0})),metrics:window.metrics,overflow:document.documentElement.scrollWidth>innerWidth}));
  results.push({width,dpr,initial,full,errors});
  if(width===390&&dpr===2||width===1440&&dpr===2){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:require('path').join(require('os').tmpdir(),`${process.argv[2]}-${width}.png`)})}
  await context.close();
 }
 await browser.close();fs.writeFileSync(process.argv[3],JSON.stringify(results,null,2));
 console.log(JSON.stringify(results.map(x=>({width:x.width,dpr:x.dpr,cardWidths:[...new Set(x.initial.cards.map(c=>Math.round(c.width*100)/100))],includes:x.initial.includes,initialBytes:x.initial.bytes,initialMenu:x.initial.loadedMenu,menuBytes:x.full.menuBytes,lcp:x.initial.metrics.lcp,cls:x.full.metrics.cls,errors:x.errors,overflow:x.full.overflow})),null,2));
})();
