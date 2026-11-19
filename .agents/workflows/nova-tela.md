---
description: Criar uma nova tela (página) no Desa Pego seguindo o padrão do projeto
---

1. Leia `AGENTS.md` e `src/App.jsx` para entender as rotas existentes.
2. Se a tela precisar de dados novos da API, adicione a função em `src/api/` (no arquivo do módulo certo)
   e, se for preciso, o novo recurso em `db.seed.json`.
3. Crie a página em `src/pages/` (ou `src/pages/admin/` se for do painel), usando `useEffect` + `useState`
   e os componentes `Carregando` / `ErroApi`.
4. Registre a rota em `src/App.jsx`, dentro do layout certo (`LojaLayout` ou `AdminLayout`).
5. Se a tela tiver link no menu, adicione-o em `src/layouts/`.
6. Verifique:

// turbo
```bash
npm run lint && npm run build
```

7. Rode `npm run dev` e teste a tela no navegador, inclusive em largura de celular (375 px).
