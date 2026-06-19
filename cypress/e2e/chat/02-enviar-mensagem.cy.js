describe("Chat - Enviar Mensagem", () => {
  beforeEach(() => {
    cy.loginViaApi("profissional");
    cy.visit("/chat");
  });

  it("envia uma mensagem e aparece na conversa", () => {
    cy.get(".select__trigger").click();
    cy.get(".select__option").then(($options) => {
      if ($options.length > 1) {
        cy.get(".select__option").eq(1).click();
        cy.get("textarea").type("Teste de mensagem E2E");
        cy.contains("button", "Enviar").click();
        cy.contains("Teste de mensagem E2E").should("be.visible");
      }
    });
  });

  it("desabilita botao enviar quando textarea vazio", () => {
    cy.get(".select__trigger").click();
    cy.get(".select__option").then(($options) => {
      if ($options.length > 1) {
        cy.get(".select__option").eq(1).click();
        cy.contains("button", "Enviar").should("be.disabled");
      }
    });
  });
});
