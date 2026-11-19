import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarPecas, atualizarPeca, excluirPeca, statusAtual } from '../../api/catalogo.js'
import { Carregando, ErroApi } from '../../components/Carregando.jsx'
import { formatarPreco } from '../../utils.js'

const ROTULOS = { disponivel: 'Disponível', reservada: 'Reservada', vendida: 'Vendida' }

export default function PecasAdmin() {
  const [pecas, setPecas] = useState(null)
  const [erro, setErro] = useState(null)

  const carregar = () => listarPecas().then(setPecas).catch(setErro)
  useEffect(() => {
    carregar()
  }, [])

  async function mudarStatus(peca, status) {
    await atualizarPeca(peca.id, { status, reservadaAte: null })
    carregar()
  }

  async function excluir(peca) {
    if (!confirm(`Excluir "${peca.nome}" do catálogo?`)) return
    await excluirPeca(peca.id)
    carregar()
  }

  if (erro) return <ErroApi erro={erro} />
  if (!pecas) return <Carregando />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Peças ({pecas.length})</h1>
        <Link to="/admin/pecas/nova" className="rounded-full bg-ameixa px-5 py-2 text-sm font-semibold text-creme">+ Cadastrar peça</Link>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-creme/60 text-tinta/70">
            <tr>
              <th className="p-3">Peça</th>
              <th className="p-3">Tam.</th>
              <th className="p-3">Preço</th>
              <th className="p-3">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {pecas.map((p) => (
              <tr key={p.id}>
                <td className="p-3">
                  <Link to={`/peca/${p.id}`} className="font-medium hover:text-ameixa">{p.icone} {p.nome}</Link>
                  <p className="text-xs text-tinta/60">{p.marca}</p>
                </td>
                <td className="p-3">{p.tamanho}</td>
                <td className="p-3">{formatarPreco(p.preco)}</td>
                <td className="p-3">
                  <select value={statusAtual(p)} onChange={(e) => mudarStatus(p, e.target.value)} className="rounded-lg bg-creme/50 px-2 py-1 ring-1 ring-black/10">
                    {Object.entries(ROTULOS).map(([v, r]) => <option key={v} value={v}>{r}</option>)}
                  </select>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => excluir(p)} className="text-xs text-red-700 underline">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
