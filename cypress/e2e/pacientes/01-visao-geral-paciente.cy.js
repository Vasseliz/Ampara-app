describe("Visao Geral do Paciente pelo Profissional", () => {
  let pacienteId;

  before(() => {
    cy.loginViaApi("profissional");
    cy.obterPacienteDeTeste().then((p) => {
      pacienteId = p.id;
    });
  });

  beforeEach(() => {
    cy.loginViaApi("profissional");
  });

  it("acessa visao geral clicando em Ver na lista de pacientes", () => {
    cy.visit("/profissional/pacientes");
    cy.contains("button", "Ver").first().click();
    cy.url().should("include", `/profissional/pacientes/${pacienteId}`);
    cy.contains("Visão Geral").should("be.visible");
  });

  it("exibe secoes de dados do paciente", () => {
    cy.visit(`/profissional/pacientes/${pacienteId}`);

    cy.contains("Dados do paciente").should("be.visible");
    cy.contains("Medicamentos").should("be.visible");
    cy.contains("Humor").should("be.visible");
    cy.contains("Hábitos").should("be.visible");
    cy.contains("Últimas anotações").should("be.visible");
  });

  it("exibe o email do paciente na secao de dados", () => {
    cy.visit(`/profissional/pacientes/${pacienteId}`);

    const { email } = Cypress.env("usuarios")?.paciente ?? {};
    if (email) {
      cy.contains(email).should("be.visible");
    }
  });

  it("botao Ver prontuario navega para prontuario do paciente", () => {
    cy.visit(`/profissional/pacientes/${pacienteId}`);
    cy.contains("button", "Ver prontuário").first().click();
    cy.url().should("include", `/profissional/prontuario/${pacienteId}`);
  });

  it("link Gerenciar medicamentos navega para pagina de medicamentos", () => {
    cy.visit(`/profissional/pacientes/${pacienteId}`);
    cy.contains("Gerenciar medicamentos").click();
    cy.url().should("include", `/profissional/medicamentos/${pacienteId}`);
  });

  it("link voltar retorna para lista de pacientes", () => {
    cy.visit(`/profissional/pacientes/${pacienteId}`);
    cy.contains("Voltar para pacientes").click();
    cy.url().should("include", "/profissional/pacientes");
    cy.url().should("not.include", pacienteId);
  });

  it("mostra medicamentos registrados na visao geral", () => {
    cy.criarMedicamentoApi(pacienteId, {
      name: "Amitriptilina",
      dosage: "25mg",
      time: "21:00",
      observation: null,
    });

    cy.visit(`/profissional/pacientes/${pacienteId}`);
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
    }).its("status").should("eq", 403);
  });
});
