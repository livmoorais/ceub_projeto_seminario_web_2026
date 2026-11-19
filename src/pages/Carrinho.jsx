import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCarrinho, totalCarrinho } from '../store/carrinho.js'
import FotoPeca from '../components/FotoPeca.jsx'
import Contagem from '../components/Contagem.jsx'
import { formatarPreco } from '../utils.js'

export default function Carrinho() {
  const { itens, remover, removerExpirados } = useCarrinho()

  useEffect(() => {
    removerExpirados()
  }, [removerExpirados])

  if (itens.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="font-display text-3xl font-bold">Sua sacola está vazia</h1>
        <p className="mt-2 text-tinta/60">Garimpe alguma coisa boa na vitrine.</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-ameixa px-6 py-3 font-semibold text-creme">
          Ver peças
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section>
        <h1 className="mb-6 font-display text-3xl font-bold">Sua sacola</h1>
        <ul className="space-y-3">
          {itens.map((item) => (
            <li key={item.id} className="flex items-center gap-4 rounded-2xl bg-papel p-3 ring-1 ring-black/5">
              <Link to={`/peca/${item.id}`} className="w-20 shrink-0 overflow-hidden rounded-xl">
                <FotoPeca peca={item} tamanho="sm" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.nome}</p>
                <p className="text-sm text-tinta/60">{item.marca} · Tam. {item.tamanho}</p>
                <p className="mt-1 text-xs text-terracota">
                  Reservada por mais <Contagem ate={item.reservadaAte} onExpirar={removerExpirados} />
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatarPreco(item.preco)}</p>
                <button onClick={() => remover(item.id)} className="mt-1 text-xs text-tinta/60 underline hover:text-red-700">
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="h-fit space-y-4 rounded-2xl bg-papel p-6 ring-1 ring-black/5">
        <div className="flex justify-between text-lg">
          <span>Subtotal</span>
          <strong>{formatarPreco(totalCarrinho(itens))}</strong>
        </div>
        <p className="text-sm text-tinta/60">Frete calculado no próximo passo.</p>
        <Link to="/checkout" className="block rounded-full bg-ameixa py-3 text-center font-semibold text-creme hover:bg-ameixa-escura">
          Finalizar compra
        </Link>
      </aside>
    </div>
  )
}
