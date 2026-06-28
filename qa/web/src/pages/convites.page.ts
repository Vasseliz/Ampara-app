import { expect, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class ConvitesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto("/convites");
    await expect(this.page.getByRole("heading", { name: "Convites", exact: true })).toBeVisible();
  }

  async expectPending(professionalEmail: string): Promise<void> {
    await expect(this.page.getByText(professionalEmail, { exact: true })).toBeVisible();
    await expect(this.page.getByText("Pendente", { exact: true })).toBeVisible();
  }

  async accept(professionalEmail: string): Promise<void> {
    const card = this.page.locator("section").filter({ hasText: professionalEmail }).last();
    await card.getByRole("button", { name: /aceitar convite/i }).click();
    await expect(this.page.getByText(professionalEmail, { exact: true })).toHaveCount(0);
  }
}
