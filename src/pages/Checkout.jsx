import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCarrinho, totalCarrinho } from '../store/carrinho.js'
import { buscarPeca } from '../api/catalogo.js'
import { criarPedido } from '../api/pedidos.js'
import { cotarFrete } from '../api/frete.js'
import { formatarPreco } from '../utils.js'

const PAGAMENTOS = [
  { id: 'pix', nome: 'Pix', detalhe: 'Aprovação na hora' },
  { id: 'cartao', nome: 'Cartão de crédito', detalhe: 'Até 3x sem juros' },
  { id: 'boleto', nome: 'Boleto', detalhe: 'Compensa em até 2 dias úteis' },
]

export default function Checkout() {
  const { itens, esvaziar, removerExpirados } = useCarrinho()
  const navegar = useNavigate()
  const [dados, setDados] = useState({ nome: '', email: '', cep: '', endereco: '', numero: '' })
  const [freteId, setFreteId] = useState('pac')
  const [pagamento, setPagamento] = useState('pix')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  if (itens.length === 0 && !enviando) return <Navigate to="/carrinho" replace />

  const opcoesFrete = cotarFrete(dados.cep)
  const frete = opcoesFrete?.find((f) => f.id === freteId)
  const subtotal = totalCarrinho(itens)
  const total = subtotal + (frete?.preco ?? 0)

  const mudar = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value })

  async function finalizar(e) {
    e.preventDefault()
    setErro('')
    if (!frete) return setErro('Informe um CEP válido para calcular o frete.')
    setEnviando(true)
    try {
      // Estoque e preço nunca vêm do cache no checkout: relemos cada peça do servidor.
      const atuais = await Promise.all(itens.map((i) => buscarPeca(i.id)))
      const perdida = atuais.find((p) => p.status !== 'reservada' || new Date(p.reservadaAte) < new Date())
      if (perdida) {
        removerExpirados()
        throw new Error(`A reserva de "${perdida.nome}" expirou. Volte à sacola e tente de novo.`)
      }
      const pedido = await criarPedido({
        cliente: dados,
        itens: itens.map(({ id, nome, preco }) => ({ id, nome, preco })),
        frete: { tipo: frete.nome, preco: frete.preco, prazo: frete.prazo },
        pagamento,
        subtotal,
        total,
      })
      esvaziar()
      navegar(`/pedido/${pedido.id}`)
    } catch (e) {
      setErro(e.message)
      setEnviando(false)
    }
  }

  const campo = 'w-full rounded-lg border-0 bg-white px-3 py-2 ring-1 ring-black/10 focus:ring-2 focus:ring-ameixa'

  return (
    <form onSubmit={finalizar} className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        <h1 className="font-display text-3xl font-bold">Finalizar compra</h1>

        <fieldset className="space-y-3">
          <legend className="mb-2 font-semibold">1. Seus dados</legend>
          <input required className={campo} placeholder="Nome completo" value={dados.nome} onChange={mudar('nome')} autoComplete="name" />
          <input required type="email" className={campo} placeholder="E-mail" value={dados.email} onChange={mudar('email')} autoComplete="email" />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="mb-2 font-semibold">2. Entrega</legend>
          <div className="grid gap-3 sm:grid-cols-[160px_1fr_100px]">
            <input required className={campo} placeholder="CEP" inputMode="numeric" maxLength={9} value={dados.cep} onChange={mudar('cep')} autoComplete="postal-code" />
            <input required className={campo} placeholder="Endereço" value={dados.endereco} onChange={mudar('endereco')} autoComplete="street-address" />
            <input required className={campo} placeholder="Nº" value={dados.numero} onChange={mudar('numero')} />
          </div>
          {opcoesFrete ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {opcoesFrete.map((f) => (
                <Opcao key={f.id} nome="frete" ativo={freteId === f.id} onChange={() => setFreteId(f.id)}
                  titulo={`${f.nome} · ${formatarPreco(f.preco)}`} detalhe={`Chega em até ${f.prazo} dias úteis`} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-tinta/60">Digite o CEP (8 dígitos) para ver as opções de frete.</p>
          )}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="mb-2 font-semibold">3. Pagamento</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {PAGAMENTOS.map((p) => (
              <Opcao key={p.id} nome="pagamento" ativo={pagamento === p.id} onChange={() => setPagamento(p.id)} titulo={p.nome} detalhe={p.detalhe} />
            ))}
          </div>
          <p className="text-xs text-tinta/60">
            Ambiente de demonstração: nenhum pagamento real é feito. No sistema final os dados do cartão
            são digitados no Mercado Pago e nunca passam pelo nosso servidor.
          </p>
        </fieldset>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl bg-papel p-6 ring-1 ring-black/5">
        <h2 className="font-semibold">Resumo</h2>
        <ul className="space-y-1 text-sm">
          {itens.map((i) => (
            <li key={i.id} className="flex justify-between gap-2">
              <span className="truncate">{i.nome}</span>
              <span>{formatarPreco(i.preco)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-black/10 pt-3 text-sm">
          <Linha rotulo="Subtotal" valor={formatarPreco(subtotal)} />
          <Linha rotulo="Frete" valor={frete ? formatarPreco(frete.preco) : '—'} />
          <Linha rotulo={<strong>Total</strong>} valor={<strong className="text-lg">{formatarPreco(total)}</strong>} />
        </div>
        {erro && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-900 ring-1 ring-red-200">{erro}</p>}
        <button disabled={enviando} className="w-full rounded-full bg-ameixa py-3 font-semibold text-creme hover:bg-ameixa-escura disabled:opacity-60">
          {enviando ? 'Processando…' : 'Pagar e concluir'}
        </button>
        <Link to="/carrinho" className="block text-center text-sm text-tinta/60 underline">Voltar à sacola</Link>
      </aside>
    </form>
  )
}

function Opcao({ nome, ativo, onChange, titulo, detalhe }) {
  return (
    <label className={`cursor-pointer rounded-xl p-3 ring-1 ${ativo ? 'bg-ameixa/5 ring-2 ring-ameixa' : 'bg-white ring-black/10'}`}>
      <input type="radio" name={nome} checked={ativo} onChange={onChange} className="sr-only" />
      <span className="block text-sm font-semibold">{titulo}</span>
      <span className="block text-xs text-tinta/60">{detalhe}</span>
    </label>
  )
}

function Linha({ rotulo, valor }) {
  return (
    <div className="flex items-baseline justify-between">
      <span>{rotulo}</span>
      <span>{valor}</span>
    </div>
  )
}
