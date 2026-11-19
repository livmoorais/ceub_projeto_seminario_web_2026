import { api } from './cliente.js'
import { atualizarPeca } from './catalogo.js'

export const listarPedidos = () => api('/pedidos?_sort=-criadoEm')
export const buscarPedido = (id) => api(`/pedidos/${id}`)

/**
 * Cria o pedido e marca as peças como vendidas.
 * No sistema real o pedido nasce "pendente" e só vira "pago" quando o webhook
 * do Mercado Pago confirma; aqui o pagamento é simulado como aprovado.
 */
export async function criarPedido(dados) {
  const pedido = await api('/pedidos', {
    method: 'POST',
    body: { ...dados, status: 'pago', criadoEm: new Date().toISOString() },
  })
  await Promise.all(
    dados.itens.map((item) => atualizarPeca(item.id, { status: 'vendida', reservadaAte: null })),
  )
  return pedido
}

export const atualizarPedido = (id, dados) => api(`/pedidos/${id}`, { method: 'PATCH', body: dados })
