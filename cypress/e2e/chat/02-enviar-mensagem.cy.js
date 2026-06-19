describe("Chat - Enviar Mensagem", () => {
  beforeEach(() => {
    cy.loginViaApi("profissional");
    cy.visit("/chat");
    // Seleciona a primeira conversa real no Select customizado.
    cy.get('[data-cy="select-conversa"]').should("be.visible").click();
    cy.get('[data-cy="select-conversa"]')
      .parent()
      .find('li[role="option"]')
      .not('[data-value=""]')
      .first()
      .click();
  });

  it("envia uma mensagem e aparece na conversa", () => {
    const msg = `Teste de mensagem E2E ${Date.now()}`;
    cy.get("textarea").type(msg);
    cy.contains("button", "Enviar").click();

    cy.contains(msg).should("be.visible");
  });

  it("desabilita botao enviar quando textarea vazio", () => {
    cy.get("textarea").should("have.value", "");
    cy.contains("button", "Enviar").should("be.disabled");
  });
});
