import { Link, NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/admin', rotulo: 'Painel', end: true },
  { to: '/admin/pecas', rotulo: 'Peças' },
  { to: '/admin/pecas/nova', rotulo: 'Cadastrar peça' },
  { to: '/admin/pedidos', rotulo: 'Pedidos' },
]

// Layout do painel administrativo: sidebar fixa + <Outlet /> para o conteúdo.
// (No sistema real, este painel exige login com 2FA e papel Atendente/Administrador.)
export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-papel md:flex-row">
      <aside className="bg-ameixa-escura p-4 text-creme md:w-60 md:p-6">
        <Link to="/" className="font-display text-xl font-bold">
          Desa Pego <span className="text-sm font-normal opacity-70">admin</span>
        </Link>
        <nav className="mt-4 flex gap-1 overflow-x-auto md:mt-8 md:flex-col">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-creme/15 font-semibold' : 'opacity-80 hover:bg-creme/10'}`
              }
            >
              {l.rotulo}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="mt-6 hidden text-sm opacity-70 hover:opacity-100 md:block">
          ← Voltar à loja
        </Link>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}
