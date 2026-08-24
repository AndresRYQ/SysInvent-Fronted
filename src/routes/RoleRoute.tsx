import {   Navigate,  Outlet,  useLocation,} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface RoleRouteProps {
  rolesPermitidos: string[]
}

function normalizarRol(
  rol: string,
): string {
  return rol.trim().toLowerCase()
}

export function RoleRoute({
  rolesPermitidos,
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

  const rolActual = normalizarRol(
    sesion.rol,
  )

  const tienePermiso =
    rolesPermitidos.some(
      (rolPermitido) =>
        normalizarRol(rolPermitido) ===
        rolActual,
    )

  if (!tienePermiso) {
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