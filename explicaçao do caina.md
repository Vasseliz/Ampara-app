# Documentação: Testes Cypress e Arquitetura React

## Parte 1 — Os arquivos de teste Cypress

### O que é Cypress?

Cypress é uma ferramenta de teste end-to-end (E2E). Em vez de testar funções isoladas, ele abre um navegador de verdade, navega pelo seu site e verifica se o que o usuário veria na tela está correto. É como um "robô que usa a aplicação no lugar do usuário" para garantir que tudo funciona.

### `01-login-conversas.cy.js`

```javascript
describe("Chat - Login e Conversas", () => {
  beforeEach(() => {
    cy.loginViaApi("profissional");
  });
  ...
```

- **`describe`** é um bloco que agrupa testes relacionados. O nome `"Chat - Login e Conversas"` é só um rótulo para o relatório de testes.
- **`beforeEach`** executa uma função antes de cada teste dentro do `describe`. Aqui ele chama `cy.loginViaApi("profissional")`, que é um comando customizado do Cypress (definido em algum arquivo de suporte, provavelmente `cypress/support/commands.js`). Esse comando faz login diretamente pela API, sem precisar preencher formulário — é mais rápido e confiável para testes.

#### Teste 1: "carrega a pagina de chat e lista conversas"

```javascript
cy.visit("/chat");
cy.contains("Chat").should("be.visible");
cy.contains("Conversa compartilhada entre paciente e profissional").should("be.visible");
```

- `cy.visit("/chat")` — navega para a URL `/chat`
- `cy.contains("Chat")` — procura qualquer elemento na página que contenha o texto "Chat"
- `.should("be.visible")` — afirma que esse elemento está visível na tela

Este teste verifica o básico: a página carrega e mostra o título e o banner informativo.

#### Teste 2: "seleciona uma conversa e carrega mensagens"

```javascript
cy.get(".chat__conversation-select").should("be.visible");
cy.get(".chat__conversation-select").then(($select) => {
  if ($select.find("option").length > 1) {
    cy.get(".chat__conversation-select").select(1);
    cy.contains(/mensagens/).should("be.visible");
  }
});
```

- `cy.get(".chat__conversation-select")` — seleciona um elemento pelo seletor CSS (classe `.chat__conversation-select`)
- `.then(($select) => {...})` — acessa o elemento como um objeto jQuery para inspecioná-lo antes de agir
- `if ($select.find("option").length > 1)` — verifica se há mais de 1 opção no select (a opção padrão "Selecione..." + ao menos 1 conversa real). Isso é uma guarda condicional — se não houver conversas no banco de dados de teste, o teste não falha, simplesmente pula
- `.select(1)` — seleciona a opção de índice 1 (a primeira conversa real)
- `cy.contains(/mensagens/)` — procura texto que bate com a expressão regular `/mensagens/` (qualquer texto que contenha a palavra "mensagens")

> **Observação importante:** o `cy.loginViaApi("profissional")` aparece duas vezes neste teste — uma no `beforeEach` e uma dentro do próprio `it`. Isso é redundante, mas não causa erro.

### `02-enviar-mensagem.cy.js`

#### Teste 1: "envia uma mensagem e aparece na conversa"

```javascript
cy.get(".chat__conversation-select").then(($select) => {
  if ($select.find("option").length > 1) {
    cy.get(".chat__conversation-select").select(1);
    cy.get("textarea").type("Teste de mensagem E2E");
    cy.contains("button", "Enviar").click();
    cy.contains("Teste de mensagem E2E").should("be.visible");
  }
});
```

- Seleciona uma conversa
- `cy.get("textarea").type("Teste de mensagem E2E")` — digita texto no textarea
- `cy.contains("button", "Enviar").click()` — clica no botão "Enviar"
- `cy.contains("Teste de mensagem E2E").should("be.visible")` — verifica se a mensagem enviada aparece na conversa

#### Teste 2: "desabilita botao enviar quando textarea vazio"

```javascript
cy.get(".chat__conversation-select").select(1);
cy.contains("button", "Enviar").should("be.disabled");
```

Verifica que o botão "Enviar" está desabilitado quando o textarea está vazio. Isso testa o comportamento definido no `Chat.jsx:131`: `disabled={!texto.trim() || !conversaAtual || enviando}`.

---

## Parte 2 — `Cofre.jsx`

`Cofre.jsx` é a página do diário pessoal do paciente.

### Estado local

```javascript
const [texto, setTexto] = useState("");
const [expandidaNotaId, setexpandidaNotaId] = useState(null);
```

- **`texto`** — o que o usuário está digitando no textarea no momento
- **`expandidaNotaId`** — o id da nota que está expandida. Como só uma pode estar expandida por vez, basta guardar o id. `null` significa nenhuma expandida.

```javascript
const { data: notas, loading, setData: setNotas } = useNotas();
```

Chama o hook customizado `useNotas`, que busca as notas da API. Retorna:

- **`notas`** — array com as notas salvas
- **`loading`** — booleano: ainda está carregando?
- **`setNotas`** — função para atualizar o array de notas localmente (sem precisar rebuscar da API)

### Funções

#### `handleChevron(noteId)` — controla qual nota está expandida:

```javascript
setexpandidaNotaId((current) => (current === noteId ? null : noteId));
```

Se a nota clicada já está expandida (`current === noteId`), fecha ela (seta para `null`). Se não, abre ela. É um *toggle*.

#### `handleDeleteNotas(noteId)` — deleta uma nota:

```javascript
const response = await deletarNota(noteId);
if (!response.ok) return toast.error("Erro ao apagar nota.");
setNotas((current) => current.filter((note) => note.id !== noteId));
setexpandidaNotaId((current) => (current === noteId ? null : current));
```

1. Chama a API para deletar
2. Se der erro, mostra toast de erro e para
3. Remove a nota do array local (sem rebuscar da API — otimização)
4. Se a nota deletada estava expandida, fecha o painel expandido

#### `handleSaveNote()` — salva uma nota:

```javascript
if (texto.trim() === "") return;
const response = await salvarNota(texto.trim());
if (!response.ok) return toast.error("Erro ao salvar nota.");
const criada = await response.json();
setNotas((current) => [criada, ...current]);
setTexto("");
toast.success("Nota salva no Cofre!");
```

1. Guarda contra texto vazio
2. Chama a API
3. Se erro, toast e para
4. Pega a nota criada (que vem com `id` e `createdAt` do servidor) e coloca no início do array (`[criada, ...current]` — nota mais recente primeiro)
5. Limpa o textarea
6. Toast de sucesso

### JSX renderizado

A estrutura visual é:

- **`PageHeader`** — cabeçalho com título e ícone de voltar
- **Banner de privacidade** ("Somente você lê isso...")
- **Card de nova nota**: data de hoje + textarea + contador de caracteres + botão "Guardar"
- **Lista de notas anteriores**: cada nota tem data e um chevron (seta). Ao clicar no chevron, expande e mostra o botão "Apagar". O texto da nota fica sempre visível (linha 114)

---

## Parte 3 — `Chat.jsx`

`Chat.jsx` é a página de conversa entre paciente e profissional.

### Estado

```javascript
const [conversaAtual, setConversaAtual] = useState(null);
const [texto, setTexto] = useState("");
const [enviando, setEnviando] = useState(false);
```

- **`conversaAtual`** — o objeto da conversa selecionada (tem `pacienteId` e `profissionalId`)
- **`texto`** — o que está sendo digitado
- **`enviando`** — booleano de lock: enquanto a mensagem está sendo enviada, impede duplo clique

### Hooks de dados

```javascript
const { data: conversas, loading: loadingConversas } = useConversas();
const { data: mensagens, loading: loadingMensagens, setData: setMensagens } = useMensagens(
  conversaAtual?.pacienteId, 
  conversaAtual?.profissionalId
);
```

- **`useConversas()`** — busca a lista de conversas disponíveis para o usuário logado
- **`useMensagens(pacienteId, profissionalId)`** — busca as mensagens da conversa selecionada. O `?.` (optional chaining) garante que não vai quebrar quando `conversaAtual` for `null`; nesse caso passa `undefined` para o hook, que não busca nada

### `handleEnviar`

```javascript
const handleEnviar = async () => {
  if (!conversaAtual || !texto.trim() || enviando) return;
  setEnviando(true);
  try {
    const response = await enviarMensagem(
      conversaAtual.pacienteId,
      conversaAtual.profissionalId,
      texto.trim()
    );
    if (!response.ok) return toast.error("...");
    const criada = await response.json();
    setMensagens((atual) => [...atual, criada]);  // adiciona no final
    setTexto("");
  } catch {
    toast.error("...");
  } finally {
    setEnviando(false);  // sempre desativa o lock
  }
};
```

O `try/catch/finally` garante que mesmo se der um erro inesperado, `enviando` volta para `false`.

### `eMinhaMsg`

```javascript
function eMinhaMsg(msg) {
  if (user?.role === "patient") return msg.enviadoPeloPaciente === true;
  return msg.enviadoPeloPaciente === false;
}
```

Determina se uma mensagem foi enviada pelo usuário logado. Se for paciente, a mensagem é "minha" se `enviadoPeloPaciente === true`. Se for profissional, é "minha" se `enviadoPeloPaciente === false`. Isso define qual lado da tela a bolha da mensagem aparece (`chat__message--mine` vs `chat__message--other`).

---

## Parte 4 — O Sistema de Rotas

Esta é a parte mais rica. Vamos explicar camada por camada.

### O papel do `BrowserRouter`

```jsx
<BrowserRouter>
  <AuthProvider>
    ...
  </AuthProvider>
</BrowserRouter>
```

`BrowserRouter` é o motor de roteamento. Ele escuta a URL do navegador e decide qual componente renderizar. Sem ele, a aplicação não saberia o que mostrar para cada URL. Ele precisa estar por fora de tudo porque os hooks de roteamento (`useNavigate`, `Navigate`, `Outlet`) só funcionam dentro dele.

### O papel do `AuthProvider`

`AuthProvider` fica dentro do `BrowserRouter` propositalmente. Assim, quando o `AuthProvider` precisa redirecionar (`Navigate`), o sistema de rotas já está disponível.

O `AuthProvider` faz 4 coisas:

1. **Inicialização** — ao montar, chama `refresh()` que consulta `GET /auth/me`. Se a sessão existir no servidor, preenche `user`. Se não, `user` fica `null`.
2. **Revalidação periódica** — a cada 3 minutos (`REVALIDACAO_MS = 3 * 60 * 1000`) chama `refresh()` de novo. Se a sessão expirou no servidor, `user` vira `null`.
3. **Revalidação ao voltar para a aba** — escuta o evento `visibilitychange`. Se o usuário sai e volta para a aba do navegador, chama `refresh()` (com 400ms de delay para evitar chamadas duplicadas rápidas).
4. **Evento de expiração forçada** — escuta o evento customizado `"ampara:session-expired"` no `window`. Quando o interceptor de fetch (`fetchComSessao`) recebe um 401 da API, dispara esse evento, e o `AuthProvider` reage zerando `user`.

O `AuthProvider` expõe via Context: `user`, `loading`, `refresh`, `clearUser`.

### As rotas guard: o mecanismo de proteção

Esta é a parte mais importante para entender. O React Router v6 usa o padrão de **Layout Routes** — rotas que não renderizam página, mas rendem um "wrapper" que decide o que mostrar.

#### Fluxo visual da árvore de rotas

```
<Routes>
  ├── /login          → <Login />              (pública)
  ├── /cadastro       → <Signup />             (pública)
  ├── /convite/aceitar → <AceitarConvite />    (pública)
  │
  └── <RequireAuth>   ← GUARD: está logado?
      └── <DashboardLayout>  ← Layout com menu/nav
          ├── /              → <Home />
          ├── /chat          → <Chat />
          │
          ├── <PacienteRoute>  ← GUARD: é paciente?
          │   ├── /cofre        → <Cofre />
          │   ├── /convites     → <ConvitesPaciente />
          │   ├── /medicamentos → <Medicamentos />
          │   ├── /humor        → <Humor />
          │   └── /habitos      → <Habitos />
          │
          └── /profissional/<ProfissionalRoute>  ← GUARD: é profissional?
              ├── /profissional/pacientes
              ├── /profissional/pacientes/:id
              ├── /profissional/medicamentos/:id?
              ├── /profissional/humor/:id?
              └── /profissional/prontuario/:id?
```

#### Como funciona o `<Outlet />`

Este é o conceito-chave. Quando uma rota não tem `element` com uma página, mas tem filhos, o React Router renderiza o `element` pai e espera que ele chame `<Outlet />` para saber onde "injetar" o filho.

**`RequireAuth`:**

```jsx
export function RequireAuth() {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando…</div>;   // ainda verificando sessão
  if (!user) return <Navigate to="/login" replace />;  // não logado → redireciona
  return <Outlet />;  // logado → renderiza o filho (DashboardLayout)
}
```

Quando o usuário acessa `/cofre`, o React Router percorre a árvore:

1. Chega em `<RequireAuth>` — está logado? Não → redireciona para `/login`. Sim → `<Outlet />` ativa o próximo nível
2. Chega em `<DashboardLayout>` — renderiza o menu/nav e dentro dele coloca `<Outlet />`, que ativa o próximo nível
3. Chega em `<PacienteRoute>` — é paciente? Não → redireciona para `/`. Sim → `<Outlet />` ativa o componente da rota
4. Renderiza `<Cofre />`

#### Diferença entre `PacienteRoute` e `ProfissionalRoute`

- **`PacienteRoute`** verifica `user.role !== "patient"` e redireciona para `/` (home).
- **`ProfissionalRoute`** verifica `user.role !== "professional"` e redireciona para `/`.

Isso significa que um profissional que tenta acessar `/cofre` vai cair no `PacienteRoute`, que vai barrar e jogar para `/`. E um paciente que tenta acessar `/profissional/pacientes` vai cair no `ProfissionalRoute` e também ser jogado para `/`.

#### Por que `replace` no `Navigate`?

```jsx
<Navigate to="/login" replace />
```

O `replace` substitui a entrada atual no histórico do navegador em vez de adicionar uma nova. Sem `replace`, o usuário poderia clicar "Voltar" e voltar para a rota protegida, que tentaria renderizar de novo e redirecionaria de novo — um loop. Com `replace`, o histórico fica limpo.

#### O `refreshSeq` no `AuthContext`

```javascript
const refreshSeq = useRef(0);
const refresh = useCallback(async () => {
  const id = ++refreshSeq.current;
  ...
  if (id !== refreshSeq.current) return;
  ...
});
```

Isso é uma proteção contra *race condition*. Se `refresh()` for chamado duas vezes rapidamente, duas requisições vão para a API. A primeira pode chegar depois da segunda. O `refreshSeq` é um contador: cada chamada ganha um número. Se quando a resposta chega o número já não é mais o atual, a resposta é descartada. Garante que só a última requisição atualiza o estado.