import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class MedicamentosPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openProfessional(patientId: string): Promise<void> {
    await this.goto(`/profissional/medicamentos/${patientId}`);
    await expect(this.page.getByText("Lista de medicamentos")).toBeVisible();
  }

  private medication(name: string): Locator {
    return this.page.getByTestId("med-item").filter({ hasText: name });
  }

  async create(name: string, dosage: string): Promise<void> {
    await this.page.getByRole("button", { name: /novo medicamento/i }).click();
    await this.page.locator("#med-name").fill(name);
    await this.page.locator("#med-dosage").fill(dosage);
    await this.page.locator("#med-time").fill("08:00");
    await this.page.getByRole("button", { name: /^salvar$/i }).click();
    await expect(this.medication(name)).toContainText(dosage);
  }

  async edit(name: string, dosage: string): Promise<void> {
    await this.medication(name).getByRole("button", { name: /editar/i }).click();
    await this.page.locator("#med-dosage").fill(dosage);
    await this.page.getByRole("button", { name: /^salvar$/i }).click();
    await expect(this.medication(name)).toContainText(dosage);
  }

  async deactivate(name: string): Promise<void> {
    await this.medication(name).getByRole("button", { name: /desativar/i }).click();
    const confirmation = this.page.getByRole("dialog", {
      name: "Desativar medicamento?",
    });
    await expect(confirmation).toBeVisible();
    await confirmation.getByRole("button", { name: /^desativar$/i }).click();
    await expect(this.medication(name)).toContainText("Inativo");
  }

  async openPatient(): Promise<void> {
    await this.goto("/medicamentos");
    await expect(this.page.getByRole("heading", { name: "Medicamentos", exact: true })).toBeVisible();
  }

  async expectPatientMedication(name: string): Promise<void> {
    await expect(this.page.getByText(name, { exact: true }).first()).toBeVisible();
  }

  async markTaken(name: string): Promise<void> {
    const row = this.page.locator('[class*="swipeRow"]').filter({ hasText: name });
    const box = await row.locator('[class*="medCard"]').boundingBox();
    if (!box) throw new Error(`Medicamento não encontrado para swipe: ${name}`);
    await this.page.mouse.move(box.x + 20, box.y + box.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(box.x + box.width - 10, box.y + box.height / 2, { steps: 12 });
    await this.page.mouse.up();
    await expect(this.page.getByText(/progresso de hoje/i)).toContainText("1/");
  }
}
