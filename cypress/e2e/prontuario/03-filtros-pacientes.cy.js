function pad(n) {
  return String(n).padStart(2, "0");
}

function dataNoMes(ano, mes, dia = 5) {
  return `${ano}-${pad(mes)}-${pad(dia)}`;
}

describe("Prontuario - filtros e selecao de paciente", () => {
  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth() + 1;
  const mesAntigo = mesAtual > 2 ? mesAtual - 2 : mesAtual + 2;

  let pacienteId;

  before(() => {
    cy.loginViaApi("profissional");
    cy.obterPacienteDeTeste().then((p) => {
      pacienteId = p.id;
    });
  });

  beforeEach(() => {
    cy.loginViaApi("profissional");
    cy.limparNotasDoPaciente(pacienteId);
    cy.criarNotaApi(pacienteId, {
      sessionDate: dataNoMes(anoAtual, mesAtual),
      sessionType: "individual",
      content: `Nota do mes ${pad(mesAtual)}`,
      nextSessionDate: null,
    });
    cy.criarNotaApi(pacienteId, {
      sessionDate: dataNoMes(anoAtual, mesAntigo),
      sessionType: "grupo",
      content: `Nota do mes ${pad(mesAntigo)}`,
      nextSessionDate: null,
    });
  });

  afterEach(() => {
    if (pacienteId) {
      cy.limparNotasDoPaciente(pacienteId);
    }
  });

  it("filtro de mes mostra apenas notas do mes selecionado", () => {
    cy.visit(`/profissional/prontuario/${pacienteId}`);
    cy.contains(/2 nota\(s\)/).should("be.visible");

    cy.escolherNoSelect("select-mes", { valor: pad(mesAtual) });
    cy.contains(/1 nota\(s\)/).should("be.visible");
    cy.contains(`Nota do mes ${pad(mesAtual)}`).should("be.visible");
    cy.contains(`Nota do mes ${pad(mesAntigo)}`).should("not.exist");
  });

  it('filtro "Todos os meses" mostra todas as notas do ano', () => {
    cy.visit(`/profissional/prontuario/${pacienteId}`);
    cy.escolherNoSelect("select-mes", { valor: pad(mesAtual) });
    cy.contains(/1 nota\(s\)/).should("be.visible");

    cy.escolherNoSelect("select-mes", { valor: "all" });
    cy.contains(/2 nota\(s\)/).should("be.visible");
    cy.contains(`Nota do mes ${pad(mesAtual)}`).should("be.visible");
    cy.contains(`Nota do mes ${pad(mesAntigo)}`).should("be.visible");
  });

  it("ano sem notas mostra estado vazio", () => {
    cy.visit(`/profissional/prontuario/${pacienteId}`);

    const anoAntigo = String(anoAtual - 2);
    cy.escolherNoSelect("select-ano", { valor: anoAntigo });

    cy.contains(/nenhuma anota[çc][ãa]o encontrada/i).should("be.visible");
  });

  it("trocar paciente no dropdown atualiza a URL e o header", () => {
    cy.visit("/profissional/prontuario");
    cy.contains(/escolha um paciente/i).should("be.visible");

    cy.escolherNoSelect("select-paciente", { valor: pacienteId });

    cy.location("pathname").should(
      "eq",
      `/profissional/prontuario/${pacienteId}`
    );
    cy.contains(/nota\(s\)/).should("be.visible");
  });

  it('botao "Nova nota" fica desabilitado sem paciente selecionado', () => {
    cy.visit("/profissional/prontuario");
    cy.contains("button", "Nova nota").should("be.disabled");
  });
});
