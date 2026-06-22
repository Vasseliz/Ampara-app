# Rodando os testes Mobile (Maestro) localmente

Runbook para **devs/QAs** rodarem a suíte E2E mobile (`qa/mobile/`) numa máquina
local contra o **backend .NET de dev**. Cobre o que instalar, **qual build do app
usar** (é a decisão que mais importa) e como diagnosticar os problemas comuns.

> TL;DR: rode a suíte contra um **build de teste do app** — JS de **produção**
> (input rápido, sem Metro) **+** exceção de cleartext pro host de dev. Não use o
> Expo Go nem o build debug puro. O passo a passo está em [§4](#4-build-do-app-para-teste).

---

## 1. Visão geral

| Peça | O quê |
|---|---|
| **Maestro** | runner dos flows YAML (`mobile/flows/**`) |
| **Emulador Android** (ou device) | onde o app roda |
| **App Ampara** (build de teste) | APK instalado no emulador |
| **Backend .NET** | API em `http://localhost:5243` na sua máquina |

O app mobile é **só do paciente**. Todas as regras passam pelo **backend .NET**
(Supabase é só identidade/JWT). No emulador, o backend da sua máquina é acessível
em **`10.0.2.2:5243`** (não `localhost`, que seria o próprio emulador).

---

## 2. Pré-requisitos

| Ferramenta | Versão usada | Observação |
|---|---|---|
| **JDK** | 17 (Temurin) | Maestro e o build do Android precisam |
| **Android SDK + emulador** | platform-tools (adb) | um AVD x86_64 rodando |
| **Node** | ≥ 20 | para a Fundação/seed e o Metro do Expo |
| **Maestro CLI** | 2.6.1 | ver [§3](#3-instalar-o-maestro) |
| **Backend .NET** | — | de pé em `:5243` antes de rodar |

Confirme o básico:

```bash
adb devices                 # deve listar 1 emulador (ex.: emulator-5554)
java -version               # 17.x
adb -s emulator-5554 shell getprop ro.product.cpu.abi   # x86_64
```

---

## 3. Instalar o Maestro

**macOS / Linux (ou Windows via WSL):**
```bash
curl -fsSL "https://get.maestro.mobile.dev" | bash
export PATH="$HOME/.maestro/bin:$PATH"
maestro --version
```

**Windows nativo (sem WSL):** baixe o release e ponha no PATH:
```powershell
Invoke-WebRequest "https://github.com/mobile-dev-inc/maestro/releases/latest/download/maestro.zip" -OutFile "$env:TEMP\maestro.zip"
Expand-Archive "$env:TEMP\maestro.zip" "$env:USERPROFILE\.maestro" -Force
# binário em %USERPROFILE%\.maestro\maestro\bin\maestro.bat — adicione essa pasta ao PATH
```

> ⚠️ **Windows nativo:** o Maestro **não provisiona o teclado próprio**, então o
> `inputText` digita **tecla por tecla** (lento). Isso só vira problema no build
> debug (ver §4). No macOS/Linux/WSL o teclado é provisionado e o input é
> instantâneo em qualquer build.

---

## 4. Build do app para teste

**Esta é a parte que mais confunde.** Há três jeitos de rodar o app e só um serve
bem para E2E:

| Forma | Input | Precisa Metro? | Alcança back local? | Serve p/ E2E? |
|---|---|---|---|---|
| **Expo Go** | — | — | — | ❌ usa módulos nativos (reanimated, secure-store, biometria) |
| **Debug build** (`expo run:android`) | **lento** (dev mode, re-render por tecla) | **sim** | sim (cleartext liberado no debug) | ⚠️ no Windows o `inputText` estoura o timeout |
| **Build de teste** (release JS + cleartext dev) | **rápido** (JS de produção) | **não** (JS embutido) | sim (via exceção scoped) | ✅ **use este** |

### Por que o build de teste

- **JS de produção** (`__DEV__=false`) → sem o re-render lento de dev mode → o
  `inputText` do Maestro completa rápido (resolve o `DEADLINE_EXCEEDED` de 120s).
- **JS embutido no APK** → não depende do Metro rodando (sem a tela vermelha
  "Unable to load script").
- **Exceção de cleartext só pro host de dev** → o release bloqueia HTTP por padrão;
  liberamos **apenas `10.0.2.2`/localhost** para a API local funcionar, sem
  enfraquecer produção (a API de produção é HTTPS; esses hosts nunca se aplicam lá).

### O que já está no repo

A exceção de cleartext vive no **sourceset `release`** (não toca `main`/produção):

- `mobile/android/app/src/release/AndroidManifest.xml`
- `mobile/android/app/src/release/res/xml/network_security_config.xml` (libera
  cleartext só p/ `10.0.2.2`, `localhost`, `127.0.0.1`)

> Em produção real, troque a API para HTTPS — aí nem essa exceção é necessária.
> Para um pipeline com staging remoto, o mais correto é HTTPS com cert confiável.

### Compilar e instalar

Confirme a URL da API no `mobile/.env`:
```
EXPO_PUBLIC_API_URL=http://10.0.2.2:5243
```

Compile **só para a ABI do emulador (x86_64)** — evita o erro de cross-compile do
reanimated (`ninja: manifest 'build.ninja' still dirty`) e é bem mais rápido:

```bash
cd mobile/android
./gradlew :app:assembleRelease -PreactNativeArchitectures=x86_64 --no-daemon
# Windows: gradlew.bat -p <...>\android :app:assembleRelease -PreactNativeArchitectures=x86_64 --no-daemon

# instala no emulador
adb -s emulator-5554 install -r app/build/outputs/apk/release/app-release.apk
```

> O APK release usa **assinatura debug** (`signingConfig signingConfigs.debug` no
> `build.gradle`), então instala localmente sem gerar keystore.

---

## 5. Rodar a suíte

A partir de `qa/`:

```bash
npm run e2e:mobile                                   # roda mobile/flows inteiro
maestro --device emulator-5554 test mobile/flows/auth          # um domínio
maestro --device emulator-5554 test mobile/flows/auth/cadastro.yaml   # um flow
maestro test mobile/flows --include-tags=auth        # por tag
```

Flows **autossuficientes** (rodam sem credencial pré-existente):
`auth/rota-protegida`, `auth/login-invalido`, `auth/cadastro`.

---

## 6. Estado dos testes (credenciais e dados)

Flows que exigem **paciente logado** recebem credenciais por env do Maestro:

```bash
maestro test mobile/flows/humor -e EMAIL=pac@ampara.test -e PASSWORD='SenhaForte123!'
```

| Cenário | Como obter o estado |
|---|---|
| **Isolado (dev)** | rode `auth/cadastro.yaml` (cria paciente novo) **ou** registre um paciente fixo e use suas credenciais em `-e`. |
| **Via Fundação** | `npm run seed:test` exercita `seedParVinculado()` (cria pro+paciente vinculados e escreve `.tmp/context.<runId>.json` com e-mails/senhas). Use essas credenciais nos `-e`. |
| **Sob o orquestrador (Bloco J)** | `runCross.ts` seede e injeta `-e EMAIL/PASSWORD/INVITE_TOKEN` automaticamente. |

Pré-condições **cross** (dado criado pelo profissional, via web/API): `medicamentos/tomar`,
`medicamentos/adesao`, `convites/*`, `chat/enviar-mensagem`. Estão marcadas no cabeçalho
de cada flow. Em execução isolada, seede antes; ou rode no Bloco J.

### Biometria (Cofre)
- Emulador limpo (`level: none`) → o cofre **auto-libera** e mostra aviso de segurança;
  `cofre/criar-nota`/`excluir-nota` rodam sem prompt.
- Com biometria cadastrada → tela de bloqueio; passe o toque no emulador:
  `adb -e emu finger touch 1`.

---

## 7. Troubleshooting (sintomas que você vai ver)

| Sintoma | Causa | Correção |
|---|---|---|
| Tela **vermelha** "Unable to load script / index.android.bundle" | build **debug** sem Metro | use o **build de teste** (§4); ou suba o Metro + `adb reverse tcp:8081 tcp:8081` |
| Tela **preta** alguns segundos após launch | cold start ainda bundlando/montando | normal; espere; assertions do Maestro têm wait |
| `inputText ... DEADLINE_EXCEEDED after 120s` | input lento (debug + Windows) estoura o timeout | use o **build de teste** (JS de produção) |
| **Falha de rede** ao chamar a API | release bloqueia cleartext, **ou** API URL errada | confirme a network security config (§4) e `EXPO_PUBLIC_API_URL=http://10.0.2.2:5243` |
| `ninja: manifest 'build.ninja' still dirty after 100 tries` | cross-compile de ABI desnecessária (armeabi-v7a) | compile só `x86_64`: `-PreactNativeArchitectures=x86_64` |
| `Element ... not found` num `tapOn` | app não chegou na tela / testID divergente | confira a tela (`adb exec-out screencap -p > s.png`) e o catálogo `mobile/src/shared/testing/testIDs.ts` |
| `maestro: command not found` | PATH | `export PATH="$HOME/.maestro/bin:$PATH"` (ou `.../.maestro/maestro/bin` no Windows) |

Artefatos de debug de cada run ficam em `~/.maestro/tests/<timestamp>/`
(logs + screenshot da falha).

---

## 8. Do zero ao verde (resumo copy-paste)

```bash
# 0. emulador x86_64 de pé + backend .NET em :5243

# 1. Maestro (uma vez)
curl -fsSL "https://get.maestro.mobile.dev" | bash && export PATH="$HOME/.maestro/bin:$PATH"

# 2. build de teste do app (JS de produção + cleartext dev já no repo)
cd mobile/android
./gradlew :app:assembleRelease -PreactNativeArchitectures=x86_64 --no-daemon
adb install -r app/build/outputs/apk/release/app-release.apk
cd ../..

# 3. rodar os flows autossuficientes
cd qa
maestro test mobile/flows/auth/rota-protegida.yaml
maestro test mobile/flows/auth/login-invalido.yaml
maestro test mobile/flows/auth/cadastro.yaml
```

Esperado: os três **PASSAM** (exit 0). A partir daí, seede credenciais (§6) para os
flows que exigem login.
