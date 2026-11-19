---
description: Instalar dependências e rodar o Desa Pego (API simulada + site)
---

1. Instale as dependências, se a pasta `node_modules` não existir:

// turbo
```bash
npm install
```

2. Suba a API (porta 3001) e o site (porta 5173) juntos, em segundo plano:

```bash
npm run dev
```

3. Abra http://localhost:5173 no navegador e confira se a vitrine lista as peças.
   O painel administrativo fica em http://localhost:5173/admin.
