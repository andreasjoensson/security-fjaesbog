const puppeteer = require('puppeteer');

module.exports = (async () => { 
    const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto("https://elevpraktik.dk/ungdomsuddannelser");

    const skoler = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".posts-container > .post-container")).map(jobs => ({
      "Navn": jobs.querySelector('.info-container > .post-title').innerText,
      "Logo": jobs.querySelector('.school-logo > img').dataset.src
  }))
    )
    
    const fs = require('fs');
fs.writeFile('./gymnasier.json', JSON.stringify(skoler), err => err ? console.log(err): null);

await browser.close();
})();
