const puppeteer = require('puppeteer');
const pool = require('.././database/db');

module.exports  = (async () => { 
  async function getJob (url) {
   const page = await browser.newPage();
   await page.setDefaultNavigationTimeout(0);
   await page.setViewport({ width: 1280, height: 720 });
     await page.goto(url);
 
     const jobs = await page.evaluate(() =>
     Array.from(document.querySelectorAll(".document > .doc_entry")).map(jobs => ({
      "Navn": jobs.querySelector('.doc_entry_desc > .school_name').innerText,
      "Logo": jobs.querySelector('.doc_entry_logo > img').src 
  }))
     )
 
 
 // Skal man afslutte recursion
 if(jobs.length < 1){
 return jobs
 } else{
  const nextPageNumber = parseInt(url.match(/start=(\d+)$/)[1], 10) +20;
 if(nextPageNumber == 80){
 return jobs
 }
  const nextUrl = `http://www.skoleliste.eu/type/videreg-ende-uddannelser/?region=&start=${nextPageNumber}`;
  return jobs.concat(await getJob(nextUrl));
 }
 };
 const browser = await puppeteer.launch({headless:false, slowMo:300});
 const firstUrl = "http://www.skoleliste.eu/type/videreg-ende-uddannelser/?region=&start=00"
 const jobListe = await getJob(firstUrl);


const fs = require('fs');
fs.writeFile('./vidergående.json', JSON.stringify(jobListe), err => err ? console.log(err): null);
 
 await browser.close();
 })();
 
 