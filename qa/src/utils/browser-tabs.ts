import { type BrowserContext, type Page } from "@playwright/test";

async function waitForUsablePage(page: Page, waitUntil: "load" | "domcontentloaded" | "networkidle"): Promise<void> {
  await page.waitForLoadState(waitUntil).catch(() => undefined);

  for (let attempt = 0; attempt < 10; attempt += 1) {
    if (page.isClosed()) {
      return;
    }

    const currentUrl = page.url().trim().toLowerCase();
    const bodyChildCount = await page.locator("body > *").count().catch(() => 0);
    const bodyText = ((await page.locator("body").textContent().catch(() => "")) ?? "").trim();

    if (currentUrl !== "about:blank" || bodyChildCount > 0 || bodyText.length > 0) {
      return;
    }

    await page.waitForLoadState("domcontentloaded").catch(() => undefined);
  }
}

export async function waitForNewPage(
  context: BrowserContext,
  trigger: () => Promise<void>,
  waitUntil: "load" | "domcontentloaded" | "networkidle" = "domcontentloaded"
): Promise<Page> {
  const newPagePromise = context.waitForEvent("page");

  await trigger();

  const newPage = await newPagePromise;
  await waitForUsablePage(newPage, waitUntil);
  return newPage;
}
