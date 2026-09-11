import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import { AuthProvider } from '../hooks/useAuth'
import { MainLayout } from '../layouts/MainLayout'
import { AccessDeniedPage } from '../pages/AccessDeniedPage'
import DashboardPage from '../pages/DashboardPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { CategoriasPage } from '../pages/categorias/CategoriasPage'
import { CentrosCostoPage } from '../pages/centros-costos/CentrosCostoPage'
import { DestinosPage } from '../pages/destinos/DestinosPage'
import { IngresosAlmacenPage } from '../pages/ingresos-almacen/IngresosAlmacenPage'
import { RolesPage } from '../pages/roles/RolesPage'
import { TiposComprobantePage } from '../pages/tipos-comprobante/TiposComprobantePage'
import { TiposProductoPage } from '../pages/tipos-producto/TiposProductoPage'
import { UnidadesMedidaPage } from '../pages/unidades-medida/UnidadesMedidaPage'
import { UsuariosPage } from '../pages/usuarios/UsuariosPage'
import { ValesConsumoPage } from '../pages/vales-consumo/ValesConsumoPage'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'
import { ProveedoresPage } from '../pages/proveedores/ProveedoresPage'
import { NuevoProveedorPage } from '../pages/proveedores/NuevoProveedorPage'
import { EditarProveedorPage } from '../pages/proveedores/EditarProveedorPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route
                path="/dashboard"
                element={<DashboardPage />}
              />

              <Route
                path="/sin-permiso"
                element={<AccessDeniedPage />}
              />

              <Route
                element={
                  <RoleRoute modulo="categorias" />
                }
              >
                <Route
                  path="/categorias"
                  element={<CategoriasPage />}
                />
              </Route>

              <Route
                element={
                  <RoleRoute modulo="usuarios" />
                }
              >
                <Route
                  path="/usuarios"
                  element={<UsuariosPage />}
                />
              </Route>

              <Route
                element={
                  <RoleRoute modulo="roles" />
                }
              >
                <Route
                  path="/roles"
                  element={<RolesPage />}
                />
              </Route>

              <Route
                element={
                  <RoleRoute modulo="centros-costo" />
                }
              >
                <Route
                  path="/centros-costo"
                  element={<CentrosCostoPage />}
                />
              </Route>

              <Route
                element={
                  <RoleRoute modulo="tipos-producto" />
                }
              >
                <Route
                  path="/tipos-producto"
                  element={<TiposProductoPage />}
                />
              </Route>

              <Route
                element={
                  <RoleRoute modulo="tipos-documento" />
                }
              >
                <Route
                  path="/tipos-comprobante"
                  element={
                    <TiposComprobantePage />
                  }
                />
              </Route>

              <Route
                element={
                  <RoleRoute modulo="unidades-medida" />
                }
              >
                <Route
                  path="/unidades-medida"
                  element={
                    <UnidadesMedidaPage />
                  }
                />
              </Route>

              <Route
                element={
                  <RoleRoute modulo="destinos" />
                }
              >
                <Route
                  path="/destinos"
                  element={<DestinosPage />}
                />
              </Route>

              <Route
                element={
                  <RoleRoute modulo="ingresos-almacen" />
                }
              >
                <Route
                  path="/ingresos-almacen"
                  element={
                    <IngresosAlmacenPage />
                  }
                />
              </Route>

              <Route
                element={
                  <RoleRoute modulo="vales-consumo" />
                }
              >
                <Route
                  path="/vales-consumo"
                  element={<ValesConsumoPage />}
                />
              </Route>
              <Route
                element={
                  <RoleRoute modulo="proveedores" />
                }
              >
                <Route
                  path="/proveedores"
                  element={<ProveedoresPage />}
                />

                <Route
                  path="/proveedores/nuevo"
                  element={<NuevoProveedorPage />}
                />

                <Route
                  path="/proveedores/:id/editar"
                  element={<EditarProveedorPage />}
                />
              </Route>
            </Route>
          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}