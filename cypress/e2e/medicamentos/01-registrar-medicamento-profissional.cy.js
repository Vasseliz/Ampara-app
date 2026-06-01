describe("Medicamentos - Registro pelo Profissional", () => {
  let pacienteId;

  before(() => {
    cy.loginViaApi("profissional");
    cy.obterPacienteDeTeste().then((p) => {
      pacienteId = p.id;
      cy.limparMedicamentosDoPaciente(pacienteId);
    });
  });

  beforeEach(() => {
    cy.loginViaApi("profissional");
    cy.on("window:confirm", () => true);
  });

  afterEach(() => {
    if (pacienteId) {
      cy.limparMedicamentosDoPaciente(pacienteId);
    }
  });

  it("exibe a pagina de medicamentos com seletor de paciente", () => {
    cy.visit("/profissional/medicamentos");
    cy.contains("Medicamentos").should("be.visible");
    cy.contains("Selecione um paciente").should("be.visible");
    cy.get("select").should("be.visible");
  });

  it("navega para medicamentos do paciente via seletor", () => {
    cy.visit("/profissional/medicamentos");
    cy.get("select").select(pacienteId);
    cy.url().should("include", `/profissional/medicamentos/${pacienteId}`);
    cy.contains("Novo medicamento").should("be.visible");
  });

  it("cria um medicamento pelo formulario", () => {
    cy.visit(`/profissional/medicamentos/${pacienteId}`);

    cy.contains("button", "Novo medicamento").click();
    cy.get('[role="dialog"]').should("be.visible");

    cy.get("#med-name").type("Fluoxetina");
    cy.get("#med-dosage").type("20mg");
    cy.get("#med-time").type("08:00");
    cy.get("#med-obs").type("Tomar em jejum");

    cy.contains("button", "Salvar").click();

    cy.get('[role="dialog"]').should("not.exist");
    cy.contains(/medicamento registrado/i, { timeout: 8000 }).should("be.visible");
    cy.contains("Fluoxetina").should("be.visible");
    cy.contains("20mg").should("be.visible");
    cy.contains("Ativo").first().should("be.visible");
  });

  it("nao salva sem campos obrigatorios", () => {
    cy.visit(`/profissional/medicamentos/${pacienteId}`);
    cy.contains("button", "Novo medicamento").click();
    cy.get('[role="dialog"]').should("be.visible");

    cy.contains("button", "Salvar").click();

    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("Informe o nome").should("be.visible");
  });

  it("edita um medicamento existente", () => {
    cy.criarMedicamentoApi(pacienteId, {
      name: "Sertralina",
      dosage: "50mg",
      time: "07:00",
      observation: null,
    });

    cy.visit(`/profissional/medicamentos/${pacienteId}`);
    cy.contains("Sertralina").should("be.visible");

    cy.contains("Sertralina")
      .closest("[data-testid='med-item']")
      .find("[aria-label='Editar']")
      .click();

    cy.get('[role="dialog"]').should("be.visible");
    cy.get("#med-dosage").clear().type("100mg");
    cy.contains("button", "Salvar").click();

    cy.get('[role="dialog"]').should("not.exist");
    cy.contains(/atualizado/i, { timeout: 8000 }).should("be.visible");
    cy.contains("100mg").should("be.visible");
  });

  it("desativa um medicamento", () => {
    cy.criarMedicamentoApi(pacienteId, {
      name: "Rivotril",
      dosage: "0.5mg",
      time: "22:00",
      observation: null,
    });

    cy.visit(`/profissional/medicamentos/${pacienteId}`);
    cy.contains("Rivotril").should("be.visible");

    cy.contains("Rivotril")
      .closest("[data-testid='med-item']")
      .find("[aria-label='Desativar']")
      .click();

    cy.contains(/desativado/i, { timeout: 8000 }).should("be.visible");
    cy.contains("Inativo").should("be.visible");
  });

  it("acessa medicamentos do paciente pela lista de pacientes", () => {
    cy.visit("/profissional/pacientes");
    cy.contains("button", "Ver").first().click();
    cy.url().should("match", /\/profissional\/pacientes\/.+/);
    cy.contains("Gerenciar medicamentos").click();
    cy.url().should("match", /\/profissional\/medicamentos\/.+/);
  });
});
