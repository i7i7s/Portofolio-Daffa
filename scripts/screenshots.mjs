import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
mkdirSync("qa", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:3000/id/", { waitUntil: "networkidle" });
async function revealAll() {
  for (
    let y = 0;
    y < (await page.evaluate(() => document.body.scrollHeight));
    y += 650
  ) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(130);
  }
  await page.waitForTimeout(650);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images).map((i) => i.decode().catch(() => {})),
    );
  });
}
await page.screenshot({ path: "qa/desktop-hero.png" });
await revealAll();
await page.screenshot({ path: "qa/desktop.png", fullPage: true });
await page.goto('http://127.0.0.1:3000/en/projects/',{waitUntil:'networkidle'});
await revealAll();await page.screenshot({path:'qa/projects-desktop.png',fullPage:true});
await page.goto('http://127.0.0.1:3000/id/projects/ruang/',{waitUntil:'networkidle'});
await revealAll();await page.screenshot({path:'qa/detail-desktop.png',fullPage:true});
await page.goto('http://127.0.0.1:3000/en/photography/',{waitUntil:'networkidle'});
await revealAll();await page.screenshot({path:'qa/gallery-desktop.png',fullPage:true});
await page.locator('.photo-button').first().click();await page.waitForTimeout(350);await page.screenshot({path:'qa/gallery-dialog.png'});
await page.getByRole('button',{name:'Close',exact:true}).click();
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:3000/id/',{waitUntil:'networkidle'});
await page.screenshot({ path: "qa/mobile-hero.png" });
await revealAll();
await page.screenshot({ path: "qa/mobile.png", fullPage: true });
console.log(
  JSON.stringify({
    errors,
    title: await page.title(),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  }),
);
await browser.close();
