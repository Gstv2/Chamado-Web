# Help Desk + (Chamado Web)

Sistema de gerenciamento de chamados para centralizar solicitações de suporte, desenvolvido como trabalho final da disciplina de Desenvolvimento Web.

## 📖 Introdução
Este projeto surge da necessidade de organizar o fluxo de solicitações de TI em pequenas e médias empresas, onde muitas vezes os pedidos são feitos de forma informal (WhatsApp, verbalmente ou anotações em papel).

O **Chamado Web** é uma solução Full Stack (Backend API + Frontend React) que permite o registro, acompanhamento e gestão dessas solicitações de forma centralizada, segura e auditável. O sistema foi projetado focando em boas práticas de engenharia de software, separação de responsabilidades e escalabilidade.

## 🎯 Objetivo
Resolver o problema de descentralização de pedidos de suporte criando uma aplicação web simples e eficiente para registro e acompanhamento de chamados (tickets).

## 📈 Estratégia de Desenvolvimento
O desenvolvimento foi conduzido de forma incremental e iterativa, garantindo entrega contínua de valor.

1.  **Foco no MVP (Minimum Viable Product)**: Priorizamos as funcionalidades essenciais (CRUD de Chamados e Usuários).
2.  **Arquitetura Evolutiva**: Adotamos uma arquitetura em camadas (Controller-Service-Repository) para o Backend.
3.  **Segurança e Robustez**: Autenticação JWT, validação com Zod e tratamento global de erros.
4.  **Interface Amigável**: Frontend moderno com React e Tailwind CSS.

## 🧠 Estratégia Abordada
Para garantir um software de alta qualidade, manutenível e escalável, adotamos as seguintes estratégias técnicas e metodológicas:

1.  **Defense in Depth (Segurança em Camadas)**:
    *   **Frontend**: Restrições visuais (campos desabilitados/ocultos) para melhor UX.
    *   **Backend (Controller/Service)**: Validação estrita de regras de negócio (RBAC - Role Based Access Control) que impede ações não autorizadas mesmo se o frontend for burlado.
    *   **Database**: Integridade referencial e tipagem forte garantida pelo Prisma.

2.  **Clean Architecture (Simplificada)**:
    *   Separação clara entre responsabilidades. O *Controller* não sabe sobre banco de dados, e o *Repository* não sabe sobre HTTP. Isso facilita testes e futuras migrações (ex: trocar Fastify por Express ou SQLite por Postgres seria trivial na camada de persistência).

3.  **Fail Fast & User Feedback**:
    *   Validações ocorrem o mais cedo possível (Zod Schema). Erros são tratados globalmente para devolver mensagens claras e amigáveis ao usuário final, evitando telas brancas ou erros genéricos de servidor.

4.  **Estado Global Persistente**:
    *   No frontend, o uso de Context API + LocalStorage garante que o usuário não perca sua sessão ao recarregar a página, melhorando a experiência de uso.

## 🔄 Fluxo e Funcionamento
O sistema opera em um ciclo contínuo de interação Client-Server:

1.  **Autenticação**:
    *   O usuário faz login. O servidor valida credenciais e retorna um **Token JWT** e os dados do usuário (incluindo sua `role`).
    *   O Frontend armazena esse token e o anexa automaticamente a todas as requisições subsequentes (Header `Authorization: Bearer ...`).

2.  **Dashboard e Listagem**:
    *   Ao acessar o Dashboard, o frontend solicita `/chamados`.
    *   O Backend verifica o token. Se for `USER`, retorna apenas os chamados dele. Se for `ADMIN`, retorna todos.

3.  **Ciclo de Vida do Chamado**:
    *   **Criação**: Usuário cria um chamado. Backend define status inicial como `ABERTO` e prioridade `MEDIA` (padrão) se não for informado.
    *   **Triagem (Admin)**: Administrador visualiza o chamado, avalia a gravidade e pode alterar a prioridade para `ALTA` ou status para `EM_ANDAMENTO`.
    *   **Resolução**: Após o atendimento, o chamado é movido para `FECHADO`.

4.  **Proteção de Rotas**:
    *   Se um usuário comum tentar acessar a URL `/admin`, o `PrivateRoute` identifica a permissão insuficiente e o redireciona forçadamente para o Dashboard, prevenindo acesso não autorizado a interfaces sensíveis.

## 🏗️ Arquitetura e Tecnologias

### Back End
O servidor é uma API RESTful robusta.
- **Linguagem**: TypeScript (Node.js)
- **Framework Web**: Fastify (Alta performance)
- **ORM**: Prisma (Segurança de tipos)
- **Banco de Dados**: SQLite (Desenvolvimento) / PostgreSQL (Produção - compatível)
- **Autenticação**: JWT (@fastify/jwt) + Bcrypt
- **Validação**: Zod (Schema Validation)

**Padrões de Projeto (Backend):**
*   **Repository Pattern**: Abstração do acesso a dados. Permite trocar o banco sem afetar regras de negócio.
*   **Service Layer**: Centraliza as regras de negócio. Controllers apenas lidam com HTTP.
*   **Dependency Injection**: Injeção de dependências para desacoplamento e testabilidade.
*   **DTO (Data Transfer Object)**: Transporte seguro de dados entre camadas.

### Front End
A interface do usuário é uma Single Page Application (SPA).
- **Framework**: React (Vite)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS (Utilitários para design rápido)
- **Roteamento**: React Router DOM
- **Consumo de API**: Axios

**Arquitetura do Frontend:**
*   **Component-Based**: Interface construída em pequenos blocos reutilizáveis (`Header`, `Logo`, etc.).
*   **Context API (`AuthContext`)**: Gerenciamento global do estado de autenticação (Login/Logout) persistente.
*   **Services Pattern (`api.ts`)**: Centralização da configuração do Axios e interceptadores de erros.
*   **Protected Routes**: Rotas protegidas (`PrivateRoute`) que garantem acesso apenas a usuários autenticados e redirecionam conforme permissão.

## 📊 Modelo de Dados

### 1. User (Usuários)
- **Tipos**: `USER` (Comum), `ADMIN` (Administrador)
- **Funcionalidades**:
- **Registro**: Criação de conta (`/users`).
- **Autenticação**: Login com JWT (`/users/login`).

### 2. Chamado (Tickets)
- **Status**: `ABERTO` ➝ `EM_ANDAMENTO` ➝ `FECHADO`
- **Prioridade**: `BAIXA`, `MEDIA`, `ALTA`
- **Permissões**:
    - **Usuário Comum**:
        - Cria chamados (Define apenas Título e Descrição).
        - Edita seus chamados (Apenas Título e Descrição; Status e Prioridade são somente leitura).
        - Visualiza e exclui apenas seus próprios chamados.
    - **Administrador**:
        - Visualiza todos os chamados (`/admin`).
        - Gerencia Status e Prioridade de qualquer chamado.
        - Exclui qualquer chamado.

##  Status do Projeto

###  Fase 0: Preparação
- Definição do escopo, problema e entidades.

###  Fase 1: Setup do Projeto
- Configuração do ambiente (Node.js, TypeScript, Fastify).
- Configuração do Prisma com SQLite.
- Estruturação inicial de pastas.

###  Fase 2: Modelagem e Persistência
- Criação dos Models no `schema.prisma`.
- Implementação do **Repository Pattern** (`IUserRepository`, `IChamadoRepository`).
- Criação de script de Seed (`prisma/seed.ts`) para popular o banco.

###  Fase 3: Autenticação e Autorização
- Implementação de Hash de senha com `bcryptjs`.
- Criação de Login com geração de JWT.
- Middlewares: `ensureAuthenticated` e `ensureAdmin`.

###  Fase 4: CRUD e Regras de Negócio
- Implementação da Camada de Serviço (Services).
- CRUD Completo de Chamados.
- Refatoração para arquitetura Controller-Service-Repository.

###  Fase 5: Regras, Validações e Erros
- **Validação de Dados**: Uso da biblioteca **Zod** para garantir a integridade dos dados de entrada.
- **Tratamento de Erros Global**: Implementação de `setErrorHandler` no Fastify.
- **Classe AppError**: Padronização de erros de regra de negócio (Message + StatusCode).
- **Robustez**: API preparada para lidar com falhas e entradas inválidas sem crashar.

###  Fase 6: Testes e Refinamento
- **Testes Manuais Automatizados**: Script para validar todos os endpoints (Login, CRUD, Permissões).
- **Correções de Bugs**: Ajuste de rotas (PUT -> PATCH) e validações.
- **Refinamento**: Revisão de código e comentários.

###  Fase 7: Integração Front-end (Atual)
- **Integração Completa**: Frontend conectado ao Backend via Axios.
- **Persistência de Login**: Implementação de verificação de token e localStorage.
- **Controle de Acesso Visual**: Interfaces adaptativas baseadas na role do usuário (Campos de prioridade bloqueados para USER).
- **Proteção de Rotas**: Redirecionamento automático de usuários não autorizados.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (v16 ou superior).
- Gerenciador de pacotes `npm`.

### Passo 1: Configurar e Rodar o Backend

1.  Acesse a pasta raiz do projeto:
    ```bash
    # Instalar dependências do servidor
    npm install
    ```

2.  Configure o banco de dados (Prisma):
    ```bash
    # Gera o cliente do Prisma (Tipagem)
    npx prisma generate

    # Cria as tabelas no banco de dados SQLite
    npx prisma migrate dev

    # Popula o banco com dados iniciais (Seed)
    # Cria usuário Admin padrão e alguns chamados
    npm run seed
    ```

3.  Inicie o servidor:
    ```bash
    # Roda o servidor na porta 3333
    npm run dev
    ```
    *O Backend estará rodando em `http://localhost:3333`*

### Passo 2: Configurar e Rodar o Frontend

1.  Em outro terminal, acesse a pasta `frontend`:
    ```bash
    cd frontend
    
    # Instalar dependências do frontend
    npm install
    ```

2.  Inicie o servidor de desenvolvimento:
    ```bash
    # Roda o Vite
    npm run dev
    ```

3.  Acesse a aplicação no navegador:
    *   Geralmente em: `http://localhost:5173`

## 👤 Usuários de Teste

Após rodar o comando `npm run seed`, os seguintes usuários estarão disponíveis para teste:

| Role  | Email               | Senha      | Permissões                                      |
| :---: | :------------------ | :--------- | :---------------------------------------------- |
| ADMIN | `admin@example.com` | `admin123` | Acesso total (Dashboard administrativo)         |
| USER  | `user@example.com`  | `user123`  | Acesso limitado (Meus Chamados, Novo Chamado)   |

## 🧪 Testes

### Testes de Simulação (Backend)
O projeto inclui um script de teste de integração que simula um fluxo completo de uso da API.

```bash
# Na raiz do projeto
npx ts-node scripts/test-simulation.ts
```
> **Nota**: Este script limpa o banco e cria cenários de teste para validar Login, Criação de Chamados e Permissões.

## 📁 Estrutura de Pastas Importantes

```
Chamado-Web/
├── src/                    # Código Fonte do Backend
│   ├── controllers/        # Controladores (Entrada da API)
│   ├── services/           # Regras de Negócio
│   ├── repositories/       # Acesso ao Banco de Dados
│   ├── routes/             # Definição das Rotas
│   └── server.ts           # Entrada da Aplicação (Configuração Fastify/CORS)
├── frontend/               # Código Fonte do Frontend
│   ├── src/
│   │   ├── pages/          # Páginas (Dashboard, Login, Admin, etc.)
│   │   ├── contexts/       # Contextos React (Auth)
│   │   └── services/       # Configuração API (Axios)
└── prisma/                 # Configuração do Banco de Dados
    ├── schema.prisma       # Definição das Tabelas
    └── seed.ts             # Dados iniciais
```

## 📝 Notas Finais
- **CORS**: O backend está configurado para aceitar requisições de qualquer origem (`origin: true`) para facilitar o desenvolvimento.
- **Segurança**: As senhas são criptografadas antes de serem salvas. Tokens JWT expiram em 1 dia.
- **Roles**: O sistema diferencia automaticamente a interface e as permissões baseando-se na role (`USER` ou `ADMIN`) retornada no login.
