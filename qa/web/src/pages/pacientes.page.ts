import { expect, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class PacientesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto("/profissional/pacientes");
    await expect(this.page.getByRole("heading", { name: "Pacientes", exact: true })).toBeVisible();
  }

  async expectPatient(email: string): Promise<void> {
    await expect(this.page.getByText(email, { exact: true })).toBeVisible();
  }

  async invite(email: string): Promise<void> {
    await this.page.locator("#patient-email").fill(email);
    await this.page.getByRole("button", { name: /adicionar paciente/i }).click();
    await expect(this.page.getByText(email, { exact: true })).toBeVisible();
  }

  async openOverview(email: string): Promise<void> {
    const row = this.page.getByRole("row").filter({ hasText: email });
    await row.getByRole("button", { name: /ver/i }).click();
    await expect(this.page.getByRole("navigation", { name: /navegação do paciente/i })).toBeVisible();
  }

  async editClinicalInfo(customDiagnosis: string): Promise<void> {
    await this.page.getByRole("button", { name: /info clínica/i }).click();
    await this.page.getByRole("button", { name: "Depressão", exact: true }).click();
    await this.page.getByPlaceholder(/adicionar diagnóstico/i).fill(customDiagnosis);
    await this.page.getByRole("button", { name: /adicionar diagnóstico personalizado/i }).click();
    await this.page.getByRole("button", { name: /salvar informações clínicas/i }).click();
    await expect(this.page.getByText(customDiagnosis, { exact: true })).toBeVisible();
  }
}
