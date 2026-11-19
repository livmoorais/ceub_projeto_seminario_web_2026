---
description: Conferir o projeto e enviar as alterações para o GitHub
---

1. Rode lint e build; os dois precisam passar:

// turbo
```bash
npm run lint && npm run build
```

2. Confira o que mudou e garanta que nenhum `.env` ou `db.json` está na lista:

// turbo
```bash
git status
```

3. Faça o commit com uma mensagem clara em português (ex.: `feat: tela de favoritos`).
4. Envie com `git push`.
