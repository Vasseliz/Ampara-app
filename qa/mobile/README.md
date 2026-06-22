# Track B — Suíte Mobile (Maestro)

Suíte E2E do **app do paciente** (Expo / React Native) com **Maestro**. Espelha
1:1 os cenários de `qa/features/*.feature` (lado paciente). Esta pasta é
**exclusiva da Track B (QA-2)** — nada aqui colide com a Track A (web).

> App é **só do paciente**. Cenários de profissional (prescrever medicamento,
> convidar paciente, acompanhar humor) são da **Track A (web)**, não daqui.

## Estrutura

```
mobile/
├── README.md
├── .env.example            # variáveis Maestro (-e) e como obtê-las
├── subflows/               # blocos reutilizáveis (DRY) — não são testes
│   ├── login.yaml          #   launch limpo + login por UI + assert home
│   ├── logout.yaml         #   sair pela home
│   ├── abrir-atalho.yaml   #   abre Cofre/Convites pelos atalhos da home
│   └── abrir-deeplink-convite.yaml   # openLink ampara://convites/aceitar
└── flows/                  # os testes (cada arquivo = 1 Cenário do .feature)
    ├── auth/               # B1
    ├── convites/           # B2
    ├── humor/              # B3
    ├── habitos/            # B3
    ├── medicamentos/       # B4
    ├── cofre/              # B5
    └── chat/               # B6
```

`maestro test mobile/flows` roda **só** `flows/` — os `subflows/` entram via
`runFlow` e nunca são executados como teste isolado.

## Pré-requisitos (B0)

Maestro precisa de um **dev build nativo** do app (não roda no Expo Go, por causa
de `reanimated`, `gesture-handler`, `secure-store` e `local-authentication`).

```bash
# 1. Maestro CLI
curl -fsSL https://get.maestro.mobile.dev | bash    # macOS/Linux
#   Windows: use WSL ou siga https://maestro.mobile.dev/getting-started/installing-maestro

# 2. Emulador Android de pé (ou device físico com USB debugging)
adb devices                                          # confirma 1 device

# 3. Dev build do app instalado no device
cd ../../mobile
npx expo run:android                                 # compila e instala com.ampara.mobile

# 4. Backend .NET de pé em http://localhost:5243 (o app consome ele)
#    No emulador Android, 10.0.2.2:5243 aponta para o host — confira EXPO_PUBLIC_API_URL.
```

`appId` do app: **`com.ampara.mobile`** (definido em `mobile/app.config.ts`).
Deep link scheme: **`ampara://`**.

## Rodar

```bash
cd qa
npm run e2e:mobile                                   # roda mobile/flows inteiro

# um domínio:
maestro test mobile/flows/auth
# um cenário:
maestro test mobile/flows/humor/registrar.yaml
# por tag:
maestro test mobile/flows --include-tags=auth
```

## Estado dos testes (credenciais e dados)

Os flows que exigem **paciente logado** recebem as credenciais por variável
Maestro (`-e`) — obrigatórias, sem default (ver `.env.example`):

```bash
maestro test mobile/flows/humor -e EMAIL=pac@ampara.test -e PASSWORD='SenhaForte123!'
```

Origem das credenciais:

| Cenário | Como obter o estado |
|---|---|
| **Execução isolada (dev)** | rode `flows/auth/cadastro.yaml` (cria um paciente novo) **ou** registre um paciente fixo e use seu e-mail/senha em `-e`. |
| **Sob o orquestrador (Bloco J)** | `runCross.ts` chama `seedParVinculado()` da Fundação e injeta `-e EMAIL`, `-e PASSWORD`, `-e INVITE_TOKEN` automaticamente. |

Flows com **pré-condição de dados cross-platform** (precisam de algo criado pelo
profissional, via web/API) estão marcados no cabeçalho do arquivo e na tabela de
cada domínio abaixo. Em execução isolada, seede esse dado antes (ou rode no Bloco J).

## Mapa de cenários (mobile = lado paciente)

| Domínio | Flow | Pré-condição de dados |
|---|---|---|
| **auth** | `login-valido`, `login-invalido`, `cadastro`, `logout`, `rota-protegida` | nenhuma (cadastro cria o usuário) |
| **convites** | `listar`, `aceitar`, `deep-link-aceite` | convite **pendente** para o paciente (`-e INVITE_TOKEN`) |
| **humor** | `registrar`, `historico` | paciente logado |
| **habitos** | `marcar`, `desmarcar`, `historico` | paciente logado |
| **medicamentos** | `listar`, `tomar`, `adesao` | `tomar`/`adesao`: medicamento prescrito (cross) |
| **cofre** | `criar-nota`, `excluir-nota`, `biometria-gate` | paciente logado; `biometria-gate`: ver nota abaixo |
| **chat** | `listar-conversas`, `enviar-mensagem` | `enviar-mensagem`: vínculo com profissional (cross) |

### Nota sobre biometria (Cofre)

O gate usa `expo-local-authentication`:
- **Sem PIN/biometria no aparelho** (`level: 'none'`) → o cofre **auto-libera** e
  mostra um aviso de segurança. É o estado default de um emulador limpo, então
  `criar-nota`/`excluir-nota` rodam sem prompt.
- **Com biometria cadastrada** → aparece a tela de bloqueio (`vault.locked`).
  O `biometria-gate.yaml` valida esse gate. Para passar o prompt nativo no
  emulador Android:
  ```bash
  adb -e emu finger touch 1      # simula o toque do dedo cadastrado
  ```

## Convenção de seletor (KISS/DRY)

`testID` primeiro (catálogo central em `mobile/src/shared/testing/testIDs.ts`),
depois `accessibilityLabel`/texto. Maestro casa `id` por regex — itens de lista
com id dinâmico usam padrão (ex.: `id: "vault\\.note\\..*\\.delete"`).
