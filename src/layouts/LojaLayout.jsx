import { Link, NavLink, Outlet } from 'react-router-dom'
import { useCarrinho } from '../store/carrinho.js'

// Layout fixo da loja (DRY): cabeçalho e rodapé aparecem em todas as páginas,
// e o conteúdo de cada rota filha é injetado no <Outlet />.
export default function LojaLayout() {
  const quantidade = useCarrinho((s) => s.itens.length)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-creme/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="font-display text-2xl font-bold text-ameixa">
            Desa Pego<span className="text-terracota">.</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium sm:gap-5">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'text-ameixa' : 'text-tinta/70 hover:text-ameixa')}>
              Vitrine
            </NavLink>
            <NavLink to="/admin" className="text-tinta/70 hover:text-ameixa">
              Admin
            </NavLink>
            <Link to="/carrinho" className="relative rounded-full bg-ameixa px-4 py-2 text-creme hover:bg-ameixa-escura">
              Sacola
              {quantidade > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-terracota text-xs">
                  {quantidade}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-black/5 py-8 text-center text-sm text-tinta/60">
        Desa Pego · brechó online de peças únicas · Projeto acadêmico de Desenvolvimento Web
      </footer>
    </div>
  )
}
