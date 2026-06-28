import { expect, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class ChatPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto("/chat");
    await expect(this.page.getByRole("heading", { name: "Chat", exact: true })).toBeVisible();
  }

  async selectFirstConversation(): Promise<void> {
    const select = this.page.getByTestId("select-conversa");
    await expect(select).toBeVisible();
    await select.click();
    const options = this.page.getByRole("option");
    if ((await options.count()) < 2) throw new Error("Nenhuma conversa disponível");
    await options.nth(1).click();
  }

  async expectConversationList(): Promise<void> {
    await this.page.getByTestId("select-conversa").click();
    await expect(this.page.getByRole("option").nth(1)).toBeVisible();
  }

  async send(message: string): Promise<void> {
    await this.selectFirstConversation();
    await this.page.getByPlaceholder(/escreva uma mensagem/i).fill(message);
    await this.page.getByRole("button", { name: /^enviar$/i }).click();
    await expect(this.page.getByText(message, { exact: true })).toBeVisible();
  }
}
