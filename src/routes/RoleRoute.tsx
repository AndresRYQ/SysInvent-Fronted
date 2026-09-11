import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

import {
  tienePermisoModulo,
} from '../services/rolService'

interface RoleRouteProps {
  modulo: string
}

export function RoleRoute({
  modulo,
}: RoleRouteProps) {
  const { sesion } = useAuth()
  const ubicacion = useLocation()

  if (!sesion) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          desde: {
            pathname: ubicacion.pathname,
          },
        }}
      />
    )
  }

  const autorizado = tienePermisoModulo(
    sesion.rol,
    modulo,
  )

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