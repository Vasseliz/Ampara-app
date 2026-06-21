import { expect, type Locator } from "@playwright/test";
import { runStep } from "./steps";

export async function clickWhenReady(locator: Locator, label: string, timeout = 15000): Promise<void> {
  await runStep(`Clicar em ${label}`, async () => {
    await locator.waitFor({ state: "visible", timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click({ timeout });
  });
}

export async function fillAndAssert(locator: Locator, value: string, label: string, timeout = 15000): Promise<void> {
  await runStep(`Preencher ${label}`, async () => {
    await locator.waitFor({ state: "visible", timeout });
    await locator.fill(value, { timeout });
    await expect(locator).toHaveValue(value, { timeout });
  });
}

export async function clickIfVisible(locator: Locator, label: string, timeout = 2000): Promise<boolean> {
  return runStep(`Clicar opcionalmente em ${label}`, async () => {
    if ((await locator.count()) === 0) {
      return false;
    }

    const target = locator.first();
    const visible = await target.isVisible().catch(() => false);
    if (!visible) {
      return false;
    }

    await target.click({ timeout });
    return true;
  });
}

export async function waitForHidden(locator: Locator, label: string, timeout = 15000): Promise<void> {
  await runStep(`Aguardar ${label} desaparecer`, async () => {
    if ((await locator.count()) === 0) {
      return;
    }

    await locator.first().waitFor({ state: "hidden", timeout });
  });
}
