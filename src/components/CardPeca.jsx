import { Link } from 'react-router-dom'
import FotoPeca from './FotoPeca.jsx'
import SeloStatus from './SeloStatus.jsx'
import { statusAtual } from '../api/catalogo.js'
import { formatarPreco } from '../utils.js'

export default function CardPeca({ peca }) {
  const indisponivel = statusAtual(peca) !== 'disponivel'
  return (
    <Link
      to={`/peca/${peca.id}`}
      className="group block overflow-hidden rounded-2xl bg-papel shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative">
        <FotoPeca peca={peca} className={indisponivel ? 'opacity-60 grayscale' : ''} />
        <SeloStatus peca={peca} />
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase tracking-wider text-tinta/60">
          {peca.marca} · Tam. {peca.tamanho}
        </p>
        <h3 className="line-clamp-2 font-medium leading-snug group-hover:text-ameixa">{peca.nome}</h3>
        <p className="font-display text-lg font-bold text-ameixa">{formatarPreco(peca.preco)}</p>
      </div>
    </Link>
  )
}
