import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("touch swipe and copy failure fallback", async ({ page }, info) => {
  await page.goto("/id/photography/");
  if (info.project.name === "mobile") {
    await page.locator(".photo-button").first().tap();
    const rect = await page.locator(".large-photo").boundingBox();
    const cdp = await page.context().newCDPSession(page);
    const x = rect!.x + rect!.width * 0.8,
      y = rect!.y + rect!.height * 0.5;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x - 100, y }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(page.locator(".photo-controls")).toContainText(
      "Gambar 2 dari 4",
    );
    await page.getByRole("button", { name: "Tutup", exact: true }).tap();
  }
  await page.goto("/id/#contact");
  await page.locator(".preview-contact summary").click();
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, "writeText", {
      value: async () => {
        throw new Error("test permission denied");
      },
    });
  });
  await page.getByRole("button", { name: "Salin email" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Belum berhasil disalin",
  );
  await expect(page.locator(".preview-contact code")).toHaveText(
    "hello@example.com",
  );
});

test("transition recovers while destination is delayed", async ({ page }) => {
  await page.goto("/id/");
  await page.route("**/id/projects/**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3300));
    await route.continue().catch(() => {});
  });
  await page.locator(".hero .button").click();
  await expect(page.locator(".page-wipe")).toBeHidden({ timeout: 3200 });
  await expect(page).toHaveURL(/\/id\/projects\//, { timeout: 10000 });
});

test("ID/EN pages, metadata, images, localized 404", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const locale of ["id", "en"])
    for (const route of ["", "projects/", "projects/ruang/", "photography/"]) {
      const response = await page.goto(`/${locale}/${route}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("main h1")).toBeVisible();
      await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
        "href",
        new RegExp(`/${locale}/${route}$`),
      );
      await expect(page.locator("meta[name=description]")).toHaveAttribute(
        "content",
        /.+/,
      );
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          Array.from(document.images)
            .filter((i) => i.loading !== "lazy")
            .map((i) => i.decode().catch(() => {})),
        );
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      expect(
        await page
          .locator("img")
          .evaluateAll((imgs) =>
            imgs
              .filter(
                (i) =>
                  (i as HTMLImageElement).complete &&
                  (i as HTMLImageElement).naturalWidth === 0,
              )
              .map((i) => i.getAttribute("src")),
          ),
      ).toEqual([]);
    }
  for (const locale of ["id", "en"]) {
    const r = await page.goto(`/${locale}/missing-page/`);
    expect(r?.status()).toBe(404);
    await expect(page.locator("main h1")).toHaveText(
      locale === "id" ? "Halaman ini belum ada." : "This page isn’t here.",
    );
  }
  expect(errors).toEqual([]);
});

test("filter URL, locale, project detail, back and forward", async ({
  page,
}) => {
  await page.goto("/id/projects/");
  await page.locator(".filters a").filter({ hasText: "Data" }).click();
  await expect(page).toHaveURL(/category=data/);
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page.locator(".project-link").click();
  await expect(page).toHaveURL(/projects\/pola\/\?category=data/);
  await expect(page.locator(".story")).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/projects\/\?category=data/);
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page.goForward();
  await expect(page).toHaveURL(/pola/);
  await page.locator(".detail-intro .text-link").click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page.locator(".language").click();
  await expect(page).toHaveURL(/\/en\/projects\/\?category=data/);
  await expect(page.locator(".filters [aria-current=true]")).toContainText(
    "Data",
  );
  await page.locator(".filters a").filter({ hasText: "UI/UX" }).click();
  await expect(page.locator(".project-card")).toHaveCount(2);
  await page.locator(".filters a").filter({ hasText: "Mobile" }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page.goBack();
  await expect(page.locator(".filters [aria-current=true]")).toContainText(
    "UI/UX",
  );
});

test("gallery keyboard, touch controls, focus trap and restoration", async ({
  page,
}) => {
  await page.goto("/id/photography/");
  const trigger = page.locator(".photo-button").first();
  await trigger.click();
  const dialog = page.locator(".photo-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[data-pose=reviewing] img")).toBeVisible();
  await expect(dialog.locator(".photo-controls")).toContainText(
    "Gambar 1 dari 4",
  );
  await page.keyboard.press("ArrowRight");
  await expect(dialog.locator(".photo-controls")).toContainText(
    "Gambar 2 dari 4",
  );
  await dialog.getByRole("button", { name: "Foto sebelumnya" }).click();
  await expect(dialog.locator(".photo-controls")).toContainText(
    "Gambar 1 dari 4",
  );
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => !!document.activeElement?.closest("dialog")),
    ).toBeTruthy();
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await trigger.click();
  await dialog.getByRole("button", { name: "Foto berikutnya" }).click();
  await expect(dialog.locator(".photo-controls")).toContainText(
    "Gambar 2 dari 4",
  );
  await dialog.getByRole("button", { name: "Tutup", exact: true }).click();
  await expect(trigger).toBeFocused();
});

test("interests, all mascot poses and clipboard success", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/id/");
  await expect(page.locator(".hero [data-pose=hello] img")).toBeVisible();
  await page.getByRole("tab", { name: /Data/ }).click();
  await expect(page.locator("#interest-panel")).toContainText("Membaca pola");
  await expect(page.locator(".interest-frame")).toHaveClass(/data/);
  await expect(
    page.locator(".interest-mascot[data-pose=coding] img"),
  ).toBeVisible();
  await page.getByRole("tab", { name: /Mobile/ }).click();
  await expect(page.locator(".interest-frame")).toHaveClass(/mobile/);
  await page.locator(".photo-mascot").scrollIntoViewIfNeeded();
  await expect(
    page.locator(".photo-mascot[data-pose=shooting] img"),
  ).toBeVisible();
  await page.locator(".preview-contact summary").click();
  await page.getByRole("button", { name: "Salin email" }).click();
  await expect(page.getByRole("status")).toHaveText("Email disalin!");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "hello@example.com",
  );
  await expect(page.locator(".contact-mascot")).toHaveAttribute(
    "data-pose",
    "success",
  );
  await expect(page.locator(".contact-mascot .mascot-current")).toBeVisible();
  await expect(page.locator(".contact-mascot")).toHaveAttribute(
    "data-pose",
    "hello",
    { timeout: 7000 },
  );
});

test("locale keeps anchor, menu focus and reduced-motion contract", async ({
  page,
}, info) => {
  await page.goto("/id/#about");
  await page.locator(".language").click();
  await expect(page).toHaveURL(/\/en\/#about/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const button = page.getByRole("button", { name: "Open menu" });
  if (await button.isVisible()) {
    await button.click();
    await expect(page.locator(".menu-dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".menu-dialog")).not.toBeVisible();
    await expect(button).toBeFocused();
    await button.click();
    await page
      .locator(".menu-dialog")
      .getByRole("link", { name: /Photography/ })
      .click();
    await expect(page).toHaveURL(/en\/photography/);
    await expect(page.locator(".menu-dialog")).not.toBeVisible();
  }
  if (info.project.name === "reduced") {
    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains("lenis"),
      ),
    ).toBeFalsy();
    await expect(page.locator(".page-wipe")).toBeHidden();
  }
});

test("responsive widths, 200% reflow, axe and initial HTML", async ({
  page,
}) => {
  await page.goto("/en/");
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow ${width}`,
    ).toBeTruthy();
  }
  await page.setViewportSize({ width: 720, height: 500 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "";
  });
  const a11y = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    a11y.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  const response = await page.request.get("/en/");
  const html = await response.text();
  expect(html).toContain("[Nama Kamu]");
  expect(html).toContain("Information Systems");
});

test("repeated navigation, interrupted transitions and no missing route", async ({
  page,
}) => {
  await page.goto("/id/");
  for (let i = 0; i < 3; i++) {
    await page.locator(".hero .button").click();
    await expect(page).toHaveURL(/id\/projects/);
    await page.locator(".wordmark").click();
    await expect(page).toHaveURL(/id\/$/);
    await expect(page.locator("h1")).toBeVisible();
  }
  await page.locator(".hero .button").click();
  await page.goBack();
  await expect(page.locator(".page-wipe")).not.toBeInViewport({
    timeout: 4000,
  });
});
