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
import { TiposDocumentoPage } from '../pages/tipos-documento/TiposDocumentoPage'
import { TiposProductoPage } from '../pages/tipos-producto/TiposProductoPage'
import { UnidadesMedidaPage } from '../pages/unidades-medida/UnidadesMedidaPage'
import { UsuariosPage } from '../pages/usuarios/UsuariosPage'
import { ValesConsumoPage } from '../pages/vales-consumo/ValesConsumoPage'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'
import { ProveedoresPage } from '../pages/proveedores/ProveedoresPage'
import { NuevoProveedorPage } from '../pages/proveedores/NuevoProveedorPage'
import { EditarProveedorPage } from '../pages/proveedores/EditarProveedorPage'
import { ProductosPage } from '../pages/productos/ProductosPage'
import { NuevoProductoPage } from '../pages/productos/NuevoProductoPage'
import { EditarProductoPage } from '../pages/productos/EditarProductoPage'
import { BitacoraPage } from '../pages/bitacora/BitacoraPage'
import { ContactosPage } from '../pages/contactos/ContactosPage'
import { PartesEquipoPage } from '../pages/partes-equipo/PartesEquipoPage'
import { PerfilUsuarioPage } from '../pages/perfil/PerfilUsuarioPage'

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
                  path="/tipos-documento"
                  element={
                    <TiposDocumentoPage />
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
              <Route
                element={
                  <RoleRoute modulo="productos" />
                }
              >
                <Route
                  path="/productos"
                  element={<ProductosPage />}
                />

                <Route
                  path="/productos/nuevo"
                  element={<NuevoProductoPage />}
                />

                <Route
                  path="/productos/:id/editar"
                  element={<EditarProductoPage />}
                />
              </Route>
              <Route
                element={
                  <RoleRoute modulo="bitacora" />
                }
              >
                <Route
                  path="/bitacora"
                  element={<BitacoraPage />}
                />
              </Route>
              <Route
                element={
                  <RoleRoute modulo="contactos" />
                }
              >
                <Route
                  path="/contactos"
                  element={<ContactosPage />}
                />
              </Route>
              <Route
                element={
                  <RoleRoute modulo="partes-equipo" />
                }
              >
                <Route
                  path="/partes-equipo"
                  element={<PartesEquipoPage />}
                />
              </Route>
              <Route
                element={
                  <RoleRoute modulo="perfil-usuario" />
                }
              >
                <Route
                  path="/perfil-usuario"
                  element={<PerfilUsuarioPage />}
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
