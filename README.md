# Assistente de Manutenção de Ativos

Este é um projeto full-stack desenvolvido como parte do Desafio Relâmpago 3 da Alpha Ed/Tech. O sistema permite aos usuários cadastrar seus ativos (equipamentos, veículos, etc.) e gerenciar suas manutenções, recebendo alertas para próximas intervenções e mantendo um histórico organizado.

## Visão Geral do Cliente

"Preciso de um sistema online onde eu possa cadastrar todos os meus equipamentos/veículos importantes (meus 'ativos') e nunca mais esquecer de uma manutenção. Quero um lugar central para ver o que precisa ser feito, o que já foi feito, e quando as próximas manutenções estão chegando. Basicamente, quero que o sistema me ajude a manter tudo em dia e a ter um histórico organizado."

## Funcionalidades Principais

*   **Contas de Usuário Seguras:** Cadastro e login de usuários com autenticação baseada em JWT. Cada usuário tem acesso apenas aos seus próprios ativos e manutenções.
*   **Cadastro de Ativos:** Permite adicionar, visualizar, editar e remover qualquer tipo de ativo que necessite de manutenção (CRUD completo).
*   **Registro de Manutenções:** Para cada ativo, o usuário pode registrar, visualizar, editar e deletar manutenções (CRUD completo), incluindo a previsão para a próxima intervenção.
*   **Dashboard Inteligente:** Uma tela principal que exibe ativos com manutenções próximas ou vencidas, com destaque visual para urgência.

## Tecnologias Utilizadas

**Backend:**
*   Linguagem: TypeScript
*   Framework: Express.js
*   Banco de Dados: PostgreSQL
*   Conexão com BD: Módulo `pg` (Node-Postgres)
*   Autenticação: JSON Web Tokens (JWT)
*   Hashing de Senha: bcryptjs

**Frontend:**
*   Biblioteca: React (com Create React App)
*   Linguagem: TypeScript
*   Componentização/Estilização: Material-UI (MUI)
*   Gerenciamento de Estado (Autenticação): React Context API
*   Requisições HTTP: Axios
*   Roteamento: React Router DOM v6
*   Manipulação de Datas: date-fns

**Ferramentas de Desenvolvimento:**
*   Node.js e npm
*   Concurrently (Para rodar backend e frontend simultaneamente)
*   Nodemon (Auto-reload do backend)
*   ts-node (Executar TypeScript diretamente)
*   tsconfig-paths (Resolver aliases de path no ts-node)
*   tscpaths (Resolver aliases de path no build de produção)
*   ESLint & Prettier (Linting e formatação de código)

## Estrutura do Projeto
/projeto-manutencao-ativos
├── backend/ # Código do servidor Node.js/Express.js
│ ├── src/
│ ├── .env.example
│ └── package.json
├── frontend/ # Código da aplicação React
│ ├── src/
│ ├── public/
│ └── package.json
├── .gitignore
├── package.json # package.json raiz para scripts globais
└── README.md

*(Pastas como `dist/` e `node_modules/` são geradas e ignoradas pelo `.gitignore`)*

## Pré-requisitos

*   Node.js (versão 18.x ou LTS mais recente recomendada)
*   npm (versão 8.x ou LTS mais recente recomendada, geralmente vem com Node.js)
*   PostgreSQL (instalado e rodando localmente ou acessível)

## Configuração do Ambiente

1.  **Clone o Repositório (se aplicável):**
    ```bash
    git clone <sua-url-do-repositorio>
    cd projeto-manutencao-ativos
    ```

2.  **Instalar Todas as Dependências:**
    A partir da **pasta raiz do projeto**, execute o script `install-all`. Este script instalará as dependências da raiz, do backend e do frontend.
    ```bash
    npm run install-all
    ```
    *(Este script deve estar definido no `package.json` da raiz como: `npm install && npm install --prefix backend && npm install --prefix frontend`)*

3.  **Configurar Variáveis de Ambiente do Backend:**
    *   Navegue até a pasta `backend/`.
    *   Copie o arquivo `backend/.env.example` para `backend/.env`.
    *   Edite o arquivo `backend/.env` com suas configurações:
        ```env
        PORT=3001
        DATABASE_URL=postgresql://SEU_USUARIO_DB:SUA_SENHA_DB@localhost:5432/seu_banco
        JWT_SECRET=coloque_uma_string_secreta_bem_longa_e_aleatoria_aqui
        JWT_EXPIRES_IN=1d # Ou outro valor como 7d, 24h
        ```

4.  **Configurar Banco de Dados PostgreSQL:**
    *   Certifique-se de que o servidor PostgreSQL está rodando.
    *   Crie um banco de dados no PostgreSQL (ex: `manutencao_db` ou o nome que você colocou em `DATABASE_URL`).
    *   Crie um usuário no PostgreSQL (ex: `desafio_user` com a senha `sua_senha_forte`) que será usado pela aplicação para se conectar ao banco. Este usuário e senha devem corresponder aos definidos na `DATABASE_URL`.
    *   **Execute os scripts SQL** para criar as tabelas e conceder permissões. Um arquivo de exemplo `database-setup.sql` com os comandos `CREATE TABLE` e `GRANT` pode ser encontrado em `backend/docs/database-setup.sql` (você precisará criar este arquivo e colocar as DDLs e DMLs nele).
        *   Conecte-se ao seu banco de dados com um superusuário (ex: `postgres`) e execute o script, ou execute os comandos manualmente.
        *   **Exemplo de Comandos Essenciais (substitua `desafio_user` e nomes das tabelas se necessário):**
            ```sql
            -- Conecte-se ao seu banco de dados específico antes de rodar os GRANTs
            -- \c seu_banco; 
            
            GRANT USAGE ON SCHEMA public TO desafio_user;
            GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users TO desafio_user;
            GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE assets TO desafio_user;
            GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE maintenance_records TO desafio_user;
            GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO desafio_user;
            GRANT USAGE, SELECT ON SEQUENCE assets_id_seq TO desafio_user;
            GRANT USAGE, SELECT ON SEQUENCE maintenance_records_id_seq TO desafio_user;
            ```

5.  **Configurar Variáveis de Ambiente do Frontend:**
    *   Na pasta `frontend/`, crie um arquivo `.env` (se não existir automaticamente com `create-react-app`).
    *   Adicione a seguinte variável:
        ```env
        REACT_APP_API_URL=http://localhost:3001/api
        ```
        (Ajuste a porta `3001` se o seu backend estiver rodando em uma porta diferente).

## Como Executar o Projeto (Desenvolvimento)

1.  Abra **um único terminal** na **pasta raiz do projeto**.
2.  Execute o comando:
    ```bash
    npm run dev
    ```
3.  O `concurrently` iniciará:
    *   O servidor backend (API), normalmente em `http://localhost:3001`.
    *   O servidor de desenvolvimento do frontend (React), normalmente em `http://localhost:3000`, que deve abrir automaticamente no seu navegador.

## Scripts Úteis (no `package.json` da raiz)

*   `npm run dev`: Inicia o backend e o frontend em modo de desenvolvimento.
*   `npm run install-all`: Instala todas as dependências do projeto.
*   `npm run build`: (Se configurado) Compila o backend e o frontend para produção.

## Endpoints Principais da API

*   Autenticação: `/api/auth/register`, `/api/auth/login`
*   Ativos: `/api/assets` (e com `:assetId` para específicos)
*   Manutenções: `/api/assets/:assetId/maintenance` (para criar/listar de um ativo), `/api/maintenance/:recordId` (para buscar/atualizar/deletar específico)
*   Dashboard: `/api/dashboard/upcoming`

## Autor

*   [Seu Nome / Seu Usuário do GitHub]
*   Desafio proposto por Alpha Ed/Tech.

---