import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buscarPedido } from '../api/pedidos.js'
import { Carregando, ErroApi } from '../components/Carregando.jsx'
import { formatarPreco } from '../utils.js'

const PAGAMENTOS = { pix: 'Pix', cartao: 'Cartão de crédito', boleto: 'Boleto' }

export default function PedidoConfirmado() {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    buscarPedido(id).then(setPedido).catch(setErro)
  }, [id])

  if (erro) return <ErroApi erro={erro} />
  if (!pedido) return <Carregando />

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded-3xl bg-papel p-8 text-center ring-1 ring-black/5">
      <p className="text-5xl">🎉</p>
      <h1 className="font-display text-3xl font-bold">Pedido confirmado!</h1>
      <p className="text-tinta/70">
        Obrigado pela compra, {pedido.cliente.nome.split(' ')[0]}! Enviamos a confirmação para <strong>{pedido.cliente.email}</strong> (simulado).
      </p>
      <div className="rounded-2xl bg-creme p-4 text-left text-sm">
        <p><strong>Pedido nº {pedido.id}</strong></p>
        <ul className="mt-2 space-y-1">
          {pedido.itens.map((i) => (
            <li key={i.id} className="flex justify-between gap-2"><span>{i.nome}</span><span>{formatarPreco(i.preco)}</span></li>
          ))}
          <li className="flex justify-between"><span>Frete ({pedido.frete.tipo})</span><span>{formatarPreco(pedido.frete.preco)}</span></li>
        </ul>
        <p className="mt-2 flex justify-between border-t border-black/10 pt-2 font-semibold">
          <span>Total</span><span>{formatarPreco(pedido.total)}</span>
        </p>
        <p className="mt-2 text-tinta/60">Pagamento: {PAGAMENTOS[pedido.pagamento] ?? pedido.pagamento} · Entrega em até {pedido.frete.prazo} dias úteis</p>
      </div>
      <Link to="/" className="inline-block rounded-full bg-ameixa px-6 py-3 font-semibold text-creme">Continuar garimpando</Link>
    </div>
  )
}
