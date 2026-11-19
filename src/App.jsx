import { Routes, Route } from 'react-router-dom'
import LojaLayout from './layouts/LojaLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import Vitrine from './pages/Vitrine.jsx'
import DetalhePeca from './pages/DetalhePeca.jsx'
import Carrinho from './pages/Carrinho.jsx'
import Checkout from './pages/Checkout.jsx'
import PedidoConfirmado from './pages/PedidoConfirmado.jsx'
import NaoEncontrado from './pages/NaoEncontrado.jsx'
import Painel from './pages/admin/Painel.jsx'
import PecasAdmin from './pages/admin/PecasAdmin.jsx'
import NovaPeca from './pages/admin/NovaPeca.jsx'
import PedidosAdmin from './pages/admin/PedidosAdmin.jsx'

// <Routes> é o motor: renderiza só a rota que corresponde à URL atual.
// Rotas "pai" (LojaLayout, AdminLayout) desenham o layout fixo;
// as rotas "filhas" aparecem no lugar do <Outlet />.
export default function App() {
  return (
    <Routes>
      <Route element={<LojaLayout />}>
        <Route index element={<Vitrine />} />
        <Route path="peca/:id" element={<DetalhePeca />} />
        <Route path="carrinho" element={<Carrinho />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="pedido/:id" element={<PedidoConfirmado />} />
        <Route path="*" element={<NaoEncontrado />} />
      </Route>

      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Painel />} />
        <Route path="pecas" element={<PecasAdmin />} />
        <Route path="pecas/nova" element={<NovaPeca />} />
        <Route path="pedidos" element={<PedidosAdmin />} />
      </Route>
    </Routes>
  )
}
