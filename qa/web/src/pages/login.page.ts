import { expect, type Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { getAppEnv } from "../config/env";

export type LoginCredentials = { email: string; senha: string };
export type SessionCredentials = LoginCredentials & { token: string };

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto("/login");
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.open();
    await this.page.locator("#email").fill(credentials.email);
    await this.page.locator("#password").fill(credentials.senha);
    await this.page.getByRole("button", { name: /^entrar$/i }).click();
  }

  async loginSuccessfully(credentials: LoginCredentials): Promise<void> {
    await this.login(credentials);
    await expect(this.page.getByTestId("app-shell")).toBeVisible();
  }

  async authenticate(credentials: SessionCredentials): Promise<void> {
    await this.page.context().addCookies([
      {
        name: "mc_session",
        value: credentials.token,
        url: getAppEnv().urls.api,
        httpOnly: true,
        sameSite: "Lax",
      },
    ]);
    await this.goto("/");
    await expect(this.page.getByTestId("app-shell")).toBeVisible();
  }

  async expectError(): Promise<void> {
    await expect(
      this.page.getByText("E-mail ou senha incorretos.", { exact: true }),
    ).toBeVisible();
    await expect(this.page).toHaveURL(/\/login$/);
  }

  async logout(): Promise<void> {
    await this.page.getByRole("button", { name: /sair/i }).click();
    await expect(this.page).toHaveURL(/\/login$/);
  }
}
