import { expect, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class CofrePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto("/cofre");
    await expect(this.page.getByRole("heading", { name: "O Cofre", exact: true })).toBeVisible();
  }

  async create(content: string): Promise<void> {
    await this.page.getByPlaceholder(/como você está se sentindo hoje/i).fill(content);
    await this.page.getByRole("button", { name: /guardar no cofre/i }).click();
    await expect(this.page.getByText(content, { exact: true })).toBeVisible();
  }

  async remove(content: string): Promise<void> {
    const item = this.page.locator('[class*="annotations__item"]').filter({ hasText: content });
    await item.locator("svg").last().click();
    await item.getByRole("button", { name: /apagar/i }).click();
    await expect(this.page.getByText(content, { exact: true })).toHaveCount(0);
  }
}
