import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
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

  return <Outlet />
}
