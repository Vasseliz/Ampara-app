describe("Chat - Login e Conversas", () => {
  beforeEach(() => {
    cy.loginViaApi("profissional");
    cy.visit("/chat");
  });

  it("carrega a pagina de chat e lista conversas", () => {
    cy.contains("Chat").should("be.visible");
    cy.contains("Conversa compartilhada entre paciente e profissional").should(
      "be.visible"
    );
  });

  it("seleciona uma conversa e carrega mensagens", () => {
    cy.visit("/chat");

    // Abre o Select customizado de conversa e escolhe a primeira conversa real.
    cy.get('[data-cy="select-conversa"]').should("be.visible").click();
    cy.get('[data-cy="select-conversa"]')
      .parent()
      .find('li[role="option"]')
      .not('[data-value=""]')
      .first()
      .click();

    // Com uma conversa selecionada, some o placeholder e a thread passa a mostrar
    // mensagens ou o estado "Ainda nao ha mensagens nesta conversa.".
    cy.contains("Selecione uma conversa para começar").should("not.exist");
  });
});
