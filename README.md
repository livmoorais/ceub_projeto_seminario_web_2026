# Desa Pego — Brechó Online · Seminário Web 2026

Projeto da disciplina **Desenvolvimento Web (React JS)** do **CEUB**. Reúne:

1. a atividade da disciplina: o **[Documento de Arquitetura de Sistema Web](docs/ARQUITETURA.md)** do Desa Pego (v1.0);
2. um **protótipo funcional em React** que implementa o frontend descrito nesse documento.

O Desa Pego é o projeto do nosso grupo, que também é usado em outra disciplina. O repositório
do grupo (requisitos, diagramas UML e organização das issues) está em
[mariaclarapma/Desa-Pego](https://github.com/mariaclarapma/Desa-Pego). Aqui fica só a parte
de Desenvolvimento Web.

## Como rodar

Pré-requisito: **Node.js 20+** (`node -v` para conferir).

```bash
npm install      # baixa as dependências para node_modules/
npm run dev      # sobe a API (porta 3001) e o site (porta 5173) juntos
```

Abra **http://localhost:5173**. O painel administrativo fica em **http://localhost:5173/admin**.

| Comando            | O que faz                                                        |
| ------------------ | ---------------------------------------------------------------- |
| `npm run dev`      | Sobe API (json-server) + site (Vite) ao mesmo tempo              |
| `npm run web`      | Só o site                                                        |
| `npm run api`      | Só a API simulada em http://localhost:3001                       |
| `npm run reset-db` | Restaura o catálogo original (apaga pedidos de teste). Rode com o `npm run dev` parado |
| `npm run build`    | Gera a versão de produção em `dist/` (o "bundle" da aula)        |
| `npm run lint`     | Verifica o código com o oxlint                                   |

O arquivo `db.json` (os dados que a API simulada altera) é criado automaticamente a partir de
`db.seed.json` na primeira execução e não vai para o Git.

## Abrindo no Antigravity

1. Abra o Antigravity e use **File → Open Folder** nesta pasta.
2. Aceite instalar as extensões recomendadas (Tailwind CSS IntelliSense e oxc).
3. Para rodar: **Terminal → Run Build Task** (⇧⌘B) executa `npm run dev`.
4. O agente do Antigravity lê o [`AGENTS.md`](AGENTS.md) com as regras do projeto. No chat do agente,
   digite `/` para usar os workflows prontos em [`.agents/workflows/`](.agents/workflows):
   - `/rodar-projeto`: instala as dependências e sobe a API e o site;
   - `/nova-tela`: cria uma página nova seguindo o padrão do projeto;
   - `/entregar`: roda lint e build e envia as alterações para o GitHub.

## O que dá para fazer

- **Vitrine** com busca textual e filtros (categoria, tamanho, condição, preço, só disponíveis).
- **Página da peça** (`/peca/:id`) com medidas, condição e status (disponível / reservada / vendida).
- **Sacola com reserva de 15 minutos**: ao entrar na sacola a peça fica *reservada* para
  os outros clientes, com contagem regressiva; se expirar, volta ao catálogo.
- **Checkout** com cálculo de frete por CEP (PAC/SEDEX simulados) e escolha de Pix, cartão ou boleto.
- **Painel admin**: resumo de vendas, lista de peças (mudar status, excluir), cadastro de peça e
  gestão de pedidos (pago → enviado → entregue).

## Conceitos da aula usados

| Conceito                         | Onde está                                                  |
| -------------------------------- | ---------------------------------------------------------- |
| Componentes e JSX                | `src/components/` (ex.: `CardPeca.jsx`)                    |
| `useState` / `useEffect` + `fetch` | `src/pages/Vitrine.jsx`, `src/api/cliente.js`            |
| json-server (API a partir de um `.json`) | `db.json`, script `npm run api`                    |
| `BrowserRouter`, `Routes`, `Route` | `src/main.jsx`, `src/App.jsx`                            |
| `<Link>` (sem recarregar a página) | `src/layouts/LojaLayout.jsx`                             |
| Rotas dinâmicas + `useParams()`  | `/peca/:id` → `src/pages/DetalhePeca.jsx`                  |
| Layouts aninhados com `<Outlet />` | `src/layouts/LojaLayout.jsx` e `AdminLayout.jsx`         |
| Transpilação + bundle            | Vite faz o papel de Babel + Browserify (`npm run build`)   |

## Estrutura

```
ceub_projeto_seminario_web_2026/
├── AGENTS.md          # instruções para o agente do Antigravity (e outros)
├── .agents/workflows/ # workflows do Antigravity (/rodar-projeto, /nova-tela, /entregar)
├── docs/ARQUITETURA.md# documento de arquitetura (atividade da disciplina)
├── db.seed.json       # catálogo original da API simulada
├── db.json            # cópia de trabalho, gerada automaticamente (fora do Git)
├── index.html         # o palco: <div id="root">
├── vite.config.js
└── src/
    ├── main.jsx       # ponto de montagem + BrowserRouter
    ├── App.jsx        # mapa de rotas
    ├── api/           # acesso à API, separado por módulo (catálogo, pedidos, frete)
    ├── store/         # estado do carrinho (Zustand)
    ├── components/    # peças reutilizáveis de interface
    ├── layouts/       # layouts fixos com <Outlet />
    └── pages/         # telas da loja e do admin
```

## Relação com o documento de arquitetura

O documento define a arquitetura de **produção**. Este protótipo é o **frontend do MVP** rodando
sobre uma API simulada, seguindo as mesmas decisões onde faz sentido em sala de aula:

| Documento (produção)                         | Protótipo (este projeto)                               |
| -------------------------------------------- | ------------------------------------------------------ |
| Next.js (SSR/ISR) + TypeScript               | React + Vite (SPA) em JavaScript, como na aula         |
| Backend NestJS + PostgreSQL                  | json-server lendo `db.json`                            |
| Tailwind CSS                                 | Tailwind CSS ✔                                         |
| Zustand para o carrinho                      | Zustand ✔                                              |
| Módulos Catálogo / Pedidos / Frete           | `src/api/catalogo.js`, `pedidos.js`, `frete.js` ✔      |
| ADR-003: reserva de peça única com TTL 15 min| Reserva com `reservadaAte` e expiração ✔ (sem atomicidade real — o json-server não tem transações) |
| Mercado Pago + webhook                       | Pagamento simulado, pedido já nasce "pago"             |
| Melhor Envio                                 | Frete calculado pela região do CEP                     |
| Fotos no S3 + Cloudflare                     | Ícone + cor de fundo no lugar da foto                  |
| Login, RBAC e 2FA no admin                   | Admin aberto (não implementado no protótipo)           |

Para apontar o site para outra API, crie um arquivo `.env` com `VITE_API_URL=http://endereco-da-api`.
