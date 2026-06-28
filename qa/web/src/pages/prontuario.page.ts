import { expect, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class ProntuarioPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(patientId?: string): Promise<void> {
    await this.goto(patientId ? `/profissional/prontuario/${patientId}` : "/profissional/prontuario");
    await expect(this.page.getByRole("heading", { name: "Prontuário", exact: true })).toBeVisible();
  }

  async expectPatientSelected(patientId: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`/profissional/prontuario/${patientId}$`));
  }

  async createNote(content: string): Promise<void> {
    await this.page.getByRole("button", { name: /nova nota|criar primeira/i }).click();
    const dialog = this.page.getByRole("dialog", { name: /anotação clínica/i });
    await dialog.locator('input[type="date"]').first().fill(new Date().toISOString().slice(0, 10));
    await dialog.getByPlaceholder(/registre suas observações/i).fill(content);
    await dialog.getByRole("button", { name: /salvar no prontuário/i }).click();
    await expect(this.page.getByText(content, { exact: true })).toBeVisible();
  }

  async editNote(oldContent: string, newContent: string): Promise<void> {
    const card = this.page.locator("article").filter({ hasText: oldContent });
    await card.click();
    await card.getByRole("button", { name: /editar/i }).click();
    const dialog = this.page.getByRole("dialog", { name: /anotação clínica/i });
    const textarea = dialog.getByPlaceholder(/registre suas observações/i);
    await textarea.fill(newContent);
    await dialog.getByRole("button", { name: /salvar alterações/i }).click();
    await expect(this.page.getByText(newContent, { exact: true })).toBeVisible();
  }

  async deleteNote(content: string): Promise<void> {
    this.page.once("dialog", (dialog) => dialog.accept());
    const card = this.page.locator("article").filter({ hasText: content });
    await card.click();
    await card.getByRole("button", { name: /excluir/i }).click();
    await expect(this.page.getByText(content, { exact: true })).toHaveCount(0);
  }

  async filterPatient(patientId: string): Promise<void> {
    await this.page.getByTestId("select-paciente").click();
    await this.page.locator(`[role="option"][data-value="${patientId}"]`).click();
    await expect(this.page).toHaveURL(new RegExp(`/profissional/prontuario/${patientId}$`));
  }
}
