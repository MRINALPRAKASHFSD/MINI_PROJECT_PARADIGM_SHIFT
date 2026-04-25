const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  await page.goto('http://localhost:5173/login');
  await page.type('input[type="email"]', 'rajesh.kumar@paradigmshift.com');
  await page.type('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForNavigation();
  
  console.log('Navigating to workspace...');
  await page.goto('http://localhost:5173/workspace');
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
