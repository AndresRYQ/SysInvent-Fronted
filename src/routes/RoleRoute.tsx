import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

interface RoleRouteProps {
  modulo: string | string[]
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

  const modulosRequeridos =
    Array.isArray(modulo)
      ? modulo
      : [modulo]

  const rutasPermitidas = new Set(
    sesion.modulos.map(normalizarRuta),
  )

  const autorizado =
    sesion.rolId === 1 ||
    modulosRequeridos.some(
      (codigo) =>
        rutasPermitidas.has(
          obtenerRutaModulo(codigo),
        ),
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