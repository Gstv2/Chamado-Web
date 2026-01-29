Este é um template de front-end para o sistema HelpDesk+, desenvolvido com HTML5, CSS3 e JavaScript (ES Modules) puro, sem uso de frameworks.

## Estrutura do Projeto

O projeto segue uma estrutura organizada e modular:


frontend/
├── assets/
│   ├── css/
│   │   ├── base.css        # Variáveis e reset
│   │   ├── layout.css      # Estrutura (Sidebar, Topbar)
│   │   ├── components.css  # Componentes (Cards, Botões, Tabelas)
│   │   └── pages/          # Estilos específicos de páginas
│   │       ├── chamados.css      # Estilos do modal e lista
│   │       ├── dashboard.css     # Estilos do painel
│   │       ├── login.css         # Estilos do login
│   │       └── novo-chamado.css  # Estilos do formulário e dropdown
│   └── js/
│       ├── api.js          # Integração com API REST (Fetch)
│       ├── auth.js         # Controle de autenticação e sessão
│       ├── config.js       # Configurações globais (API URL)
│       └── pages/          # Lógica específica de páginas
├── pages/
│   ├── login.html          # Tela de Login
│   ├── dashboard.html      # Painel Principal
│   ├── chamados.html       # Listagem de Chamados
│   ├── novo-chamado.html   # Formulário de Criação
│   └── perfil.html         # Perfil do Usuário
└── index.html              # Redirecionamento inicial


## Configuração da API

O projeto está configurado para consumir a API REST em:
*http://44.215.110.144:3333*

Para alterar a URL da API, edite o arquivo assets/js/config.js.

## Como Executar

Para rodar o projeto corretamente (evitando bloqueios de segurança do navegador/CORS), é necessário usar um servidor local.

*Opção 1 (Node.js instalado):*
1. Abra o terminal na pasta do projeto (frontend).
2. Execute:
   bash
   npx serve .
   
3. Acesse http://localhost:3000

*Opção 2 (VS Code):*
1. Instale a extensão *Live Server*.
2. Clique com o botão direito em index.html e escolha "Open with Live Server".

*Opção 3 (Python instalado):*
1. Execute no terminal:
   bash
   python -m http.server 3000
   
2. Acesse http://localhost:3000

### Credenciais para Teste

Utilize as credenciais cadastradas na API:

*Administrador*:
- Email: admin@admin.com
- Senha: 123456

*Usuário Comum*:
- Email: user@user.com
- Senha: 123456

## Funcionalidades

- *Autenticação*: Login com JWT e persistência em localStorage.
- *Controle de Acesso*: Diferenciação visual e funcional entre ADMIN e USER.
- *Gestão de Chamados*: Edição de status/prioridade via modal (Admin) e visualização detalhada (User).
- *UI Personalizada*: Selects customizados e Badges de status.
- *Layout Responsivo*: Sidebar colapsável em dispositivos móveis.
- *Integração Real*: Consumo de endpoints REST (/auth, /chamados).