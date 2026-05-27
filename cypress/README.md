# Testes E2E - Ampara

Suite Cypress para a area de prontuario (e ponto de partida para outras areas).

## Setup inicial

1. Copie o template de credenciais:

   ```powershell
   Copy-Item cypress.env.example.json cypress.env.json
   ```

2. Edite `cypress.env.json` e preencha as senhas reais dos usuarios de teste do ambiente. O arquivo esta no `.gitignore` e nao deve ser versionado.

3. Suba o backend (.NET) em `http://localhost:5243` (quando subi com https também funcionou) e o frontend (Vite) em `http://localhost:5173`.

4. Garanta que `profissional@teste.com` ja possui o `paciente@teste.com` vinculado como paciente. Os testes assumem esse vinculo.

## Rodando

Da raiz do repositorio:

- `npm run cy:open` - abre o runner interativo (escolha "E2E Testing" -> browser).
- `npm run cy:run` - roda todos os specs em headless.
- `npm run cy:run:prontuario` - roda apenas a suite de prontuario.

## Estrutura

```
cypress/
  e2e/prontuario/
    01-login-acesso.cy.js     # fluxo de login e acesso a tela
    02-notas-crud.cy.js       # criar, expandir, editar, excluir, validacao
    03-filtros-pacientes.cy.js# filtros mes/ano, troca de paciente
  fixtures/
    nota-base.json            # payload exemplo para criar nota
  support/
    commands.js               # cy.loginViaApi, cy.loginUi, helpers de API
    e2e.js                    # entry point
```

## Custom commands disponiveis

- `cy.loginViaApi(papel)` - login programatico via `POST /auth/login`, com `cy.session()` cacheando o cookie. Use no `beforeEach` dos testes que ja partem logados.
- `cy.loginUi(papel)` - login pelo formulario real. Reservado para o spec de login.
- `cy.obterPacienteDeTeste()` - retorna o objeto do paciente de teste a partir de `GET /patients`.
- `cy.criarNotaApi(pacienteId, payload)` - cria nota via API e retorna o id. Use para popular estado sem passar pelo form.
- `cy.limparNotasDoPaciente(pacienteId)` - apaga todas as notas do ano corrente. Use em `afterEach` para isolar testes.

## Variaveis sobrescriviveis

- `CYPRESS_BASE_URL` - URL do frontend (default `http://localhost:5173`).
- `CYPRESS_apiUrl` - URL do backend (default `http://localhost:5243`).

Exemplo:

```powershell
$env:CYPRESS_apiUrl = "http://localhost:5243"
npm run cy:run:prontuario
```
