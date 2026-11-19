# frontend — desaPego

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4, conforme o [Documento de Arquitetura](../docs/ARQUITETURA.md).

Feito pela Clarice Nunes (Home, identidade visual e componentes base) e ampliado com a vitrine,
a página da peça, a sacola com reserva, o checkout e o pedido com Pix.

Os comandos abaixo rodam dentro de `frontend/`. Na raiz do repositório, `npm run dev` sobe o
frontend junto com o [backend](../backend/README.md), que o frontend precisa para listar as peças.

```bash
npm install
npm run dev        # http://localhost:3000 (precisa do backend em http://localhost:3001)
npm test           # Vitest + Testing Library
npm run lint
npm run typecheck
npm run build
```

## Organização

| Pasta | Conteúdo |
| --- | --- |
| `src/app` | rotas (Home em `page.tsx`, 404 amigável em `not-found.tsx`), layout e tokens de marca (`globals.css`) |
| `src/app/catalogo` | vitrine com busca sem acento, filtros e ordenação na URL (Req. 007) |
| `src/app/peca/[id]` | página da peça, com status lido da API a cada acesso (Req. 008) |
| `src/app/carrinho` | sacola com a contagem regressiva da reserva de 15 min (Req. 010) |
| `src/app/checkout` e `src/app/pedido/[id]` | endereço pelo ViaCEP, frete fixo e Pix simulado (Req. 011) |
| `src/components/sacola` | botão de reservar, contador e selo de quantidade no cabeçalho |
| `src/lib/api` | acesso à API REST do backend (`catalogo.ts`, `pedidos.ts`) |
| `src/lib/sacola.ts` | estado da sacola (Zustand, salvo no navegador) |
| `src/components/ui` | peças base: `Button`, `Sticker`, `ConditionBadge` (selos do Req. 004), `SectionHeading`, ícones SVG |
| `src/components/layout` | `SiteHeader` (busca, categorias, menu mobile), `SiteFooter` |
| `src/components/catalogo` | `ProductCard` e `FavoriteButton`, reaproveitáveis na vitrine do Req. 007 |
| `src/components/home` | seções da Home |
| `src/lib` | `routes.ts` (todas as URLs) e `format.ts` (preço em centavos → BRL) |
| `src/data/demo` | ⚠️ **dados e fotos de demonstração** usados pela Home; as demais páginas já leem da API |

## Identidade visual

- **Cores** (tokens Tailwind): `creme` fundo · `vinho` texto · `cereja` ação · `chiclete`, `lilas`, `pessego` apoio.
- **Tipos:** Fraunces (títulos, itálico expressivo) · DM Sans (interface) · Caveat (adesivos e anotações).
- **Linguagem:** contorno vinho de 2px + sombra sólida deslocada ("adesivo"), recortes em arco, fita adesiva, colagens.
- O logotipo é sempre escrito **desaPego**.

## Fotos de demonstração

Vêm do Unsplash (`src/data/demo/imagens.ts` e `catalogo.ts`). Para trocar, edite o ID ou aponte para um arquivo em `/public`.
Quando as fotos vierem do S3/CDN, adicione o host em `next.config.ts` → `images.remotePatterns`.
