# Help Desk + (Chamado Web)

Sistema de gerenciamento de chamados para centralizar solicitações de suporte, desenvolvido como trabalho final da disciplina de Desenvolvimento Web.

## 🎯 Objetivo
Resolver o problema de descentralização de pedidos de suporte (WhatsApp, papel, verbal) criando uma aplicação web simples e eficiente para registro e acompanhamento.

## 🏗 Arquitetura e Tecnologias

### Back End
- **Linguagem**: TypeScript (Node.js)
- **Framework Web**: Fastify
- **ORM**: Prisma
- **Banco de Dados**: SQLite (Ambiente de Desenvolvimento)
- **Autenticação**: JWT (@fastify/jwt) + Bcrypt (bcryptjs)
- **Documentação**: Swagger UI (@fastify/swagger)

### Padrões de Projeto (Architecture Patterns)
O projeto segue uma arquitetura em camadas bem definida para garantir escalabilidade e manutenção:

1.  **Routes** (`src/routes`):
    *   Definem os endpoints da API.
    *   Configuram middlewares e injetam dependências.
    *   Fluxo: Rota -> Controller.

2.  **Controllers** (`src/controllers`):
    *   Gerenciam a entrada (Request) e saída (Reply) HTTP.
    *   Validam dados básicos de entrada.
    *   Fluxo: Controller -> Service.

3.  **Services** (`src/services`):
    *   Contêm TODA a **Regra de Negócio** (ex: verificar senha, validar existência, filtrar por permissão).
    *   São agnósticos ao protocolo HTTP (não conhecem Request/Reply).
    *   Fluxo: Service -> Repository.

4.  **Repositories** (`src/repositories`):
    *   Implementam o acesso direto aos dados (Banco de Dados).
    *   Seguem o **Repository Pattern** definidos pelas Interfaces.
    *   Fluxo: Repository -> Prisma (Banco).

5.  **Interfaces** (`src/interfaces`):
    *   Contratos que definem os métodos obrigatórios dos repositórios.

6.  **Singleton**:
    *   O `PrismaClient` é instanciado uma única vez para gerenciar conexões eficientemente.

## 🧩 Modelo de Dados

### Entidades Principais
1. **User** (Usuários)
   - Tipos: `USER` (Comum), `ADMIN` (Administrador)
   - Campos: id, nome, email, senha, role, created_at.
   - Relacionamento: Possui muitos Chamados (1:N).

2. **Chamado** (Tickets)
   - Status: `ABERTO`, `EM_ANDAMENTO`, `FECHADO`
   - Prioridade: `BAIXA`, `MEDIA`, `ALTA`
   - Campos: id, titulo, descricao, status, prioridade, usuarioId.
   - Relacionamento: Pertence a um Usuário.

## 📋 Status do Projeto

### ✅ Fase 0: Preparação
- Definição do escopo, problema e entidades.

### ✅ Fase 1: Setup do Projeto
- Configuração do ambiente (Node.js, TypeScript, Fastify).
- Configuração do Prisma com SQLite.
- Estruturação inicial de pastas.

### ✅ Fase 2: Modelagem e Persistência
- Criação dos Models no `schema.prisma`.
- Implementação do **Repository Pattern** (`IUserRepository`, `IChamadoRepository`).
- Criação de script de Seed (`prisma/seed.ts`) para popular o banco.

### ✅ Fase 3: Autenticação e Autorização
- Implementação de Hash de senha com `bcryptjs`.
- Criação de Login com geração de JWT.
- Middlewares: `ensureAuthenticated` e `ensureAdmin`.

### ✅ Fase 4: CRUD e Regras de Negócio (Atual)
- **Implementação da Camada de Serviço (Services)**:
  - `UserService`: Lógica de criação e autenticação.
  - `ChamadoService`: Lógica de CRUD e filtros por role.
- **CRUD Completo de Chamados**:
  - Listagem (Admin vê tudo, User vê seus).
  - Detalhes, Criação, Atualização e Exclusão.
- **Refatoração**: Padronização de todo o projeto para usar a arquitetura Controller-Service-Repository.

## 🚀 Como Rodar

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Gere o cliente Prisma**:
   ```bash
   npx prisma generate
   ```

3. **Configure o banco de dados** (Migração e Seed):
   ```bash
   npx prisma migrate dev
   npx tsx prisma/seed.ts
   ```

4. **Inicie o servidor**:
   ```bash
   npm run dev
   ```

5. **Acesse a documentação**:
   Abra `http://localhost:3333/documentation` no navegador para ver e testar a API via Swagger.
