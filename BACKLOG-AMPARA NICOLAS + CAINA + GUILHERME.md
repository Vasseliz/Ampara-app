# Backlog - Próximas Entregas (Frontend do Projeto Ampara)

## Contexto considerado

Este backlog considera o frontend do Ampara enquanto o backend é tratado apenas como API de suporte para consumo de dados.

## Critério de priorização

- **N0:** risco de usabilidade e bloqueio de fluxo crítico
- **N1:** qualidade e confiabilidade do frontend
- **N2:** evolução funcional de interface e jornada
- **N3:** arquitetura frontend e DX

---

## Histórias de usuário

Cada história indica **Responsável** e **Entrega**. Há previsão de **mais quatro** histórias de usuário neste documento (responsáveis e entregas serão preenchidos quando forem adicionadas).

| História | Responsável | Entrega |
|----------|-------------|---------|
| História 1: Registro de Humor Diário pelo Paciente | Nicolas Vasseli | Entrega 1 |
| História 2: Acompanhamento de Humor do Paciente pelo Profissional | Nicolas Vasseli | Entrega 2 |
| História 3: Registro de Hábitos Diários pelo Paciente | Caina Vieira | Entrega 3 |
| História 4: Acompanhamento de Hábitos do Paciente pelo Profissional | Caina Vieira | Entrega 4 |
| História 5: Registro de medicamentos pelo Profissional | Guilherme Galante | Entrega 5 |
| História 6: Visão geral do paciente pelo Profissional | Guilherme | Entrega 6 |

### História 1: Registro de Humor Diário pelo Paciente

- **Responsável:** Nicolas Vasseli
- **Entrega:** Entrega 1

**Narrativa**

Como paciente acompanhado por um profissional de saúde mental, desejo registrar como me sinto no dia e consultar meu histórico de humor, para que eu possa acompanhar minha evolução emocional ao longo do tempo.

**Critérios de aceite (BDD)**

1. **Dado que** o paciente acessa o app, **quando** abrir a tela de humor, **então** visualiza a pergunta "Como você está se sentindo?" com uma escala numérica de 0 a 10, representada visualmente por emojis, slider e rótulos extremos ("Muito mal" / "Incrível").
2. **Dado que** o paciente deseja registrar seu humor, **quando** selecionar um valor na escala e confirmar, **então** o registro é salvo via API e o paciente recebe confirmação visual da ação.
3. **Dado que** o paciente já registrou humor no dia, **quando** tentar registrar novamente, **então** o sistema impede uma segunda entrada e exibe mensagem informativa sobre a regra de uma entrada por dia.
4. **Dado que** o paciente quer acompanhar sua evolução, **quando** acessar a seção de histórico, **então** visualiza seus registros filtráveis por período (por exemplo, últimos 14 dias), com leitura clara de cada entrada salva.

### História 2: Acompanhamento de Humor do Paciente pelo Profissional

- **Responsável:** Nicolas Vasseli
- **Entrega:** Entrega 2

**Narrativa**

Como profissional de saúde mental responsável por um paciente, desejo visualizar o histórico de humor dele com uma visão resumida, para que eu possa acompanhar sua evolução emocional e apoiar o acompanhamento clínico com mais embasamento.

**Critérios de aceite (BDD)**

1. **Dado que** o profissional acessa o perfil de um paciente, **quando** navegar até a seção de humor, **então** visualiza o histórico dos últimos 30 dias em formato de série temporal ou equivalente, com tendência clara do estado emocional.
2. **Dado que** o profissional está na seção de humor, **quando** rolar a tela, **então** acessa a lista detalhada dos registros individuais com data e valor de cada entrada feita pelo paciente.
3. **Dado que** o paciente ainda não realizou nenhum registro, **quando** o profissional acessar a seção de humor, **então** visualiza um estado vazio com mensagem adequada, alinhado ao padrão visual do restante do produto.
4. **Dado que** os dados estão sendo carregados da API, **quando** a requisição estiver em andamento, **então** o sistema exibe indicador de carregamento consistente com o restante da interface.

### História 3: Registro de Hábitos Diários pelo Paciente

- **Responsável:** Caina Vieira
- **Entrega:** Entrega 3

**Narrativa**

Como paciente, quero registrar meus hábitos do dia, ou seja, se me exercitei, quantas horas dormi e quanta água bebi, para acompanhar minha rotina de saúde de forma simples e visualizar minha evolução ao longo do tempo.

**Critérios de aceite**

1. O paciente consegue abrir a tela de Hábitos Diários e ver os campos de exercício, sono e água prontos para preencher.
2. O paciente consegue registrar as informações do dia e recebe uma confirmação de que tudo foi salvo.
3. O paciente consegue ver um resumo dos hábitos já registrados, com a data de cada registro.
4. Se ainda não houver nenhum registro, a tela deixa isso claro com uma mensagem amigável.

### História 4: Acompanhamento de Hábitos do Paciente pelo Profissional

- **Responsável:** Caina Vieira
- **Entrega:** Entrega 4

**Narrativa**

Como profissional, quero acompanhar os hábitos do meu paciente ao longo do tempo para entender melhor a rotina dele e usar essas informações no acompanhamento.

**Critérios de aceite**

1. O profissional consegue visualizar os hábitos registrados pelo paciente em um período recente, com gráfico de evolução.
2. O profissional consegue ver os registros mais recentes com data e os valores de cada hábito.
3. Se o paciente ainda não tiver feito nenhum registro, o profissional vê uma mensagem clara informando isso.

### História 5: Registro de medicamentos pelo Profissional
- **Responsável:** Guilherme Galante
- **Entrega:** Entrega 5

**Narrativa**

Como Psicólogo/Profissional, eu quero prescrever medicamentos com dosagens e horários para que o processo seja centralizado e facilite o acompanhamento do paciente.

**Critérios de aceite**

Dado que o profissional está no prontuário do paciente, quando clicar em "Nova Prescrição", então o sistema deve abrir um formulário com campos para: Nome do Medicamento, Dosagem, Frequência e Duração.

Dado que o profissional preenche os dados, quando confirmar o envio, então os dados devem ser persistidos via API e um log de prescrição deve ser gerado.

Dado que um campo obrigatório não foi preenchido, quando o profissional tentar salvar, então o front-end deve exibir uma mensagem de erro em tempo real (feedback visual).

## História 6: Visão geral do paciente pelo Profissional

Responsável: Guilherme Galante
Entrega: Entrega 6

**Narrativa**
Como Profissional (Psicólogo/Psiquiatra), eu quero visualizar um Dashboard geral com os indicadores de rotina (hábitos) do meu paciente para que eu possa identificar oscilações de humor e comportamento antes mesmo da sessão começar.

**Critérios de aceite**

Dado que o profissional acessa o Dashboard de Monitoramento, quando houver dados inseridos pelo paciente, então o sistema deve exibir gráficos de evolução de humor, horas de sono e ingestão de água.

Dado que o profissional precisa de detalhes temporais, quando ele filtrar por "Última Semana", então os cards e gráficos devem ser atualizados.

Dado que o paciente ainda não realizou registros, quando o profissional abrir a visão geral, então o sistema deve exibir uma mensagem informando que não há dados disponíveis para o período.

Dado que a ética profissional é prioritária, quando o profissional visualizar este Dashboard, então ele não deve ter acesso às anotações privadas do Cofre/Diário do paciente.

---

## Tarefas adicionais

Itens técnicos e de produto fora do escopo direto das histórias acima, mantendo o critério N0–N3.

> **Pendência de higiene (sem prioridade N definida no recorte anterior):** remover direcionamento para URLs não existentes (links/menus/redirects que apontam para rotas inexistentes).

1. **[N1] Cobrir frontend com testes de fluxo críticos**
   - **Objetivo:** reduzir regressão nas jornadas principais.
   - **Escopo:** login, logout, renovação de sessão, navegação por perfil e guardas de rota.
   - **Entregável:** suíte automatizada para fluxos principais de autenticação e roteamento.

2. **[N1] Padronizar camada de consumo de API no frontend**
   - **Objetivo:** diminuir inconsistência entre chamadas e tratamento de erro.
   - **Escopo:** cliente HTTP único, interceptadores, tratamento de `401`/`403`, padronização de mensagens para o usuário.
   - **Entregável:** serviço de API centralizado e reutilizável entre features, utilizando componente padrão onde couber.

3. **[N2] Melhorar validações e UX de formulários**
   - **Objetivo:** tornar preenchimento mais claro e reduzir erros do usuário.
   - **Escopo:** login/cadastro, prontuário, convites e cofre com validação client-side e mensagens amigáveis.
   - **Entregável:** formulários com feedback imediato, acessível e consistente.

4. **[N2] Melhorar feedback visual global da aplicação**
   - **Objetivo:** aumentar clareza de estado em operações assíncronas.
   - **Escopo:** componentes de loading, erro, vazio, toast de sucesso/erro e padrões de skeleton.
   - **Entregável:** padrão visual único para estados de interface.

5. **[N3] Fortalecer qualidade contínua no frontend (CI)**
   - **Objetivo:** evitar regressão a cada PR.
   - **Escopo:** lint, build e testes do frontend com quality gate mínimo.
   - **Entregável:** pipeline de frontend validando qualidade automaticamente.

### Sugestão de recorte por próximas entregas

**Histórias de usuário**

- **Entrega 1:** História 1 — Registro de Humor Diário pelo Paciente — **Nicolas Vasseli**
- **Entrega 2:** História 2 — Acompanhamento de Humor do Paciente pelo Profissional — **Nicolas Vasseli**
- **Entrega 3:** História 3 — Registro de Hábitos Diários pelo Paciente — **Caina Vieira**
- **Entrega 4:** História 4 — Acompanhamento de Hábitos do Paciente pelo Profissional — **Caina Vieira**

**Tarefas adicionais** *(numeração = itens 1–5 da lista acima)*

- **Entrega 1 (foco fluxo crítico):** item 1 — testes de fluxos críticos (autenticação e roteamento), em paralelo à história do paciente quando fizer sentido no roadmap.
- **Entrega 2 (foco estabilidade):** itens 2 e 3 — padronização da camada de API e validações/UX de formulários; alinhar com a história do profissional conforme dependências técnicas.
- **Entrega 3 (foco experiência e pipeline):** itens 4 e 5 — feedback visual global e CI no frontend.
