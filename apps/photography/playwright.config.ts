import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 45000,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://127.0.0.1:3002",
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop" },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "reduced",
      use: { viewport: { width: 390, height: 844 }, reducedMotion: "reduce" },
    },
  ],
});
