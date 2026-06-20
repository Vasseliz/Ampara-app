# Ampara Mobile — Fundação (Expo + TypeScript)

App nativo do **paciente**. Esta é a fundação (`mobile-foundation`) consumida pelas tracks A/B/C:
auth Supabase (Bearer), HTTP client com refresh, providers globais (TanStack Query, tema,
SafeArea), navegação por papel e componentes base. **Não há tela de feature aqui** — só o esqueleto.

## Setup

```bash
cd mobile
npm install
cp .env.example .env      # preencher valores (ver abaixo)
npx expo start -c         # -c limpa cache de env após editar .env
```

### Variáveis de ambiente (`mobile/.env`)

| Variável | O que é |
|----------|---------|
| `EXPO_PUBLIC_API_URL` | Backend ASP.NET. **Emulador Android:** `http://10.0.2.2:5243` · **celular físico:** `http://SEU_IP:5243` · **iOS sim:** `http://localhost:5243` |
| `EXPO_PUBLIC_SUPABASE_URL` | URL do projeto Supabase (chave pública) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Anon key Supabase (pública — nunca `service_role`) |

`src/core/config/env.ts` valida no boot — **falta variável = erro na inicialização**.
`.env` está no `.gitignore`; as chaves Supabase são passadas fora do repo (canal seguro).

### Rodar contra a API local

- Backend em **http** porta 5243 (`dotnet run`). HTTPS dev-cert não é confiável no emulador.
- Celular físico: `dotnet run --urls http://0.0.0.0:5243` + liberar porta 5243 no firewall.
- App nativo → **CORS não se aplica**.

## Rodar como app nativo no Android Studio (Windows)

A fundação usa módulos nativos (`expo-secure-store`, `react-native-reanimated`, `expo-router`),
então **Expo Go não basta** — é preciso um **build nativo** (dev build ou APK release).

### Pré-requisitos (uma vez)

1. **Android Studio** instalado, e dentro dele:
   - **SDK Manager** → instalar um Android SDK Platform (API 34+) e o **Android SDK Build-Tools**.
   - **Device Manager** → criar um **AVD** (emulador), ou conectar um device físico com
     **Depuração USB** ativada (Opções do desenvolvedor).
2. Variáveis de ambiente do Windows (Painel → Editar variáveis de ambiente):
   - `ANDROID_HOME` = `C:\Users\<voce>\AppData\Local\Android\Sdk`
   - adicionar ao `Path`: `%ANDROID_HOME%\platform-tools` e `%ANDROID_HOME%\emulator`
3. **JDK 17** — o Android Studio já traz um (JBR). Se `gradlew` reclamar, apontar `JAVA_HOME`
   para `...\Android Studio\jbr`.
4. Validar: abrir terminal novo e rodar `adb --version` e `adb devices`.

### Subir o emulador

- Abrir Android Studio → **Device Manager** → ▶ no AVD criado.
- (ou) iniciar o backend e o AVD antes de buildar. Confirmar com `adb devices` (deve listar `emulator-5554  device`).

### Dev build (debug — compila, instala e abre no emulador)

```bash
cd mobile
npx expo run:android
```

- Na **primeira** execução roda `expo prebuild` → gera a pasta `android/` (projeto Gradle nativo),
  compila e instala o APK no emulador/device em execução.
- Debug build **permite tráfego http cleartext** → a API local (`http://10.0.2.2:5243`) funciona direto.
- Recompilar depois de mudar `.env` (as `EXPO_PUBLIC_*` são embutidas no bundle em build time).
- Abrir o projeto `android/` no próprio Android Studio também funciona: **Run ▶** com o AVD ativo.

### APK release (arquivo `.apk` distribuível)

```bash
cd mobile
npx expo prebuild --platform android      # se ainda não houver pasta android/
cd android
.\gradlew.bat assembleRelease
```

APK gerado em `android/app/build/outputs/apk/release/app-release.apk`.

> ⚠️ Release **bloqueia http cleartext** por padrão → API local em http falha no APK release.
> Para testar contra a API local use o **dev build** (`expo run:android`). Release contra http
> exigiria `usesCleartextTraffic`/network-security-config — preferir https em vez disso.

### URL da API por destino

| APK rodando em | `EXPO_PUBLIC_API_URL` | Backend |
|---|---|---|
| Emulador (AVD) | `http://10.0.2.2:5243` | `dotnet run` |
| Device físico (USB/Wi-Fi) | `http://SEU_IP_LAN:5243` | `dotnet run --urls http://0.0.0.0:5243` + firewall porta 5243 |

> A pasta `android/` é **gerada** e está no `.gitignore` — não commitar; cada dev/CI roda `prebuild`.

### Erros comuns

- `SDK location not found` → `ANDROID_HOME` não definido (ver pré-requisitos).
- `adb: no devices/emulators found` → AVD não está rodando; abrir no Device Manager.
- App abre mas falha ao chamar API → conferiu `10.0.2.2` (não `localhost`) e backend em http?
- Erro no boot sobre variável ausente → `.env` incompleto (`env.ts` valida `EXPO_PUBLIC_*`).

## O que as tracks consomem

```ts
import { apiClient } from '@/core/api';        // fetch autenticado, refresh único já integrado
import { useAuth } from '@/core/auth/useAuth';  // { status, user, login, register, logout }
import { ApiError } from '@/core/api';          // erro tipado por status (400/401/403/404/409/410/5xx)
```

- **Não reimplementar auth/refresh.** `apiClient.request(path, init)` injeta `Authorization: Bearer`,
  faz **um único** refresh em `401` e repete a request; refresh falho → evento de logout.
- Estado remoto: usar TanStack Query (provider já montado no `app/_layout.tsx`).
- Telas de feature entram nos slots de `app/(patient)/` (placeholders prontos).

## Convenção de testabilidade

- Todo elemento interativo recebe `testID` **e** `accessibilityLabel`.
- IDs centralizados em `src/shared/testing/testIDs.ts`, padrão **`feature.tela.elemento`**.
  Usar sempre a constante, nunca string literal. Cada track estende o objeto com seu namespace.
- Componentes base em `src/shared/components/` (`Button`, `Card`, `TextField`, `PasswordField`,
  `Toast`, `ScreenContainer`) já repassam `testID`/`accessibilityLabel` por prop.

## Testes

```bash
npm test                  # jest (jest-expo); config em package.json
npm run typecheck         # tsc --noEmit
```

⚠️ **`@testing-library/react-native` v14 é assíncrono.** `render()` e `fireEvent.*` retornam
`Promise` — usar `await render(...)` / `await fireEvent.*(...)` em `it(async () => ...)`.
Helper com providers: `renderWithProviders` (também `async`) em `src/test/render.tsx`.

## Estrutura

```
app/                 rotas (expo-router) — (public)/ login,cadastro · (patient)/ tabs
src/core/api/        client + erros tipados
src/core/auth/       supabase, session (SecureStore), AuthContext, guard de rota
src/core/config/     env tipado
src/core/query/      queryClient
src/shared/          theme/tokens, components, testing/testIDs
src/test/            render helper + mocks nativos
```

Regras: access token **em memória**, refresh em **SecureStore** (nunca AsyncStorage).
App é **só paciente** — guarda redireciona role ≠ patient para login.
