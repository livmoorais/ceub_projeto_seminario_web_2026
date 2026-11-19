import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { buscarPeca, CONDICOES, statusAtual, RESERVA_MINUTOS } from '../api/catalogo.js'
import { useCarrinho } from '../store/carrinho.js'
import FotoPeca from '../components/FotoPeca.jsx'
import SeloStatus from '../components/SeloStatus.jsx'
import { Carregando, ErroApi } from '../components/Carregando.jsx'
import { formatarPreco } from '../utils.js'

export default function DetalhePeca() {
  // Rota dinâmica: /peca/:id → useParams() devolve { id }
  const { id } = useParams()
  const navegar = useNavigate()
  const [peca, setPeca] = useState(null)
  const [erro, setErro] = useState(null)
  const [aviso, setAviso] = useState('')
  const [enviando, setEnviando] = useState(false)
  const naSacola = useCarrinho((s) => s.itens.some((i) => i.id === id))
  const adicionar = useCarrinho((s) => s.adicionar)

  useEffect(() => {
    buscarPeca(id).then(setPeca).catch(setErro)
  }, [id])

  async function colocarNaSacola() {
    setEnviando(true)
    setAviso('')
    try {
      await adicionar(peca)
      navegar('/carrinho')
    } catch (e) {
      setAviso(e.message)
      buscarPeca(id).then(setPeca)
    } finally {
      setEnviando(false)
    }
  }

  if (erro) return erro.message.includes('404') ? <NaoAchou /> : <ErroApi erro={erro} />
  if (!peca || peca.id !== id) return <Carregando />

  const status = statusAtual(peca)
  const medidas = Object.entries(peca.medidas ?? {})

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="relative overflow-hidden rounded-3xl">
        <FotoPeca peca={peca} tamanho="lg" />
        <SeloStatus peca={peca} />
      </div>

      <div className="space-y-6">
        <Link to="/" className="text-sm text-tinta/60 hover:text-ameixa">← Voltar à vitrine</Link>
        <div>
          <p className="text-sm uppercase tracking-wider text-tinta/60">{peca.marca}</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{peca.nome}</h1>
          <p className="mt-3 font-display text-3xl font-bold text-ameixa">{formatarPreco(peca.preco)}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Info rotulo="Tamanho" valor={peca.tamanho === 'U' ? 'Único' : peca.tamanho} />
          <Info rotulo="Condição" valor={CONDICOES[peca.condicao] ?? peca.condicao} />
        </dl>

        <p className="leading-relaxed text-tinta/80">{peca.descricao}</p>

        {medidas.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-tinta/60">Medidas (cm)</h2>
            <ul className="flex flex-wrap gap-2">
              {medidas.map(([nome, valor]) => (
                <li key={nome} className="rounded-full bg-papel px-3 py-1 text-sm ring-1 ring-black/10">
                  <span className="capitalize">{nome}</span>: {valor}
                </li>
              ))}
            </ul>
          </div>
        )}

        {aviso && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">{aviso}</p>}

        {naSacola ? (
          <Link to="/carrinho" className="block rounded-full bg-musgo py-3 text-center font-semibold text-creme">
            Já está na sua sacola · ver sacola
          </Link>
        ) : status === 'disponivel' ? (
          <button
            onClick={colocarNaSacola}
            disabled={enviando}
            className="w-full rounded-full bg-ameixa py-3 font-semibold text-creme hover:bg-ameixa-escura disabled:opacity-60"
          >
            {enviando ? 'Reservando…' : 'Colocar na sacola'}
          </button>
        ) : (
          <p className="rounded-full bg-tinta/10 py-3 text-center font-semibold text-tinta/70">
            {status === 'vendida' ? 'Esta peça já foi vendida' : 'Reservada por outra pessoa — volte em alguns minutos'}
          </p>
        )}
        <p className="text-xs text-tinta/60">
          A peça fica reservada para você por {RESERVA_MINUTOS} minutos depois de entrar na sacola.
        </p>
      </div>
    </div>
  )
}

function Info({ rotulo, valor }) {
  return (
    <div className="rounded-xl bg-papel p-3 ring-1 ring-black/5">
      <dt className="text-tinta/60">{rotulo}</dt>
      <dd className="font-semibold">{valor}</dd>
    </div>
  )
}

function NaoAchou() {
  return (
    <div className="py-16 text-center">
      <p className="font-display text-2xl">Essa peça não existe (ou saiu do catálogo).</p>
      <Link to="/" className="mt-4 inline-block text-ameixa underline">Ver a vitrine</Link>
    </div>
  )
}
