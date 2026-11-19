import { api } from './cliente.js'

export const RESERVA_MINUTOS = 15

export const CONDICOES = {
  'como-novo': 'Como novo',
  otimo: 'Ótimo estado',
  bom: 'Bom estado',
}

// Uma reserva vencida volta a contar como disponível (o "job de limpeza" do documento).
export function statusAtual(peca) {
  if (peca.status === 'reservada' && peca.reservadaAte && new Date(peca.reservadaAte) < new Date()) {
    return 'disponivel'
  }
  return peca.status
}

export const listarPecas = () => api('/pecas')
export const buscarPeca = (id) => api(`/pecas/${id}`)
export const listarCategorias = () => api('/categorias')
export const criarPeca = (dados) => api('/pecas', { method: 'POST', body: dados })
export const atualizarPeca = (id, dados) => api(`/pecas/${id}`, { method: 'PATCH', body: dados })
export const excluirPeca = (id) => api(`/pecas/${id}`, { method: 'DELETE' })

/**
 * Reserva uma peça única por 15 minutos (ADR-003).
 * Sempre relê a peça do servidor antes (nunca do cache) e só reserva se estiver disponível.
 * Observação: no backend real isto é um UPDATE ... WHERE status = 'disponivel' atômico;
 * o json-server não tem transações, então aqui é uma simulação didática.
 */
export async function reservarPeca(id) {
  const peca = await buscarPeca(id)
  if (statusAtual(peca) !== 'disponivel') {
    throw new Error('Esta peça acabou de ser reservada ou vendida por outra pessoa.')
  }
  const reservadaAte = new Date(Date.now() + RESERVA_MINUTOS * 60 * 1000).toISOString()
  return atualizarPeca(id, { status: 'reservada', reservadaAte })
}

export const liberarPeca = (id) => atualizarPeca(id, { status: 'disponivel', reservadaAte: null })
