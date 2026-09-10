import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../pages/DashboardPage';
import IngresosAlmacenPage from '../pages/ingresos-almacen/IngresosAlmacenPage';
import ValesConsumoPage from '../pages/vales-consumo/ValesConsumoPage';
import ProductosPage from '../pages/productos/ProductosPage';
import ProveedoresPage from '../pages/proveedores/ProveedoresPage';
import ControlAlmacenPage from '../pages/control-almacen/ControlAlmacenPage';
import ReportesPage from '../pages/reportes/ReportesPage';
import UsuariosPage from '../pages/usuarios/UsuariosPage';
import RolesPage from '../pages/roles/RolesPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ingresos" element={<IngresosAlmacenPage />} />
        <Route path="/vales-consumo" element={<ValesConsumoPage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/proveedores" element={<ProveedoresPage />} />
        <Route path="/control-almacen" element={<ControlAlmacenPage />} />
        <Route path="/reportes" element={<ReportesPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
