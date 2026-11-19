# Instruções para agentes (Antigravity, Claude Code e outros)

Projeto acadêmico da disciplina **Desenvolvimento Web** do CEUB: o brechó online **desaPego**.
A arquitetura está em `docs/ARQUITETURA.md`.

## Estrutura

- `frontend/`: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Zustand. Testes com Vitest.
- `backend/`: API REST simulada com json-server (`db.seed.json` é o catálogo original; `db.json` é gerado e fica fora do Git).
- A raiz usa npm workspaces: rode os comandos a partir dela.

## Comandos (na raiz)

- `npm install`: instala tudo.
- `npm run dev`: backend em http://localhost:3001 e frontend em http://localhost:3000.
- `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`: precisam passar antes de qualquer commit.
- `npm run reset-db`: restaura o catálogo (com o servidor parado).

## Convenções do frontend

- Siga a identidade visual definida pela Clarice em `frontend/README.md` e `frontend/src/app/globals.css`:
  use os tokens (`bg-cereja`, `text-vinho`, `border-vinho`...) e os componentes de `src/components/ui`
  (`ButtonLink`/`buttonClasses`, `Sticker`, `SectionHeading`, `ConditionBadge`). Textos da interface em minúsculas e em português.
- Nomes de variáveis, funções e arquivos de lógica em português (`listarPecas`, `reservarPeca`).
- Todas as URLs vêm de `src/lib/routes.ts`. Nunca escreva caminhos soltos.
- Toda chamada HTTP passa por `src/lib/api/` (um arquivo por módulo). Componentes não chamam `fetch` direto
  (exceção: a consulta ao ViaCEP no checkout).
- Valores em dinheiro sempre em **centavos inteiros**; formate com `formatarPreco`.
- Imagens com `next/image`. Hosts novos precisam entrar em `next.config.ts`.
- Lógica nova ganha teste em `*.test.ts(x)` ao lado do arquivo.
- Layout responsivo: teste também em 375 px de largura.

## Regras de negócio que não podem quebrar

- Cada peça é única. Ao entrar na sacola, a peça é **reservada por 15 minutos** (`reservarPeca`).
  Uma reserva vencida volta a contar como disponível (`statusAtual`).
- Vitrine e página da peça leem o status da API a cada acesso (`dynamic = "force-dynamic"`), nunca de cache.
- O checkout relê cada peça antes de criar o pedido.
- Peças vendidas não aparecem na vitrine.

## Não fazer

- Não subir `.env`, chaves ou `backend/db.json`.
- Não alterar a Home e a identidade visual sem pedido explícito: são do trabalho da Clarice.
- Não adicionar banco de dados real, Docker ou NestJS sem pedido explícito.
- Não copiar material dos slides da aula para o repositório (ele é público).
