import { Link } from 'react-router-dom'

export default function NaoEncontrado() {
  return (
    <div className="py-16 text-center">
      <p className="font-display text-6xl font-bold text-ameixa">404</p>
      <p className="mt-2 text-tinta/70">Essa página não existe.</p>
      <Link to="/" className="mt-6 inline-block text-ameixa underline">Voltar à vitrine</Link>
    </div>
  )
}
