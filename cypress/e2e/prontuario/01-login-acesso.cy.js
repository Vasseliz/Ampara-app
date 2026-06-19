describe("Prontuario - login e acesso", () => {
  it("profissional consegue logar pela UI e abrir a tela de prontuario", () => {
    cy.loginUi("profissional");
    cy.location("pathname", { timeout: 10000 }).should("eq", "/");

    cy.visit("/profissional/prontuario");
    cy.contains("h1", /prontu[áa]rio/i).should("exist");
    cy.get(".prontuario__select-label").contains("Paciente").should("be.visible");
  });

  it("senha incorreta nao loga e mostra mensagem de erro", () => {
    const usuarios = Cypress.env("usuarios");
    cy.visit("/login");
    cy.get("#email").type(usuarios.profissional.email);
    cy.get("#password").type("SenhaErrada123!", { log: false });
    cy.contains("button", "Entrar").click();

    cy.contains(/incorret/i, { timeout: 10000 }).should("be.visible");
    cy.location("pathname").should("eq", "/login");
  });

  it("dropdown lista o paciente de teste apos login", () => {
    cy.loginViaApi("profissional");
    cy.visit("/profissional/prontuario");

    const usuarios = Cypress.env("usuarios");
    cy.obterPacienteDeTeste().then((paciente) => {
      const rotulo =
        `${paciente.firstName ?? ""} ${paciente.lastName ?? ""}`.trim() ||
        usuarios.paciente.email;
      // O Select e customizado: as opcoes so existem no DOM com o dropdown aberto.
      cy.get('[data-cy="select-paciente"]').click();
      cy.get('[data-cy="select-paciente"]')
        .parent()
        .contains('li[role="option"]', rotulo)
        .should("exist");
    });
  });
});
