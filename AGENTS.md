# Instruções para agentes (Antigravity, Claude Code e outros)

Projeto acadêmico da disciplina **Desenvolvimento Web (React JS)** do CEUB: protótipo do
brechó online **Desa Pego**, seguindo o documento de arquitetura em `docs/ARQUITETURA.md`.

## Stack

- React 19 + Vite, em **JavaScript (JSX)**: é o que a disciplina ensina. Não converter para TypeScript.
- React Router (`BrowserRouter`, `Routes`, `Route`, `Link`, `useParams`, `<Outlet />`).
- Tailwind CSS v4 (cores do tema em `src/index.css`: `ameixa`, `terracota`, `creme`, `papel`, `tinta`, `musgo`).
- Zustand para o carrinho (`src/store/carrinho.js`).
- json-server como API simulada: `db.seed.json` é o catálogo original; `db.json` é gerado e fica fora do Git.

## Comandos

- `npm install`: instala as dependências.
- `npm run dev`: sobe a API (porta 3001) e o site (porta 5173).
- `npm run lint`: oxlint. Precisa passar sem avisos.
- `npm run build`: build de produção. Precisa passar antes de qualquer commit.
- `npm run reset-db`: restaura o catálogo (com o servidor parado).

## Convenções

- Textos da interface, nomes de variáveis, funções e arquivos em **português** (ex.: `listarPecas`, `DetalhePeca.jsx`).
- Toda chamada HTTP passa por `src/api/` (um arquivo por módulo: `catalogo.js`, `pedidos.js`, `frete.js`).
  Componentes e páginas não chamam `fetch` diretamente.
- Páginas em `src/pages/`, componentes reutilizáveis em `src/components/`, layouts com `<Outlet />` em `src/layouts/`.
- Novas rotas são registradas em `src/App.jsx`.
- Busca de dados com `useEffect` + `useState`, tratando os estados de carregando e de erro
  (`Carregando` e `ErroApi` em `src/components/Carregando.jsx`).
- Layout responsivo: testar também em 375 px de largura.

## Regras de negócio que não podem quebrar

- Cada peça é única. Ao entrar na sacola, a peça é **reservada por 15 minutos** (`reservarPeca` em
  `src/api/catalogo.js`). Uma reserva vencida volta a contar como disponível (`statusAtual`).
- No checkout, as peças são relidas do servidor (nunca do cache) antes de criar o pedido.
- Dados de cartão nunca são digitados no nosso formulário (no sistema real vão direto ao gateway).

## Não fazer

- Não subir `.env`, chaves ou `db.json`.
- Não adicionar backend real, banco de dados ou Docker sem pedido explícito: o escopo da disciplina é o frontend React.
- Não copiar material dos slides da aula para o repositório (o repositório é público).
