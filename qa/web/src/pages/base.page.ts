import { type Locator, type Page, expect } from "@playwright/test";
import { runStep } from "../utils/steps";
import {
  clickIfVisible,
  clickWhenReady,
  fillAndAssert,
  waitForHidden,
} from "../utils/ui-actions";

function isTransientNavigationError(error: unknown): boolean {
  const message = String(error);

  return [
    "ERR_CONNECTION_RESET",
    "ERR_CONNECTION_CLOSED",
    "ERR_CONNECTION_TIMED_OUT",
    "ERR_HTTP2_PROTOCOL_ERROR",
    "ERR_NETWORK_CHANGED",
  ].some((fragment) => message.includes(fragment));
}

export class BasePage {
  constructor(protected readonly page: Page) {}

  protected byTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  async goto(pathOrUrl = "/"): Promise<void> {
    await runStep(`Abrir ${pathOrUrl}`, async () => {
      let lastError: unknown;

      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          await this.page.goto(pathOrUrl);
          return;
        } catch (error) {
          lastError = error;

          if (!isTransientNavigationError(error) || attempt === 2) {
            throw error;
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      throw lastError;
    });
  }

  async waitForAppReady(): Promise<void> {
    await runStep("Aguardar a aplicacao estabilizar", async () => {
      await this.page.waitForLoadState("networkidle").catch(() => undefined);
    });
  }

  async fillByTestId(
    testId: string,
    value: string,
    label = testId,
  ): Promise<void> {
    await fillAndAssert(this.byTestId(testId), value, label);
  }

  async clickByTestId(testId: string, label = testId): Promise<void> {
    await clickWhenReady(this.byTestId(testId), label);
  }

  async clickIfVisible(selector: string, label: string): Promise<boolean> {
    return clickIfVisible(this.page.locator(selector), label);
  }

  async waitForHidden(
    selector: string,
    label: string,
    timeout?: number,
  ): Promise<void> {
    await waitForHidden(this.page.locator(selector), label, timeout);
  }

  async expectUrlToContain(fragment: string): Promise<void> {
    await runStep(`Validar URL contem ${fragment}`, async () => {
      await expect(this.page).toHaveURL(
        new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      );
    });
  }

  async saveStorageState(outputPath: string): Promise<void> {
    await runStep(`Salvar storage state em ${outputPath}`, async () => {
      await this.page.context().storageState({ path: outputPath });
    });
  }
}
