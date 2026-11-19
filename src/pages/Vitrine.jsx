import { useEffect, useMemo, useState } from 'react'
import { listarPecas, listarCategorias, CONDICOES, statusAtual } from '../api/catalogo.js'
import CardPeca from '../components/CardPeca.jsx'
import { Carregando, ErroApi } from '../components/Carregando.jsx'

const FILTROS_INICIAIS = { busca: '', categoria: '', tamanho: '', condicao: '', precoMax: '', soDisponiveis: false }

export default function Vitrine() {
  const [pecas, setPecas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS)

  // useEffect com [] → busca os dados uma única vez, ao carregar a tela.
  useEffect(() => {
    Promise.all([listarPecas(), listarCategorias()])
      .then(([p, c]) => {
        setPecas(p)
        setCategorias(c)
      })
      .catch(setErro)
      .finally(() => setCarregando(false))
  }, [])

  const tamanhos = useMemo(() => [...new Set(pecas.map((p) => p.tamanho))].sort(), [pecas])

  const visiveis = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase()
    return pecas
      .filter((p) => !termo || `${p.nome} ${p.marca} ${p.descricao}`.toLowerCase().includes(termo))
      .filter((p) => !filtros.categoria || p.categoria === filtros.categoria)
      .filter((p) => !filtros.tamanho || p.tamanho === filtros.tamanho)
      .filter((p) => !filtros.condicao || p.condicao === filtros.condicao)
      .filter((p) => !filtros.precoMax || p.preco <= Number(filtros.precoMax))
      .filter((p) => !filtros.soDisponiveis || statusAtual(p) === 'disponivel')
  }, [pecas, filtros])

  const mudar = (campo) => (e) =>
    setFiltros({ ...filtros, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  if (carregando) return <Carregando texto="Separando as peças…" />
  if (erro) return <ErroApi erro={erro} />

  const campo = 'w-full rounded-lg border-0 bg-papel px-3 py-2 text-sm ring-1 ring-black/10 focus:ring-2 focus:ring-ameixa'

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-ameixa px-6 py-10 text-creme sm:px-10">
        <p className="text-sm uppercase tracking-[0.2em] opacity-75">Brechó online</p>
        <h1 className="mt-2 max-w-xl font-display text-3xl font-bold leading-tight sm:text-5xl">
          Cada peça existe uma vez só. Quando ela é sua, é só sua.
        </h1>
        <p className="mt-4 max-w-lg opacity-85">
          Ao colocar uma peça na sacola ela fica reservada para você por 15 minutos.
        </p>
      </section>

      <section className="grid gap-3 rounded-2xl bg-white/50 p-4 ring-1 ring-black/5 sm:grid-cols-2 lg:grid-cols-6">
        <input className={`${campo} lg:col-span-2`} placeholder="Buscar por nome, marca…" value={filtros.busca} onChange={mudar('busca')} aria-label="Buscar" />
        <select className={campo} value={filtros.categoria} onChange={mudar('categoria')} aria-label="Categoria">
          <option value="">Todas as categorias</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <select className={campo} value={filtros.tamanho} onChange={mudar('tamanho')} aria-label="Tamanho">
          <option value="">Todos os tamanhos</option>
          {tamanhos.map((t) => <option key={t} value={t}>{t === 'U' ? 'Único' : t}</option>)}
        </select>
        <select className={campo} value={filtros.condicao} onChange={mudar('condicao')} aria-label="Condição">
          <option value="">Qualquer condição</option>
          {Object.entries(CONDICOES).map(([v, r]) => <option key={v} value={v}>{r}</option>)}
        </select>
        <input className={campo} type="number" min="0" placeholder="Preço máx. (R$)" value={filtros.precoMax} onChange={mudar('precoMax')} aria-label="Preço máximo" />
        <label className="flex items-center gap-2 text-sm sm:col-span-2 lg:col-span-6">
          <input type="checkbox" checked={filtros.soDisponiveis} onChange={mudar('soDisponiveis')} className="accent-ameixa" />
          Mostrar só peças disponíveis
          {JSON.stringify(filtros) !== JSON.stringify(FILTROS_INICIAIS) && (
            <button type="button" onClick={() => setFiltros(FILTROS_INICIAIS)} className="ml-auto text-ameixa underline">
              Limpar filtros
            </button>
          )}
        </label>
      </section>

      <p className="text-sm text-tinta/60">{visiveis.length} peça(s) encontrada(s)</p>

      {visiveis.length === 0 ? (
        <p className="py-12 text-center text-tinta/60">Nenhuma peça com esses filtros.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visiveis.map((p) => <CardPeca key={p.id} peca={p} />)}
        </div>
      )}
    </div>
  )
}
