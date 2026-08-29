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
import { TiposProductoPage } from '../pages/tipos-producto/TiposProductoPage'
import { TiposComprobantePage } from '../pages/tipos-comprobante/TiposComprobantePage'
import { ValesConsumoPage } from '../pages/vales-consumo/ValesConsumoPage'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'

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
                  <RoleRoute
                    rolesPermitidos={[
                      'Administrador',
                    ]}
                  />
                }
              >
                <Route
                  path="/categorias"
                  element={<CategoriasPage />}
                />
                <Route
                  path="/centros-costo"
                  element={<CentrosCostoPage />}
                />
                <Route
                  path="/tipos-producto"
                  element={<TiposProductoPage />}
                />
                <Route
                  path="/tipos-comprobante"
                  element={<TiposComprobantePage />}
                />
                <Route
                  path="/vales-consumo"
                  element={<ValesConsumoPage />}
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
