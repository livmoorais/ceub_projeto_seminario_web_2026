# backend — API simulada do desaPego

API REST de desenvolvimento feita com **[json-server](https://github.com/typicode/json-server)**:
ela cria os endpoints `GET`, `POST`, `PATCH` e `DELETE` a partir de um único arquivo JSON, para o
frontend funcionar antes de o backend real (NestJS + PostgreSQL, ver [arquitetura](../docs/ARQUITETURA.md)) existir.

```bash
npm run dev        # http://localhost:3001 (cria db.json a partir de db.seed.json na primeira vez)
npm run reset-db   # volta o catálogo ao estado inicial (com o servidor parado)
```

| Arquivo | Para que serve |
| --- | --- |
| `db.seed.json` | catálogo inicial (mesmas peças e fotos da Home) e lista de pedidos vazia |
| `db.json` | cópia de trabalho que a API altera (reservas, vendas, pedidos). Fica fora do Git |

## Endpoints usados pelo frontend

| Método e rota | Uso |
| --- | --- |
| `GET /pecas` | vitrine |
| `GET /pecas/:id` | página da peça e conferência da reserva no checkout |
| `PATCH /pecas/:id` | reservar (`status: "reservada"`, `reservadaAte`), liberar ou marcar como vendida |
| `POST /pedidos` | criar o pedido aguardando pagamento, com o Pix |
| `GET /pedidos/:id` | página do pedido |
| `PATCH /pedidos/:id` | confirmar o pagamento (papel do webhook do Mercado Pago) |

O json-server não tem transações: a reserva aqui é didática. No backend real ela é um
`UPDATE ... WHERE status = 'disponivel'` atômico (ADR-003).
