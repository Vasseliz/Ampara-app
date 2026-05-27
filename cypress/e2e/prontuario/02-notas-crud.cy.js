function hojeIso() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

describe("Prontuario - CRUD de anotacoes", () => {
  let pacienteId;

  before(() => {
    cy.loginViaApi("profissional");
    cy.obterPacienteDeTeste().then((p) => {
      pacienteId = p.id;
      cy.limparNotasDoPaciente(pacienteId);
    });
  });

  beforeEach(() => {
    cy.loginViaApi("profissional");
    cy.on("window:confirm", () => true);
  });

  afterEach(() => {
    if (pacienteId) {
      cy.limparNotasDoPaciente(pacienteId);
    }
  });

  it("cria uma nova anotacao pelo formulario", () => {
    cy.visit(`/profissional/prontuario/${pacienteId}`);

    cy.contains("button", "Nova nota").click();
    cy.get('[role="dialog"]').should("be.visible");

    cy.get('input[type="date"]').first().type(hojeIso());
    cy.get('[role="dialog"]').find("select").first().select("individual");
    cy.get('[role="dialog"]')
      .find("textarea")
      .type("Sessao de teste E2E - criacao");

    cy.contains("button", /salvar/i).click();

    cy.get('[role="dialog"]').should("not.exist");
    cy.contains(/anota[çc][ãa]o salva/i, { timeout: 8000 }).should("be.visible");
    cy.contains("Sessao de teste E2E - criacao").should("be.visible");
    cy.contains(/1 nota\(s\)/).should("be.visible");
  });

  it("expandir a nota mostra conteudo completo e acoes", () => {
    cy.criarNotaApi(pacienteId, {
      sessionDate: hojeIso(),
      sessionType: "individual",
      content: "Conteudo para expandir",
      nextSessionDate: null,
    });

    cy.visit(`/profissional/prontuario/${pacienteId}`);
    cy.contains(".note-card", "Conteudo para expandir")
      .find(".note-card__header")
      .click();

    cy.contains(".note-card", "Conteudo para expandir").within(() => {
      cy.contains("button", "Editar").should("be.visible");
      cy.contains("button", "Excluir").should("be.visible");
    });
  });

  it("edita uma anotacao existente", () => {
    cy.criarNotaApi(pacienteId, {
      sessionDate: hojeIso(),
      sessionType: "individual",
      content: "Conteudo original",
      nextSessionDate: null,
    });

    cy.visit(`/profissional/prontuario/${pacienteId}`);
    cy.contains(".note-card", "Conteudo original")
      .find(".note-card__header")
      .click();
    cy.contains(".note-card", "Conteudo original")
      .contains("button", "Editar")
      .click();

    cy.get('[role="dialog"]').should("be.visible");
    cy.get('[role="dialog"]')
      .find("textarea")
      .clear()
      .type("Conteudo editado");
    cy.get('[role="dialog"]').find("select").first().select("grupo");
    cy.contains("button", /salvar/i).click();

    cy.get('[role="dialog"]').should("not.exist");
    cy.contains(/anota[çc][ãa]o atualizada/i, { timeout: 8000 }).should(
      "be.visible"
    );
    cy.contains("Conteudo editado").should("be.visible");
    cy.contains(".note-card", "Conteudo editado")
      .contains(/grupo/i)
      .should("be.visible");
  });

  it("exclui uma anotacao", () => {
    cy.criarNotaApi(pacienteId, {
      sessionDate: hojeIso(),
      sessionType: "individual",
      content: "Conteudo para excluir",
      nextSessionDate: null,
    });

    cy.visit(`/profissional/prontuario/${pacienteId}`);
    cy.contains(".note-card", "Conteudo para excluir")
      .find(".note-card__header")
      .click();
    cy.contains(".note-card", "Conteudo para excluir")
      .contains("button", "Excluir")
      .click();

    cy.contains(/anota[çc][ãa]o removida/i, { timeout: 8000 }).should(
      "be.visible"
    );
    cy.contains("Conteudo para excluir").should("not.exist");
    cy.contains(/0 nota\(s\)/).should("be.visible");
  });

  it("nao envia POST quando faltam campos obrigatorios", () => {
    const apiUrl = Cypress.env("apiUrl");
    cy.intercept("POST", `${apiUrl}/prontuario/${pacienteId}`).as("criar");

    cy.visit(`/profissional/prontuario/${pacienteId}`);
    cy.contains("button", "Nova nota").click();
    cy.get('[role="dialog"]').should("be.visible");

    cy.contains("button", /salvar/i).click();

    cy.get('[role="dialog"]').should("be.visible");
    cy.wait(500);
    cy.get("@criar.all").should("have.length", 0);
  });
});
