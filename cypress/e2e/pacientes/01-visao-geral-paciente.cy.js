describe("Visao Geral do Paciente pelo Profissional", () => {
  let pacienteId;
  let emailPaciente;

  before(() => {
    cy.loginViaApi("profissional");
    emailPaciente = Cypress.env("usuarios").paciente.email;
    cy.obterPacienteDeTeste().then((p) => {
      pacienteId = p.id;
    });
  });

  beforeEach(() => {
    cy.loginViaApi("profissional");
  });

  it("acessa visao geral clicando em Ver na lista de pacientes", () => {
    cy.visit("/profissional/pacientes");
    // Mira a linha do paciente de teste (pelo e-mail) e clica em "Ver".
    cy.contains("tr", emailPaciente).contains("button", "Ver").click();
    cy.url().should("include", `/profissional/pacientes/${pacienteId}`);
    cy.contains("Visão Geral").should("be.visible");
  });

  it("exibe abas e indicadores (KPIs) do paciente", () => {
    cy.visit(`/profissional/pacientes/${pacienteId}`);

    // Abas
    cy.contains("button", "Visão Geral").should("be.visible");
    cy.contains("button", "Humor").should("be.visible");
    cy.contains("button", "Medicamentos").should("be.visible");
    cy.contains("button", "Hábitos").should("be.visible");
    cy.contains("button", "Prontuário").should("be.visible");

    // KPIs
    cy.contains("Média humor").should("be.visible");
    cy.contains("Adesão medicação").should("be.visible");
    cy.contains("Média água").should("be.visible");
  });

  it("exibe a identificacao do paciente no topo", () => {
    cy.visit(`/profissional/pacientes/${pacienteId}`);
    cy.obterPacienteDeTeste().then((p) => {
      const rotulo =
        `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || emailPaciente;
      cy.contains(rotulo).should("be.visible");
    });
  });

  it("aba Prontuario navega para o prontuario do paciente", () => {
    cy.visit(`/profissional/pacientes/${pacienteId}`);
    cy.contains("button", "Prontuário").click();
    cy.url().should("include", `/profissional/prontuario/${pacienteId}`);
  });

  it("aba Medicamentos navega para a pagina de medicamentos", () => {
    cy.visit(`/profissional/pacientes/${pacienteId}`);
    cy.contains("button", "Medicamentos").click();
    cy.url().should("include", `/profissional/medicamentos/${pacienteId}`);
  });

  it("botao Voltar retorna para a lista de pacientes", () => {
    cy.visit(`/profissional/pacientes/${pacienteId}`);
    cy.contains("button", "Voltar").click();
    cy.url().should("include", "/profissional/pacientes");
    cy.url().should("not.include", pacienteId);
  });

  it("medicamentos prescritos aparecem na aba Medicamentos do paciente", () => {
    cy.criarMedicamentoApi(pacienteId, {
      name: "Amitriptilina",
      dosage: "25mg",
      time: "21:00",
      observation: null,
    });

    cy.visit(`/profissional/pacientes/${pacienteId}`);
    cy.contains("button", "Medicamentos").click();
    cy.url().should("include", `/profissional/medicamentos/${pacienteId}`);
    cy.contains("Amitriptilina").should("be.visible");
    cy.contains("25mg").should("be.visible");

    cy.limparMedicamentosDoPaciente(pacienteId);
  });

  it("visao geral retorna 403 para paciente nao vinculado", () => {
    const apiUrl = Cypress.env("apiUrl");
    cy.request({
      method: "GET",
      url: `${apiUrl}/patients/00000000-0000-0000-0000-000000000000/overview`,
      failOnStatusCode: false,
    })
      .its("status")
      .should("eq", 403);
  });
});
