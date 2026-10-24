import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";
import { writeFileSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
// Fresh isolated Chrome profile. No access to the owner's browsing session.
const profile = await mkdtemp(path.join(tmpdir(), "portfolio-lighthouse-"));
const chrome = spawn(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--remote-debugging-port=9223",
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ],
  { windowsHide: true, stdio: "ignore" },
);
try {
  for (let i = 0; i < 30; i++) {
    try {
      await fetch("http://127.0.0.1:9223/json/version");
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  const result = await lighthouse("http://127.0.0.1:3001/id/", {
    port: 9223,
    output: ["json", "html"],
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttlingMethod: "simulate",
  });
  mkdirSync("qa", { recursive: true });
  writeFileSync("qa/lighthouse-mobile.json", result.report[0]);
  writeFileSync("qa/lighthouse-mobile.html", result.report[1]);
  const lhr = result.lhr;
  const metrics = Object.fromEntries(
    [
      "first-contentful-paint",
      "largest-contentful-paint",
      "total-blocking-time",
      "cumulative-layout-shift",
      "speed-index",
    ].map((k) => [
      k,
      {
        value: lhr.audits[k]?.numericValue,
        display: lhr.audits[k]?.displayValue,
      },
    ]),
  );
  console.log(
    JSON.stringify(
      {
        scores: Object.fromEntries(
          Object.entries(lhr.categories).map(([k, v]) => [k, v.score]),
        ),
        metrics,
        environment: lhr.environment,
        throttling: lhr.configSettings.throttling,
      },
      null,
      2,
    ),
  );
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await page.addInitScript(() => {
    window.__lab = { lcp: 0, cls: 0, longTasks: 0 };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__lab.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries())
        if (!e.hadRecentInput) window.__lab.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("http://127.0.0.1:3001/id/", { waitUntil: "networkidle" });
  console.log("Unthrottled smoke:", await page.evaluate(() => window.__lab));
  await browser.close();
} finally {
  chrome.kill();
}
