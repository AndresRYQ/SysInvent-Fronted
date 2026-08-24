import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import {
  AuthProvider,
  useAuth,
} from '../hooks/useAuth'
import { AccessDeniedPage } from '../pages/AccessDeniedPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { CategoriasPage } from '../pages/categorias/CategoriasPage'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'

function DashboardTemporal() {
  const { sesion, logout } = useAuth()

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '48px 24px',
        background: '#f4f7f4',
      }}
    >
      <section
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          padding: '32px',
          borderRadius: '18px',
          background: '#ffffff',
          boxShadow:
            '0 10px 30px rgb(0 0 0 / 8%)',
        }}
      >
        <p
          style={{
            margin: 0,
            color: '#338f3c',
            fontWeight: 700,
          }}
        >
          AGRIHUSAC
        </p>

        <h1>
          Bienvenido,{' '}
          {sesion?.nombreCompleto}
        </h1>

        <p>
          Rol actual: {sesion?.rol}
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '24px',
          }}
        >
          <a
            href="/categorias"
            style={{
              padding: '12px 18px',
              borderRadius: '9px',
              color: '#1f2937',
              background: '#dff3e2',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Probar algo
          </a>

          <a
            href="/categorias"
            style={{
              padding: '12px 18px',
              borderRadius: '9px',
              color: '#ffffff',
              background: '#338f3c',
              textDecoration: 'none',
            }}
          >
            Probar módulo Categorías
          </a>

          <button
            type="button"
            onClick={logout}
            style={{
              padding: '12px 18px',
              borderRadius: '9px',
              color: '#ffffff',
              background: '#6d716e',
              cursor: 'pointer',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </section>
    </main>
  )
}

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
            <Route
              path="/dashboard"
              element={<DashboardTemporal />}
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
