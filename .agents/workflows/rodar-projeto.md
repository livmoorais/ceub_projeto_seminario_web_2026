---
description: Instalar dependências e rodar o desaPego (backend + frontend)
---

1. Na raiz do repositório, instale as dependências se a pasta `node_modules` não existir:

// turbo
```bash
npm install
```

2. Suba o backend (porta 3001) e o frontend (porta 3000) juntos, em segundo plano:

```bash
npm run dev
```

3. Abra http://localhost:3000 e confira a Home e a vitrine em http://localhost:3000/catalogo.
