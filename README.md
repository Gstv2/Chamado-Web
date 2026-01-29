# Help Desk + (Chamado Web)

Sistema de gerenciamento de chamados para centralizar solicitações de suporte, desenvolvido como trabalho final da disciplina de Desenvolvimento Web.

## 📝 Introdução
Este projeto surge da necessidade de organizar o fluxo de solicitações de TI em pequenas e médias empresas, onde muitas vezes os pedidos são feitos de forma informal (WhatsApp, verbalmente ou anotações em papel).

O **Chamado Web** é uma API RESTful robusta que permite o registro, acompanhamento e gestão dessas solicitações de forma centralizada, segura e auditável. O sistema foi projetado focando em boas práticas de engenharia de software, separação de responsabilidades e escalabilidade.

## 🎯 Objetivo
Resolver o problema de descentralização de pedidos de suporte criando uma aplicação web simples e eficiente para registro e acompanhamento.

## 📈 Estratégia de Desenvolvimento
O desenvolvimento foi conduzido de forma incremental e iterativa, dividido em **Fases** bem definidas para garantir a entrega contínua de valor e a facilidade de manutenção.

1.  **Foco no MVP (Minimum Viable Product)**: Priorizamos as funcionalidades essenciais (CRUD de Chamados e Usuários) nas primeiras fases.
2.  **Arquitetura Evolutiva**: Começamos com uma estrutura simples e refatoramos para uma arquitetura em camadas (Controller-Service-Repository) na Fase 4, quando a complexidade exigiu.
3.  **Segurança e Robustez**: Implementamos autenticação (JWT) e validação rigorosa (Zod) apenas após ter o núcleo funcional, garantindo que a base estivesse sólida.
4.  **Qualidade de Código**: Uso de TypeScript para tipagem estática, ESLint (implícito) e Prettier para padronização, e comentários educativos em todo o código.

## 🏗 Arquitetura e Tecnologias

### Back End
- **Linguagem**: TypeScript (Node.js)
- **Framework Web**: Fastify (Alta performance e baixo overhead)
- **ORM**: Prisma (Segurança de tipos e facilidade de migração)
- **Banco de Dados**: SQLite (Ideal para desenvolvimento e prototipagem rápida)
- **Autenticação**: JWT (@fastify/jwt) + Bcrypt (bcryptjs)
- **Documentação**: Swagger UI (@fastify/swagger)
- **Validação**: Zod (Schema Validation)

### Padrões de Projeto (Design Patterns)
O projeto aplica diversos padrões de projeto clássicos e modernos para resolver problemas comuns de arquitetura:

1.  **Repository Pattern**:
    *   **Problema**: Código de negócio acoplado diretamente ao banco de dados.
    *   **Solução**: Abstração do acesso a dados em classes `Repository`. Permite trocar o ORM ou o Banco sem afetar as regras de negócio.

2.  **Service Layer (Business Logic Layer)**:
    *   **Problema**: Regras de negócio espalhadas nos Controllers.
    *   **Solução**: Centralização de toda a lógica (validações de negócio, cálculos) em classes `Service`. Os Controllers tornam-se apenas "porteiros" HTTP.

3.  **Dependency Injection (DI)**:
    *   **Problema**: Alto acoplamento entre classes (Service criando instância de Repository com `new`).
    *   **Solução**: As dependências são injetadas via construtor (ex: `UserService` recebe `IUserRepository`). Facilita testes unitários (Mocking).

4.  **Singleton**:
    *   **Uso**: O `PrismaClient` é instanciado uma única vez em `server.ts` e compartilhado por toda a aplicação para gerenciar eficientemente o pool de conexões.

5.  **DTO (Data Transfer Object)**:
    *   **Uso**: Objetos simples (frequentemente inferidos pelo Zod ou interfaces manuais) usados para transportar dados entre as camadas, garantindo que a senha do usuário não trafegue na resposta, por exemplo.

6.  **Adapter Pattern**:
    *   **Uso**: O Fastify atua como um adaptador HTTP, e nossos Controllers adaptam as requisições Web para chamadas de método nos Services.

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

### ✅ Fase 4: CRUD e Regras de Negócio
- Implementação da Camada de Serviço (Services).
- CRUD Completo de Chamados.
- Refatoração para arquitetura Controller-Service-Repository.

### ✅ Fase 5: Regras, Validações e Erros
- **Validação de Dados**: Uso da biblioteca **Zod** para garantir a integridade dos dados de entrada.
- **Tratamento de Erros Global**: Implementação de `setErrorHandler` no Fastify.
- **Classe AppError**: Padronização de erros de regra de negócio (Message + StatusCode).
- **Robustez**: API preparada para lidar com falhas e entradas inválidas sem crashar.

### ✅ Fase 6: Testes e Refinamento
- **Testes Manuais Automatizados**: Script para validar todos os endpoints (Login, CRUD, Permissões).
- **Correções de Bugs**: Ajuste de rotas (PUT -> PATCH) e validações.
- **Refinamento**: Revisão de código e comentários.

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

## 🧪 Como Testar (Testes Automatizados)

Para rodar a suite de testes de simulação (que testa login, criação, listagem, atualização e deleção):

```bash
npx ts-node scripts/test-simulation.ts
```

> **Nota**: O script limpa o banco de dados antes de rodar os testes. Use apenas em ambiente de desenvolvimento.

## 🖥️ Front-end (Fase 7)

O front-end está localizado na pasta `/frontend` e foi desenvolvido com React + TypeScript (Vite).

### ⚙️ Pré-requisitos
- O backend deve estar rodando (localmente ou na AWS).
- O backend agora possui **CORS habilitado** para aceitar requisições do frontend.

### 🚀 Como Rodar o Front-end
1. Entre na pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz da pasta `frontend` para configurar a URL da API:
   - Para rodar localmente:
     ```env
     VITE_API_URL=http://localhost:3333
     ```
   - Para rodar conectado à AWS (quando o deploy estiver feito):
     ```env
     VITE_API_URL=http://seu-ip-ou-dominio-aws:3333
     ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse http://localhost:5173 no seu navegador.

### ☁️ Integração com AWS
O projeto foi preparado para que o backend seja hospedado na AWS (EC2, App Runner, etc).
Para integrar o front-end (local ou também na nuvem) com o backend na AWS:
1. Faça o deploy do backend na AWS.
2. Obtenha o IP público ou domínio da instância.
3. Atualize a variável `VITE_API_URL` no arquivo `.env` do frontend.
