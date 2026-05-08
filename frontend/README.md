# Ampara - Sistema de Gestão Médica

## O que estamos construindo

O Ampara é uma aplicação web desenvolvida em React para gestão de informações médicas. O sistema visa facilitar o acesso e organização de prontuários médicos, perfis de pacientes e profissionais de saúde, proporcionando uma interface intuitiva e segura para o gerenciamento de dados sensíveis na área da saúde.

### Funcionalidades principais
- **Gestão de Pacientes**: Cadastro e acompanhamento de perfis de pacientes
- **Prontuários Médicos**: Organização e acesso a registros médicos
- **Cofre Seguro**: Armazenamento protegido de informações confidenciais
- **Perfis Profissionais**: Gerenciamento de profissionais de saúde
- **Navegação Intuitiva**: Interface organizada por cartões de navegação

## Arquitetura do Sistema

O projeto adota uma arquitetura híbrida que combina **Design Atômico** (Atomic Design) com organização **Baseada em Features** (Feature-Based), otimizando tanto a reutilização de componentes quanto a manutenção e escalabilidade do código.

### Design Atômico
Organizamos os componentes em uma hierarquia progressiva de complexidade:

- **Átomos** (`src/shared/atoms/`): Componentes básicos e indivisíveis
  - `Button`: Botão reutilizável
  - `Tag`: Etiqueta para categorização
  - `InfoBanner`: Banner informativo

- **Moléculas** (`src/shared/molecules/`): Combinações de átomos que formam unidades funcionais
  - `NavigationCard`: Cartão de navegação
  - `PageHeader`: Cabeçalho de página

### Organização Baseada em Features
As funcionalidades são agrupadas por domínio de negócio:

- **Features** (`src/features/`): Cada pasta representa uma funcionalidade específica
  - `cofre/`: Módulo de armazenamento seguro
  - `prontuario/`: Módulo de prontuários médicos

- **Páginas** (`src/pages/`): Páginas principais da aplicação
  - `Home`: Página inicial

- **Rotas** (`src/routes/`): Configuração de roteamento
  - `PacienteRoute`: Rotas relacionadas a pacientes
  - `ProfissionalRoute`: Rotas relacionadas a profissionais

### Tecnologias Utilizadas
- **React 18**: Framework JavaScript para interfaces
- **Vite**: Ferramenta de build rápida e moderna
- **React Router**: Roteamento para aplicações React
- **ESLint**: Linting para qualidade de código
- **CSS Modules**: Estilização modular e isolada

### Estrutura de Pastas
```
src/
├── features/          # Funcionalidades por domínio
│   ├── cofre/        # Módulo cofre
│   └── prontuario/   # Módulo prontuário
├── pages/            # Páginas principais
├── routes/           # Configuração de rotas
├── shared/           # Componentes compartilhados
│   ├── atoms/        # Componentes básicos
│   └── molecules/    # Componentes compostos
└── assets/           # Recursos estáticos
```

### Benefícios da Arquitetura
- **Reutilização**: Componentes atômicos podem ser reutilizados em diferentes features
- **Manutenibilidade**: Separação clara entre funcionalidades facilita manutenção
- **Escalabilidade**: Estrutura modular permite adicionar novas features facilmente
- **Consistência**: Design system padronizado através dos átomos e moléculas

## Como executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse `http://localhost:5173` no navegador

