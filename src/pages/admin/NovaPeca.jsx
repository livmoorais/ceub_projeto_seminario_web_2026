import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { criarPeca, listarCategorias, CONDICOES } from '../../api/catalogo.js'

const ICONES = ['👚', '👗', '👔', '👖', '🧥', '🧶', '🩰', '👟', '🥾', '👜', '🕶️', '🧢']
const VAZIO = { nome: '', marca: '', categoria: '', tamanho: '', condicao: 'otimo', preco: '', descricao: '', icone: '👚', cor: '#b8a88a', busto: '', cintura: '', comprimento: '' }

export default function NovaPeca() {
  const navegar = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState(VAZIO)
  const [erro, setErro] = useState('')

  useEffect(() => {
    listarCategorias().then(setCategorias).catch((e) => setErro(e.message))
  }, [])

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    const preco = Number(form.preco)
    if (!(preco > 0)) return setErro('Informe um preço maior que zero.')
    const medidas = Object.fromEntries(
      ['busto', 'cintura', 'comprimento'].filter((m) => form[m]).map((m) => [m, Number(form[m])]),
    )
    try {
      const { nome, marca, categoria, tamanho, condicao, descricao, icone, cor } = form
      await criarPeca({
        nome: nome.trim(), marca: marca.trim() || 'Sem marca', categoria, tamanho: tamanho.trim().toUpperCase(),
        condicao, preco, descricao: descricao.trim(), icone, cor, medidas,
        status: 'disponivel', reservadaAte: null, criadoEm: new Date().toISOString(),
      })
      navegar('/admin/pecas')
    } catch (e) {
      setErro(e.message)
    }
  }

  const campo = 'w-full rounded-lg border-0 bg-white px-3 py-2 ring-1 ring-black/10 focus:ring-2 focus:ring-ameixa'

  return (
    <form onSubmit={salvar} className="max-w-2xl space-y-5">
      <h1 className="font-display text-3xl font-bold">Cadastrar peça</h1>

      <Campo rotulo="Nome da peça"><input required className={campo} value={form.nome} onChange={mudar('nome')} /></Campo>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Marca"><input className={campo} value={form.marca} onChange={mudar('marca')} /></Campo>
        <Campo rotulo="Categoria">
          <select required className={campo} value={form.categoria} onChange={mudar('categoria')}>
            <option value="">Escolha…</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </Campo>
        <Campo rotulo="Tamanho"><input required className={campo} placeholder="P, M, G, 38, U…" value={form.tamanho} onChange={mudar('tamanho')} /></Campo>
        <Campo rotulo="Condição">
          <select className={campo} value={form.condicao} onChange={mudar('condicao')}>
            {Object.entries(CONDICOES).map(([v, r]) => <option key={v} value={v}>{r}</option>)}
          </select>
        </Campo>
        <Campo rotulo="Preço (R$)"><input required type="number" step="0.01" min="0" className={campo} value={form.preco} onChange={mudar('preco')} /></Campo>
        <Campo rotulo="Cor de fundo da foto"><input type="color" className="h-10 w-full cursor-pointer rounded-lg" value={form.cor} onChange={mudar('cor')} /></Campo>
      </div>

      <Campo rotulo="Medidas (cm, opcional)">
        <div className="grid grid-cols-3 gap-2">
          {['busto', 'cintura', 'comprimento'].map((m) => (
            <input key={m} type="number" min="0" className={campo} placeholder={m} value={form[m]} onChange={mudar(m)} aria-label={m} />
          ))}
        </div>
      </Campo>

      <Campo rotulo="Descrição"><textarea rows={3} className={campo} value={form.descricao} onChange={mudar('descricao')} /></Campo>

      <Campo rotulo="Ícone (substitui a foto nesta demonstração)">
        <div className="flex flex-wrap gap-2">
          {ICONES.map((i) => (
            <button type="button" key={i} onClick={() => setForm({ ...form, icone: i })}
              className={`h-11 w-11 rounded-lg text-2xl ring-1 ${form.icone === i ? 'bg-ameixa/10 ring-2 ring-ameixa' : 'bg-white ring-black/10'}`}>
              {i}
            </button>
          ))}
        </div>
      </Campo>

      {erro && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-900 ring-1 ring-red-200">{erro}</p>}
      <button className="rounded-full bg-ameixa px-6 py-3 font-semibold text-creme hover:bg-ameixa-escura">Publicar peça</button>
    </form>
  )
}

function Campo({ rotulo, children }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-tinta/80">{rotulo}</span>
      {children}
    </label>
  )
}
