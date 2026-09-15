import {
  useEffect,
  useRef,
} from 'react'
import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { registrarEventoBitacora } from '../services/bitacoraService'
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

  const ultimoAccesoRegistrado =
    useRef('')

  const autorizado = sesion
    ? tienePermisoModulo(
        sesion.rol,
        modulo,
      )
    : false

  useEffect(() => {
    if (!sesion || autorizado) {
      return
    }

    const identificadorAcceso =
      `${sesion.id}:${modulo}:${ubicacion.pathname}`

    if (
      ultimoAccesoRegistrado.current ===
      identificadorAcceso
    ) {
      return
    }

    ultimoAccesoRegistrado.current =
      identificadorAcceso

    registrarEventoBitacora({
      modulo,
      accion: 'ACCESO_DENEGADO',
      detalle:
        `Intento de acceso sin permiso a la ruta ${ubicacion.pathname}.`,
      registroId: sesion.id,
    })
  }, [
    autorizado,
    modulo,
    sesion,
    ubicacion.pathname,
  ])

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