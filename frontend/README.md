HelpDesk+ – Sistema de Chamados Web

O *HelpDesk+* é uma aplicação web para centralização e gerenciamento de chamados de suporte, permitindo que usuários registrem solicitações e administradores as gerenciem de forma eficiente.

> ⚠️ *Nota:* Este repositório contém o *Front-end* da aplicação, desenvolvido para ser integrado a uma API REST.

## 🚀 Tecnologias

*   *React* (Vite + TypeScript): Core da aplicação.
*   *Axios*: Cliente HTTP para consumo de API.
*   *React Router DOM*: Gerenciamento de rotas.
*   *Lucide React*: Ícones modernos.
*   *CSS Puro (Vanilla)*: Estilização leve e organizada (Design System próprio).

---

## 📦 Como Rodar o Front-end

1.  *Pré-requisitos*: Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2.  Entre na pasta do frontend:
    bash
    cd frontend
    
3.  Instale as dependências:
    bash
    npm install
    
4.  Inicie o servidor de desenvolvimento:
    bash
    npm run dev
    
5.  Acesse http://localhost:5173 no seu navegador.

---

## 🔗 Integração com Back-end (API)

O Front-end já está configurado para consumir uma API REST rodando em http://localhost:3000.
Para que o sistema funcione completamente, o Back-end deve fornecer os seguintes endpoints:

### Base URL: http://localhost:3000

### 1. Autenticação (/auth)
O sistema espera que o login retorne um *Token JWT* e os dados do usuário.

*   *POST* /auth/login
    *   *Payload*: { "email": "...", "password": "..." }
    *   *Resposta Esperada*:
        json
        {
          "token": "JWT_TOKEN_AQUI",
          "user": { "id": "1", "name": "Nome", "role": "USER" }
        }
        

*   *POST* /auth/register
    *   *Payload*: { "name": "...", "email": "...", "password": "..." }

### 2. Chamados (/chamados)
Todas as requisições abaixo enviam automaticamente o header Authorization: Bearer <TOKEN>.

*   *GET* /chamados
    *   Retorna a lista de chamados do usuário (ou todos, se for Admin).
    *   *Resposta*: Array ([]) de objetos Chamado.

*   *POST* /chamados
    *   Cria um novo chamado.
    *   *Payload*:
        json
        {
          "title": "Computador não liga",
          "description": "Ao apertar o botão, nada acontece...",
          "priority": "ALTA",
          "status": "ABERTO"
        }
        

*   *PUT* /chamados/:id
    *   Atualiza um chamado (ex: mudar status para FECHADO).
    *   *Payload*: { "status": "FECHADO" }

*   *DELETE* /chamados/:id
    *   Remove um chamado do sistema.

---

## � Estrutura do Projeto

O código está organizado dentro da pasta frontend/src:


src/
 ├── components/      # Componentes reutilizáveis (Header, Logo)
 ├── contexts/        # Gerenciamento de Autenticação (Login/Logout)
 ├── pages/           # Telas da aplicação (Login, Dashboard, etc.)
 ├── routes/          # Configuração de rotas privadas e públicas
 ├── services/        # Configuração do Axios (api.ts)
 ├── styles/          # Estilos globais (CSS Variables)
 ├── types/           # Definições de Tipos TypeScript (Interfaces, Enums)
 └── App.tsx          # Componente raiz


## 🎨 Padrões de Dados

Para manter a consistência, o front-end segue estritamente estes tipos:

*   *Status*: ABERTO | EM_ANDAMENTO | FECHADO
*   *Prioridade*: BAIXA | MEDIA | ALTA