function obterCredencial(papel) {
  const usuarios = Cypress.env("usuarios") || {};
  const cred = usuarios[papel];
  if (!cred || !cred.email || !cred.password) {
    throw new Error(
      `Credencial para o papel "${papel}" nao encontrada em cypress.env.json.`
    );
  }
  return cred;
}

Cypress.Commands.add("loginViaApi", (papel = "profissional") => {
  const { email, password } = obterCredencial(papel);
  const apiUrl = Cypress.env("apiUrl");

  cy.session(
    [papel, email],
    () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/auth/login`,
        body: { email, password },
      })
        .its("status")
        .should("eq", 200);
    },
    {
      validate() {
        cy.request({
          method: "GET",
          url: `${apiUrl}/auth/me`,
          failOnStatusCode: false,
        })
          .its("status")
          .should("eq", 200);
      },
      cacheAcrossSpecs: true,
    }
  );
});

Cypress.Commands.add("loginUi", (papel = "profissional") => {
  const { email, password } = obterCredencial(papel);
  cy.visit("/login");
  cy.get("#email").type(email);
  cy.get("#password").type(password, { log: false });
  cy.contains("button", "Entrar").click();
});


Cypress.Commands.add("obterPacienteDeTeste", () => {
  const apiUrl = Cypress.env("apiUrl");
  const { email } = obterCredencial("paciente");

  return cy
    .request({ method: "GET", url: `${apiUrl}/patients` })
    .then((res) => {
      expect(res.status).to.eq(200);
      const lista = Array.isArray(res.body) ? res.body : [];
      const paciente = lista.find(
        (p) => (p.email || "").toLowerCase() === email.toLowerCase()
      );
      if (!paciente) {
        throw new Error(
          `Paciente de teste "${email}" nao encontrado em GET /patients. ` +
            `Garanta que ele esta vinculado ao profissional de teste.`
        );
      }
      return cy.wrap(paciente, { log: false });
    });
});


Cypress.Commands.add("criarNotaApi", (pacienteId, payload) => {
  const apiUrl = Cypress.env("apiUrl");
  return cy
    .request({
      method: "POST",
      url: `${apiUrl}/prontuario/${pacienteId}`,
      body: payload,
    })
    .then((res) => {
      expect(res.status).to.eq(201);
      return cy.wrap(res.body.id, { log: false });
    });
});


Cypress.Commands.add("limparNotasDoPaciente", (pacienteId) => {
  const apiUrl = Cypress.env("apiUrl");
  const ano = new Date().getFullYear();

  return cy
    .request({
      method: "GET",
      url: `${apiUrl}/prontuario/${pacienteId}?year=${ano}&month=all`,
      failOnStatusCode: false,
    })
    .then((res) => {
      if (res.status !== 200 || !Array.isArray(res.body)) return;
      const ids = res.body.map((n) => n.id).filter(Boolean);
      ids.forEach((id) => {
        cy.request({
          method: "DELETE",
          url: `${apiUrl}/prontuario/${pacienteId}/notes/${id}`,
          failOnStatusCode: false,
        });
      });
    });
});
