import { test, expect, type Page } from "@playwright/test";
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

// Vertical spread of print centres that are fully on screen: large for a ring,
// near zero for a straight row. `skip` leaves out the enlarged print.
const spread = (page: Page, skip = -1) =>
  page.evaluate((skipIndex) => {
    const ys = [...document.querySelectorAll<HTMLElement>(".orbit-card")]
      .filter(
        (c) =>
          c.style.display !== "none" && Number(c.dataset.orbitI) !== skipIndex,
      )
      .map((c) => c.getBoundingClientRect())
      .filter((r) => r.x > 0 && r.x + r.width < innerWidth)
      .map((r) => r.y + r.height / 2);
    return ys.length ? Math.max(...ys) - Math.min(...ys) : 0;
  }, skip);

async function readyOrbit(page: Page) {
  await page.goto("/");
  const stage = page.locator(".orbit-stage");
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute("data-ready", "true");
  // the ring flies in for ~1.6s; measure only once it has settled
  await expect(stage).toHaveAttribute("data-settled", "true", {
    timeout: 8000,
  });
  await expect.poll(() => spread(page)).toBeGreaterThan(40);
  return stage;
}

test("orbit turns when dragged and does not open a print after a drag", async ({
  page,
}) => {
  const stage = await readyOrbit(page);
  const box = (await stage.boundingBox())!;
  const first = page.locator(".orbit-card").first();
  const before = (await first.boundingBox())!.x;
  // start in the empty strip above the ring so no print is hovered
  await page.mouse.move(box.x + box.width / 2 - 100, box.y + 24);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 160, box.y + 24, { steps: 12 });
  await page.mouse.up();
  const after = (await first.boundingBox())!.x;
  expect(Math.abs(after - before)).toBeGreaterThan(80);
  await expect(page).toHaveURL(/\/$/);
});

test("orbit unrolls into a row under the mouse and rolls back", async ({
  page,
}, info) => {
  test.skip(info.project.name === "mobile", "needs a hovering pointer");
  const stage = await readyOrbit(page);
  const box = (await stage.boundingBox())!;
  const front = await page.evaluate(() => {
    let best = { i: -1, w: 0, x: 0, y: 0 };
    document.querySelectorAll<HTMLElement>(".orbit-card").forEach((c) => {
      const r = c.getBoundingClientRect();
      if (c.style.display !== "none" && r.width > best.w)
        best = {
          i: Number(c.dataset.orbitI),
          w: r.width,
          x: r.x + r.width / 2,
          y: r.y + r.height / 2,
        };
    });
    return best;
  });
  await page.mouse.move(box.x + 20, box.y + 24);
  await page.mouse.move(front.x, front.y, { steps: 8 });
  await expect
    .poll(() => spread(page, front.i), { timeout: 4000 })
    .toBeLessThan(4);
  const grown = await page
    .locator(`[data-orbit-i="${front.i}"]`)
    .evaluate((c) => c.getBoundingClientRect().width);
  expect(grown).toBeGreaterThan(front.w * 1.2);
  await page.mouse.move(box.x + 20, box.y + 24, { steps: 6 });
  await expect.poll(() => spread(page), { timeout: 5000 }).toBeGreaterThan(40);
});
