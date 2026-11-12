import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

interface RoleRouteProps {
  modulo: string
}

const RUTAS_ESPECIALES: Record<string, string> = {
  'reporte-ingresos': '/reportes/ingresos',
  'reporte-vales': '/reportes/vales',
  'reporte-productos':
    '/reportes/productos-mas-pedidos',
  'reporte-kardex': '/reportes/kardex',
}

function normalizarRuta(ruta: string): string {
  const rutaNormalizada =
    ruta.trim().toLowerCase()

  return rutaNormalizada.startsWith('/')
    ? rutaNormalizada
    : `/${rutaNormalizada}`
}

function obtenerRutaModulo(
  modulo: string,
): string {
  const codigo =
    modulo.trim().toLowerCase()

  return (
    RUTAS_ESPECIALES[codigo] ??
    normalizarRuta(codigo)
  )
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
            pathname:
              ubicacion.pathname,
          },
        }}
      />
    )
  }

  const rutaModulo =
    obtenerRutaModulo(modulo)

  const autorizado =
    sesion.rolId === 1 ||
    sesion.modulos.some(
      (rutaPermitida) =>
        normalizarRuta(rutaPermitida) ===
        rutaModulo,
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