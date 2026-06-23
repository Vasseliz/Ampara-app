import { expect, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class HabitosPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto("/habitos");
    await expect(this.page.getByText("Registros de Hoje")).toBeVisible();
  }

  private exerciseCheckbox() {
    return this.page.locator("#check-toggle");
  }

  private exerciseToggle() {
    return this.page.locator('label[for="check-toggle"]');
  }

  async markExercise(): Promise<void> {
    await this.exerciseToggle().click();
    await expect(this.exerciseCheckbox()).toBeChecked();
    await expect(this.page.getByText(/parabéns/i)).toBeVisible();
  }

  async unmarkExercise(): Promise<void> {
    await this.exerciseToggle().click();
    await expect(this.exerciseCheckbox()).not.toBeChecked();
    await expect(this.page.getByText(/ainda nao/i)).toBeVisible();
  }

  async submit(): Promise<void> {
    if (!(await this.page.getByText(/parabéns/i).isVisible())) await this.markExercise();
    await this.page.locator('input[type="range"]').nth(0).fill("8");
    await this.page.locator('input[type="range"]').nth(1).fill("2");
    await this.page.getByRole("button", { name: /^registrar$/i }).click();
    await expect(this.page.getByRole("heading", { name: "Histórico", exact: true })).toBeVisible();
  }
}
