import { test, expect } from "@playwright/test";

test("exemplo — substitua por testes do seu projeto", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/.*/);
});
