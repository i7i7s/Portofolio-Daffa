import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("drying line moves, pauses and links to frames", async ({
  page,
}, info) => {
  await page.goto("/");
  const pegs = page.locator(".peg");
  await expect(pegs).toHaveCount(7);
  const toggle = page.getByRole("button", { name: /jemuran/i });
  if (info.project.name === "reduced") {
    await expect(toggle).toBeHidden();
    const state = await pegs
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(state).toBe("none");
    return;
  }
  const at = () => pegs.first().evaluate((el) => el.getBoundingClientRect().x);
  const start = await at();
  await page.waitForTimeout(800);
  expect(await at()).not.toBe(start);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await page.mouse.move(5, 5);
  const paused = await at();
  await page.waitForTimeout(800);
  expect(await at()).toBe(paused);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
});

test("contact sheet frame opens the viewfinder and keys step through", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: /Frame 02: Genangan di perempatan \(dipilih\)/ })
    .click();
  await expect(page).toHaveURL(/\/foto\/kota-hujan\/02\/$/);
  await expect(page.locator("h1")).toHaveText("Genangan di perempatan");
  await expect(page.locator(".vf-hud")).toContainText("ISO 800");
  await expect(page.locator(".vf-hud")).toContainText("02/06");
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/\/foto\/kota-hujan\/03\/$/);
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/\/foto\/kota-hujan\/02\/$/);
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/#kota-hujan$/);
});

test("pages render without overflow, broken images or axe violations", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const path of ["/", "/foto/pesisir/04/", "/foto/kebun-pagi/04/"]) {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      axe.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
  expect((await page.goto("/foto/pesisir/99/"))?.status()).toBe(404);
  expect(errors).toEqual([]);
});
