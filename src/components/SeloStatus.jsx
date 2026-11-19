import { statusAtual } from '../api/catalogo.js'

const estilos = {
  disponivel: null,
  reservada: ['Reservada', 'bg-amber-100 text-amber-900'],
  vendida: ['Vendida', 'bg-tinta text-creme'],
}

export default function SeloStatus({ peca }) {
  const estilo = estilos[statusAtual(peca)]
  if (!estilo) return null
  return (
    <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${estilo[1]}`}>
      {estilo[0]}
    </span>
  )
}
