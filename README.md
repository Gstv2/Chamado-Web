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
- **Autenticação**: JWT (@fastify/jwt) + Bcrypt
- **Documentação**: Swagger UI (@fastify/swagger)

### Padrões de Projeto (Architecture Patterns)
O projeto segue uma arquitetura modular com separação de responsabilidades:
- **Controllers**: Gerenciam a entrada/saída HTTP (`src/controllers`).
- **Repositories**: Abstraem o acesso a dados (`src/repositories`), seguindo o **Repository Pattern**.
- **Interfaces**: Definem contratos para os repositórios (`src/interfaces`), facilitando testes e desacoplamento.
- **Routes**: Definem os endpoints e injetam as dependências (`src/routes`).
- **Singleton**: O `PrismaClient` é instanciado uma única vez em `server.ts`.

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
- Refatoração dos Controllers para usar Repositórios.
- Criação de script de Seed (`prisma/seed.ts`) para popular o banco.
- Verificação dos relacionamentos no banco de dados.

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
