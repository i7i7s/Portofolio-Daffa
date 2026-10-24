import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
const consoleErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
await page.goto("http://127.0.0.1:3002/id/projects/");
assert.equal(await page.locator(".project-card").count(), 0);
assert.match(await page.locator("main").innerText(), /Belum ada proyek/);
await page.goto("http://127.0.0.1:3002/en/photography/");
assert.equal(await page.locator(".photo-button").count(), 0);
assert.match(await page.locator("main").innerText(), /No photographs/);
const hidden = await page.goto("http://127.0.0.1:3002/id/projects/ruang/");
assert.equal(hidden.status(), 404);
const nojs = await browser.newContext({ javaScriptEnabled: false });
const fallback = await nojs.newPage();
await fallback.goto("http://127.0.0.1:3001/id/");
assert(
  await fallback
    .getByRole("heading", { name: "[Nama Kamu].", exact: true })
    .isVisible(),
);
assert(
  await fallback.getByRole("link", { name: /Jelajahi karya/ }).isVisible(),
);
await fallback.goto("http://127.0.0.1:3001/en/projects/?category=data");
assert.equal(await fallback.locator(".project-card").count(), 1);
await page.goto("http://127.0.0.1:3000/id/");
const diagnostics = () =>
  page.evaluate(() => {
    return window.__portfolioMotion?.();
  });
await page.waitForTimeout(1000);
const counts = [await diagnostics()];
for (let i = 0; i < 4; i++) {
  await page.locator(".hero .button").click();
  await page.waitForURL("**/id/projects/");
  await page.locator(".wordmark").click();
  await page.waitForURL("**/id/");
  await page.waitForTimeout(800);
  counts.push(await diagnostics());
}
console.log(
  JSON.stringify(
    {
      publicDraftIsolation: true,
      emptyStates: true,
      noJavaScriptContent: true,
      noJavaScriptFilter: true,
      counts,
      consoleErrors,
    },
    null,
    2,
  ),
);
await browser.close();
