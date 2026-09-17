import {
  lazy,
  Suspense,
} from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import { AuthProvider } from '../hooks/useAuth'
import { MainLayout } from '../layouts/MainLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'

const DashboardPage = lazy(
  () => import('../pages/DashboardPage'),
)

const AccessDeniedPage = lazy(() =>
  import('../pages/AccessDeniedPage').then(
    (modulo) => ({
      default: modulo.AccessDeniedPage,
    }),
  ),
)

const LoginPage = lazy(() =>
  import('../pages/auth/LoginPage').then(
    (modulo) => ({
      default: modulo.LoginPage,
    }),
  ),
)

const BitacoraPage = lazy(() =>
  import('../pages/bitacora/BitacoraPage').then(
    (modulo) => ({
      default: modulo.BitacoraPage,
    }),
  ),
)

const CategoriasPage = lazy(() =>
  import('../pages/categorias/CategoriasPage').then(
    (modulo) => ({
      default: modulo.CategoriasPage,
    }),
  ),
)

const CentrosCostoPage = lazy(() =>
  import(
    '../pages/centros-costos/CentrosCostoPage'
  ).then((modulo) => ({
    default: modulo.CentrosCostoPage,
  })),
)

const ContactosPage = lazy(() =>
  import('../pages/contactos/ContactosPage').then(
    (modulo) => ({
      default: modulo.ContactosPage,
    }),
  ),
)

const ControlAlmacenPage = lazy(() =>
  import(
    '../pages/control-almacen/ControlAlmacenPage'
  ).then((modulo) => ({
    default: modulo.ControlAlmacenPage,
  })),
)

const DestinosPage = lazy(() =>
  import('../pages/destinos/DestinosPage').then(
    (modulo) => ({
      default: modulo.DestinosPage,
    }),
  ),
)

const IngresosAlmacenPage = lazy(() =>
  import(
    '../pages/ingresos-almacen/IngresosAlmacenPage'
  ).then((modulo) => ({
    default: modulo.IngresosAlmacenPage,
  })),
)

const NuevoIngresoPage = lazy(() =>
  import(
    '../pages/ingresos-almacen/NuevoIngresoPage'
  ).then((modulo) => ({
    default: modulo.NuevoIngresoPage,
  })),
)

const EditarIngresoPage = lazy(() =>
  import(
    '../pages/ingresos-almacen/EditarIngresoPage'
  ).then((modulo) => ({
    default: modulo.EditarIngresoPage,
  })),
)

const PartesEquipoPage = lazy(() =>
  import(
    '../pages/partes-equipo/PartesEquipoPage'
  ).then((modulo) => ({
    default: modulo.PartesEquipoPage,
  })),
)

const PerfilUsuarioPage = lazy(() =>
  import(
    '../pages/perfil/PerfilUsuarioPage'
  ).then((modulo) => ({
    default: modulo.PerfilUsuarioPage,
  })),
)

const ProductosPage = lazy(() =>
  import('../pages/productos/ProductosPage').then(
    (modulo) => ({
      default: modulo.ProductosPage,
    }),
  ),
)

const NuevoProductoPage = lazy(() =>
  import(
    '../pages/productos/NuevoProductoPage'
  ).then((modulo) => ({
    default: modulo.NuevoProductoPage,
  })),
)

const EditarProductoPage = lazy(() =>
  import(
    '../pages/productos/EditarProductoPage'
  ).then((modulo) => ({
    default: modulo.EditarProductoPage,
  })),
)

const ProveedoresPage = lazy(() =>
  import(
    '../pages/proveedores/ProveedoresPage'
  ).then((modulo) => ({
    default: modulo.ProveedoresPage,
  })),
)

const NuevoProveedorPage = lazy(() =>
  import(
    '../pages/proveedores/NuevoProveedorPage'
  ).then((modulo) => ({
    default: modulo.NuevoProveedorPage,
  })),
)

const EditarProveedorPage = lazy(() =>
  import(
    '../pages/proveedores/EditarProveedorPage'
  ).then((modulo) => ({
    default: modulo.EditarProveedorPage,
  })),
)

const ReporteIngresosPage = lazy(() =>
  import(
    '../pages/reportes/ReporteIngresosPage'
  ).then((modulo) => ({
    default: modulo.ReporteIngresosPage,
  })),
)

const ReporteValesPage = lazy(() =>
  import(
    '../pages/reportes/ReporteValesPage'
  ).then((modulo) => ({
    default: modulo.ReporteValesPage,
  })),
)

const ReporteProductosMasPedidosPage =
  lazy(() =>
    import(
      '../pages/reportes/ReporteProductosMasPedidosPage'
    ).then((modulo) => ({
      default:
        modulo.ReporteProductosMasPedidosPage,
    })),
  )

const RolesPage = lazy(() =>
  import('../pages/roles/RolesPage').then(
    (modulo) => ({
      default: modulo.RolesPage,
    }),
  ),
)

const TiposComprobantePage = lazy(() =>
  import(
    '../pages/tipos-comprobante/TiposComprobantePage'
  ).then((modulo) => ({
    default: modulo.TiposComprobantePage,
  })),
)

const TiposProductoPage = lazy(() =>
  import(
    '../pages/tipos-producto/TiposProductoPage'
  ).then((modulo) => ({
    default: modulo.TiposProductoPage,
  })),
)

const UnidadesMedidaPage = lazy(() =>
  import(
    '../pages/unidades-medida/UnidadesMedidaPage'
  ).then((modulo) => ({
    default: modulo.UnidadesMedidaPage,
  })),
)

const UsuariosPage = lazy(() =>
  import('../pages/usuarios/UsuariosPage').then(
    (modulo) => ({
      default: modulo.UsuariosPage,
    }),
  ),
)

const ValesConsumoPage = lazy(() =>
  import(
    '../pages/vales-consumo/ValesConsumoPage'
  ).then((modulo) => ({
    default: modulo.ValesConsumoPage,
  })),
)

const NuevoValePage = lazy(() =>
  import(
    '../pages/vales-consumo/NuevoValePage'
  ).then((modulo) => ({
    default: modulo.NuevoValePage,
  })),
)

const EditarValePage = lazy(() =>
  import(
    '../pages/vales-consumo/EditarValePage'
  ).then((modulo) => ({
    default: modulo.EditarValePage,
  })),
)

function CargandoPagina() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        color: '#166534',
        background: '#f4f7f5',
        fontWeight: 700,
      }}
    >
      Cargando módulo...
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={<CargandoPagina />}
        >
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

            <Route
              element={<ProtectedRoute />}
            >
              <Route
                element={<MainLayout />}
              >
                <Route
                  path="/dashboard"
                  element={<DashboardPage />}
                />

                <Route
                  path="/sin-permiso"
                  element={
                    <AccessDeniedPage />
                  }
                />

                <Route
                  element={
                    <RoleRoute modulo="control-almacen" />
                  }
                >
                  <Route
                    path="/control-almacen"
                    element={
                      <ControlAlmacenPage />
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
                    element={
                      <ValesConsumoPage />
                    }
                  />
                  <Route
                    path="/vales-consumo/nuevo"
                    element={
                      <NuevoValePage />
                    }
                  />
                  <Route
                    path="/vales-consumo/:id/editar"
                    element={
                      <EditarValePage />
                    }
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
                  <Route
                    path="/ingresos-almacen/nuevo"
                    element={
                      <NuevoIngresoPage />
                    }
                  />
                  <Route
                    path="/ingresos-almacen/:id/editar"
                    element={
                      <EditarIngresoPage />
                    }
                  />
                </Route>

                <Route
                  element={
                    <RoleRoute modulo="reporte-ingresos" />
                  }
                >
                  <Route
                    path="/reportes/ingresos"
                    element={
                      <ReporteIngresosPage />
                    }
                  />
                </Route>

                <Route
                  element={
                    <RoleRoute modulo="reporte-vales" />
                  }
                >
                  <Route
                    path="/reportes/vales"
                    element={
                      <ReporteValesPage />
                    }
                  />
                </Route>

                <Route
                  element={
                    <RoleRoute modulo="reporte-productos" />
                  }
                >
                  <Route
                    path="/reportes/productos-mas-pedidos"
                    element={
                      <ReporteProductosMasPedidosPage />
                    }
                  />
                </Route>

                <Route
                  element={
                    <RoleRoute modulo="proveedores" />
                  }
                >
                  <Route
                    path="/proveedores"
                    element={
                      <ProveedoresPage />
                    }
                  />
                  <Route
                    path="/proveedores/nuevo"
                    element={
                      <NuevoProveedorPage />
                    }
                  />
                  <Route
                    path="/proveedores/:id/editar"
                    element={
                      <EditarProveedorPage />
                    }
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
                    element={
                      <NuevoProductoPage />
                    }
                  />
                  <Route
                    path="/productos/:id/editar"
                    element={
                      <EditarProductoPage />
                    }
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
                    element={
                      <PartesEquipoPage />
                    }
                  />
                </Route>

                <Route
                  element={
                    <RoleRoute modulo="centros-costo" />
                  }
                >
                  <Route
                    path="/centros-costo"
                    element={
                      <CentrosCostoPage />
                    }
                  />
                </Route>

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
                    <RoleRoute modulo="tipos-producto" />
                  }
                >
                  <Route
                    path="/tipos-producto"
                    element={
                      <TiposProductoPage />
                    }
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
                    <RoleRoute modulo="perfil-usuario" />
                  }
                >
                  <Route
                    path="/perfil"
                    element={
                      <PerfilUsuarioPage />
                    }
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
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}