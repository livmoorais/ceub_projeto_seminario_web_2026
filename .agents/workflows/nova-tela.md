---
description: Criar uma nova tela no frontend do desaPego seguindo o padrão do projeto
---

1. Leia `AGENTS.md`, `frontend/README.md` (identidade visual) e `frontend/src/lib/routes.ts`.
2. Registre a URL nova em `frontend/src/lib/routes.ts`.
3. Se a tela precisar de dados novos, crie a função em `frontend/src/lib/api/` e, se for preciso,
   o recurso em `backend/db.seed.json` (depois rode `npm run reset-db` com o servidor parado).
4. Crie a página em `frontend/src/app/<rota>/page.tsx`. Prefira componente de servidor; use `"use client"`
   só quando precisar de estado ou eventos. Reaproveite `ButtonLink`, `Sticker`, `SectionHeading` e `ProductCard`.
5. Escreva os testes da lógica nova em `*.test.ts(x)`.
6. Verifique:

// turbo
```bash
npm test && npm run lint && npm run typecheck && npm run build
```

7. Rode `npm run dev` e teste a tela no navegador, inclusive em largura de celular (375 px).
