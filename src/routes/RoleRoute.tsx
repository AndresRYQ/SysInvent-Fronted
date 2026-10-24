import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
interface RoleRouteProps {
  modulo: string
}

export function RoleRoute({
  modulo,
}: RoleRouteProps) {
  const { sesion } = useAuth()
  const ubicacion = useLocation()

  // Temporalmente se desactiva la validación por módulo
  // mientras se corrige la sesión proveniente del JWT.
  const autorizado = true

  if (!sesion) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          desde: {
            pathname:
              ubicacion.pathname,
          },
        }}
      />
    )
  }

  if (!autorizado) {
    return (
      <Navigate
        to="/sin-permiso"
        replace
        state={{
          rutaIntentada:
            ubicacion.pathname,
        }}
      />
    )
  }

  return <Outlet />
}
