import { useEffect } from 'react'

import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const { sesion, logout } = useAuth()
  const ubicacion = useLocation()

  const fechaExpiracion = sesion
    ? Date.parse(sesion.fechaExpiracion)
    : Number.NaN

  const tokenValido =
    Boolean(sesion?.token) &&
    !Number.isNaN(fechaExpiracion) &&
    Date.now() < fechaExpiracion

  useEffect(() => {
    if (sesion && !tokenValido) {
      logout()
    }
  }, [sesion, tokenValido, logout])

  if (!sesion || !tokenValido) {
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