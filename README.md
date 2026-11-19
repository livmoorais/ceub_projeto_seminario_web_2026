# desaPego · Seminário Web 2026

Projeto da disciplina **Desenvolvimento Web** do **CEUB**: o brechó online **desaPego**.

O desaPego é o projeto do nosso grupo e também é usado em outra disciplina. O repositório do
grupo, com requisitos, diagramas UML e issues, é o
[mariaclarapma/Desa-Pego](https://github.com/mariaclarapma/Desa-Pego). Aqui fica só a parte de
Desenvolvimento Web:

| Pasta | O que tem |
| --- | --- |
| [`docs/`](docs/ARQUITETURA.md) | **Documento de Arquitetura de Sistema Web** (atividade da disciplina) |
| [`frontend/`](frontend/README.md) | site em **Next.js (React) + TypeScript + Tailwind**: Home da Clarice, vitrine, página da peça, sacola com reserva de 15 minutos, checkout e Pix simulado |
| [`backend/`](backend/README.md) | **API REST simulada** com json-server, no lugar do backend NestJS enquanto ele não existe |

## Como rodar

Pré-requisito: **Node.js 20 ou mais novo** (`node -v` para conferir).

```bash
npm install      # instala as dependências do frontend e do backend
npm run dev      # sobe o backend (porta 3001) e o frontend (porta 3000) juntos
```

Abra **http://localhost:3000**.

| Comando (na raiz) | O que faz |
| --- | --- |
| `npm run dev` | sobe backend e frontend juntos |
| `npm run dev:frontend` / `npm run dev:backend` | sobe só um dos dois |
| `npm test` | testes do frontend (Vitest + Testing Library) |
| `npm run lint` / `npm run typecheck` | ESLint e checagem de tipos |
| `npm run build` | build de produção do frontend |
| `npm run reset-db` | volta o catálogo ao estado inicial (com o `npm run dev` parado) |

## Como testar uma compra

1. Na vitrine (`/catalogo`), busque ou filtre uma peça e abra a página dela.
2. **Colocar na sacola** reserva a peça por 15 minutos. Em outra aba, a mesma peça aparece como *reservada*.
3. Na sacola, **fechar com Pix**: o CEP preenche o endereço sozinho (ViaCEP) e o frete é fixo.
4. **Gerar Pix** cria o pedido aguardando pagamento, com QR Code e código copia-e-cola.
5. **Simular pagamento (demo)** faz o papel do webhook do Mercado Pago: o pedido fica pago e a peça sai da vitrine.

Nenhum pagamento real é feito.

## Acessibilidade

- **Modo claro e escuro:** botão de sol/lua no cabeçalho. Por padrão o site segue o tema do sistema.
- **Barra de acessibilidade** (lateral esquerda; no celular, canto inferior): Libras com o VLibras do governo
  federal, leitor de voz e opções visuais (tema, alto contraste e tamanho da fonte).
- Todas as combinações de cor passam no **WCAG 2.1 AA** nos três temas (claro, escuro e alto contraste).

Detalhes em [`frontend/README.md`](frontend/README.md#acessibilidade).

## Abrindo no Antigravity

1. No Antigravity, **File → Open Folder** e escolha a pasta do repositório (ou clone com
   **Clone Repository** usando `https://github.com/livmoorais/ceub_projeto_seminario_web_2026.git`).
2. Aceite instalar as extensões recomendadas (Tailwind CSS, ESLint e Vitest).
3. Para rodar: **Terminal → Run Build Task** (⇧⌘B) executa `npm run dev`.
4. O agente do Antigravity lê o [`AGENTS.md`](AGENTS.md) com as regras do projeto. No chat do agente,
   digite `/` para usar os workflows de [`.agents/workflows/`](.agents/workflows):
   - `/rodar-projeto`: instala as dependências e sobe backend e frontend;
   - `/nova-tela`: cria uma página nova seguindo o padrão do projeto;
   - `/entregar`: roda testes, lint e build e envia as alterações para o GitHub.

## Relação com o documento de arquitetura

| Documento | Neste repositório |
| --- | --- |
| Next.js (React) com TypeScript, SSR/ISR | ✔ Home com ISR; vitrine e peça renderizadas no servidor a cada acesso |
| Tailwind CSS | ✔ com as cores do CEUB (roxo e lilás), em modo claro, escuro e alto contraste |
| Acessibilidade | ✔ barra de acessibilidade (VLibras, leitor de voz, contraste e fonte); contraste WCAG AA nos 3 temas |
| Zustand para o carrinho | ✔ `frontend/src/lib/sacola.ts` |
| Vitest + Testing Library | ✔ `npm test` |
| ADR-003: reserva de peça única com expiração de 15 min | ✔ reserva ao colocar na sacola; reserva vencida volta para a vitrine |
| Estoque e preço nunca vêm do cache no checkout | ✔ o checkout relê cada peça na API antes de criar o pedido |
| Backend NestJS + PostgreSQL + Redis | json-server em `backend/` (API REST simulada) |
| Pagamento pelo Mercado Pago com webhook | Pix simulado, confirmado por um botão de demonstração |
| Frete pelo Melhor Envio | frete fixo, como no MVP do grupo |
| Login, perfis e 2FA | ainda não implementados |

## Autoria

Projeto acadêmico do grupo desaPego, curso de Ciência da Computação do CEUB.
A Home, a identidade visual e os componentes base do frontend são da Clarice Nunes, e o histórico
do Git preserva a autoria de cada parte.
