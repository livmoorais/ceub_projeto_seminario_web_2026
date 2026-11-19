---
description: Conferir o projeto e enviar as alterações para o GitHub
---

1. Rode testes, lint, typecheck e build na raiz; todos precisam passar:

// turbo
```bash
npm test && npm run lint && npm run typecheck && npm run build
```

2. Confira o que mudou e garanta que nenhum `.env` ou `backend/db.json` está na lista:

// turbo
```bash
git status
```

3. Faça o commit com uma mensagem clara em português (ex.: `feat(frontend): tela de favoritos`).
4. Envie com `git push`.
