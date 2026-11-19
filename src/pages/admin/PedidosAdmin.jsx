import { useEffect, useState } from 'react'
import { listarPedidos, atualizarPedido } from '../../api/pedidos.js'
import { Carregando, ErroApi } from '../../components/Carregando.jsx'
import { formatarPreco, formatarData } from '../../utils.js'

const ETAPAS = { pago: 'Pago', enviado: 'Enviado', entregue: 'Entregue', cancelado: 'Cancelado' }

export default function PedidosAdmin() {
  const [pedidos, setPedidos] = useState(null)
  const [erro, setErro] = useState(null)

  const carregar = () => listarPedidos().then(setPedidos).catch(setErro)
  useEffect(() => {
    carregar()
  }, [])

  async function mudarStatus(pedido, status) {
    await atualizarPedido(pedido.id, { status })
    carregar()
  }

  if (erro) return <ErroApi erro={erro} />
  if (!pedidos) return <Carregando />

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Pedidos ({pedidos.length})</h1>
      {pedidos.length === 0 && <p className="text-tinta/60">Nenhum pedido ainda.</p>}
      <div className="space-y-3">
        {pedidos.map((p) => (
          <article key={p.id} className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">#{p.id} · {p.cliente.nome}</p>
                <p className="text-xs text-tinta/60">{formatarData(p.criadoEm)} · {p.cliente.email} · CEP {p.cliente.cep}</p>
              </div>
              <div className="flex items-center gap-3">
                <strong>{formatarPreco(p.total)}</strong>
                <select value={p.status} onChange={(e) => mudarStatus(p, e.target.value)} className="rounded-lg bg-creme/50 px-2 py-1 text-sm ring-1 ring-black/10">
                  {Object.entries(ETAPAS).map(([v, r]) => <option key={v} value={v}>{r}</option>)}
                </select>
              </div>
            </div>
            <p className="mt-2 text-sm text-tinta/70">
              {p.itens.map((i) => i.nome).join(', ')} · {p.frete.tipo} · {p.pagamento}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
