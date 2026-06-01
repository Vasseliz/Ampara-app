describe("Chat - Enviar Mensagem", () => {
  beforeEach(() => {
    cy.loginViaApi("profissional");
    cy.visit("/chat");
  });

  it("envia uma mensagem e aparece na conversa", () => {
    cy.get(".chat__conversation-select").should("be.visible");
    cy.get(".chat__conversation-select").then(($select) => {
      if ($select.find("option").length > 1) {
        cy.get(".chat__conversation-select").select(1);
        cy.get("textarea").type("Teste de mensagem E2E");
        cy.contains("button", "Enviar").click();

        cy.contains("Teste de mensagem E2E").should("be.visible");
      }
    });
  });

  it("desabilita botao enviar quando textarea vazio", () => {
    cy.get(".chat__conversation-select").should("be.visible");
    cy.get(".chat__conversation-select").then(($select) => {
      if ($select.find("option").length > 1) {
        cy.get(".chat__conversation-select").select(1);
        cy.contains("button", "Enviar").should("be.disabled");
      }
    });
  });
});
