describe("Chat - Login e Conversas", () => {
  beforeEach(() => {
    cy.loginViaApi("profissional");
  });

  it("carrega a pagina de chat e lista conversas", () => {
    cy.visit("/chat");

    cy.contains("Chat").should("be.visible");
    cy.contains("Conversa compartilhada entre paciente e profissional").should(
      "be.visible"
    );
  });

  it("seleciona uma conversa e carrega mensagens", () => {
    cy.loginViaApi("profissional");
    cy.visit("/chat");

    cy.get(".chat__conversation-select").should("be.visible");
    cy.get(".chat__conversation-select").then(($select) => {
      if ($select.find("option").length > 1) {
        cy.get(".chat__conversation-select").select(1);
        cy.contains(/mensagens/).should("be.visible");
      }
    });
  });
});
