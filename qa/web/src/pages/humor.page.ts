import { expect, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class HumorPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openPatient(): Promise<void> {
    await this.goto("/humor");
    await expect(this.page.getByRole("heading", { name: "Humor", exact: true })).toBeVisible();
  }

  async register(score: number, note: string): Promise<void> {
    await this.page.locator('input[type="range"]').fill(String(score));
    await this.page.getByPlaceholder(/como você está se sentindo/i).fill(note);
    await this.page.getByRole("button", { name: /^registrar$/i }).click();
    await expect(this.page.getByText(note, { exact: true })).toBeVisible();
  }

  async expectHistory(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Histórico", exact: true })).toBeVisible();
    await expect(this.page.locator('[class*="entry"]').first()).toBeVisible();
  }

  async openProfessional(patientId: string): Promise<void> {
    await this.goto(`/profissional/humor/${patientId}`);
    await expect(this.page.getByText(/registros individuais|resumo/i).first()).toBeVisible();
  }
}
