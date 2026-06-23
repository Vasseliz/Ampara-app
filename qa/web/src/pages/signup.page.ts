import { expect, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export type PatientSignup = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export class SignupPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async registerPatient(data: PatientSignup): Promise<void> {
    await this.goto("/cadastro");
    await this.page.getByRole("button", { name: /sou paciente/i }).click();
    await this.page.locator("#firstName").fill(data.firstName);
    await this.page.locator("#lastName").fill(data.lastName);
    await this.page.locator("#email").fill(data.email);
    await this.page.locator("#password").fill(data.password);
    await this.page.locator("#confirmPassword").fill(data.password);
    await this.page.getByRole("button", { name: /^criar conta$/i }).click();
    await expect(this.page).toHaveURL(/\/login$/, { timeout: 15_000 });
  }
}
