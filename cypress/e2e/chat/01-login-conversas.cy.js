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
    cy.get(".select__trigger").click();
    cy.get(".select__option").then(($options) => {
      if ($options.length > 1) {
        cy.get(".select__option").eq(1).click();
        cy.contains(/mensagens/).should("be.visible");
      }
    });
  });
});
