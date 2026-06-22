# Ampara — Suíte E2E (`qa/`)

Suíte de testes end-to-end do Ampara: **Fundação compartilhada** + **Stack 1**
(Playwright web + Maestro mobile) + **cenários cross-platform** (web↔app), com o
contrato de comportamento em **BDD (Gherkin)**.

> Base Playwright derivada de um harness de QA e adaptada ao Ampara (perfis
> `paciente`/`profissional`, seletor `data-cy`, login real do app).

## Estrutura

```
qa/
├── foundation/        FUNDAÇÃO — seed/cleanup/context via .NET API + Supabase (compartilhada)
├── features/          contrato BDD (10 .feature) — o "o quê", compartilhado web+mobile
├── web/               Stack 1 WEB — Playwright
│   ├── src/
│   │   ├── config/    env + configuração declarativa de login (auth.config.ts)
│   │   ├── fixtures/  fixtures de auth com storage-state por worker
│   │   ├── flows/     fluxo de autenticação genérico
│   │   ├── pages/     page objects (Track A preenche)
│   │   ├── reporters/ reporter de falhas
│   │   └── utils/     helpers (steps, ui-actions, file-helpers, abas)
│   ├── specs/         specs Playwright de UI (Track A)
│   └── playwright.config.ts
├── mobile/            Stack 1 MOBILE — Maestro (Track B); ver mobile/README.md e RUNNING-LOCAL.md
├── package.json · tsconfig.json · vitest.config.ts   (tooling compartilhado, na raiz)
```

`foundation/` e `features/` são o **núcleo compartilhado** (ambas as stacks
consomem). `web/` e `mobile/` são **stacks pares**, cada uma dona do seu config.

## Pré-requisitos

```bash
cd qa
npm install
npx playwright install     # browsers (para a Stack 1 web)
cp .env.example .env.local # e preencha (Supabase/API já vêm do appsettings)
```

A suíte assume:
- **backend** (.NET API) em `http://localhost:5243`
- **front web** (Vite) em `http://localhost:5173`

> Mobile tem pré-requisitos próprios (Maestro, emulador, build de teste) —
> ver **`mobile/RUNNING-LOCAL.md`**.

## Comandos

```bash
npm run typecheck       # tsc --noEmit
npm run seed:test       # valida a Fundação (unit + integração contra o backend)
npm run features:test   # valida o contrato BDD (parsing)
npm run unit:test       # tudo do Vitest (foundation + features)

npm run e2e:web         # Playwright (Stack 1 web) — usa web/playwright.config.ts
npm run e2e:web:headed  # com browser visível
npm run e2e:web:report  # report HTML

npm run e2e:mobile      # Maestro (Stack 1 mobile) — requer build de teste + emulador
npm run e2e:cross       # orquestrador cross-platform (web↔app)
```

> Os testes `*.integration.test.ts` da Fundação **pulam** automaticamente se as
> variáveis `E2E_*` não estiverem no `.env.local`.

## A Fundação (estado dos testes)

`foundation/` cria o estado conhecido na .NET API e o destrói depois. Use no setup:

```ts
import { seedParVinculado, limparRun } from "../foundation";

const ctx = await seedParVinculado();   // profissional + paciente vinculados
// ... use ctx.profissional / ctx.paciente / ctx.pacienteId / ctx.deepLink
await limparRun(ctx.runId);             // cleanup idempotente
```

> O caminho relativo de import depende de onde o consumidor vive (ex.: de
> `web/specs/<dominio>/x.spec.ts` → `../../../foundation`).

## Convenção de seletor (web)

`data-cy` (via `getByTestId`) → `getByRole` / `getByLabel` → texto. Configurado em
`web/playwright.config.ts` (`testIdAttribute: "data-cy"`).

## Documentação

O design e os planos de execução (Fundação, estrutura das 2 tracks, onboarding do
QA-1 e QA-2) ficam **fora do controle de versão**, na pasta `.claude/docs/` da raiz
do repo. O runbook local do mobile (commitado) está em `mobile/RUNNING-LOCAL.md`.
