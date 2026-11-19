import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarPecas, statusAtual } from '../../api/catalogo.js'
import { listarPedidos } from '../../api/pedidos.js'
import { Carregando, ErroApi } from '../../components/Carregando.jsx'
import { formatarPreco, formatarData } from '../../utils.js'

export default function Painel() {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    Promise.all([listarPecas(), listarPedidos()])
      .then(([pecas, pedidos]) => setDados({ pecas, pedidos }))
      .catch(setErro)
  }, [])

  if (erro) return <ErroApi erro={erro} />
  if (!dados) return <Carregando />

  const conta = (s) => dados.pecas.filter((p) => statusAtual(p) === s).length
  const faturamento = dados.pedidos.reduce((s, p) => s + p.total, 0)

  const cards = [
    ['Peças disponíveis', conta('disponivel')],
    ['Reservadas agora', conta('reservada')],
    ['Vendidas', conta('vendida')],
    ['Pedidos', dados.pedidos.length],
    ['Faturamento', formatarPreco(faturamento)],
  ]

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold">Painel</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {cards.map(([rotulo, valor]) => (
          <div key={rotulo} className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
            <p className="text-sm text-tinta/60">{rotulo}</p>
            <p className="mt-1 font-display text-2xl font-bold text-ameixa">{valor}</p>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Últimos pedidos</h2>
          <Link to="/admin/pedidos" className="text-sm text-ameixa underline">Ver todos</Link>
        </div>
        {dados.pedidos.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-tinta/60 ring-1 ring-black/5">Nenhum pedido ainda. Faça uma compra na loja para testar.</p>
        ) : (
          <ul className="divide-y divide-black/5 rounded-2xl bg-white ring-1 ring-black/5">
            {dados.pedidos.slice(0, 5).map((p) => (
              <li key={p.id} className="flex justify-between gap-2 p-4 text-sm">
                <span>#{p.id} · {p.cliente.nome}</span>
                <span className="text-tinta/60">{formatarData(p.criadoEm)}</span>
                <strong>{formatarPreco(p.total)}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
