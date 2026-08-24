import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  cerrarSesion,
  iniciarSesion,
  obtenerSesion,
} from '../services/authService'

import { STORAGE_KEYS } from '../services/storageService'

import type {
  CredencialesLogin,
  ResultadoLogin,
  SesionUsuario,
} from '../types/auth'

interface AuthContextType {
  sesion: SesionUsuario | null

  login: (
    credenciales: CredencialesLogin,
  ) => ResultadoLogin

  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  )

const TIEMPO_INACTIVIDAD_MS =  2 * 60 * 1000

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [sesion, setSesion] =
    useState<SesionUsuario | null>(
      () => obtenerSesion(),
    )

  const login = useCallback(
    (
      credenciales: CredencialesLogin,
    ): ResultadoLogin => {
      const resultado =
        iniciarSesion(credenciales)

      if (
        resultado.exitoso &&
        resultado.sesion
      ) {
        setSesion(resultado.sesion)
      }

      return resultado
    },
    [],
  )

  const logout = useCallback(() => {
    cerrarSesion()
    setSesion(null)
  }, [])

  /*
   * Finaliza la sesión cuando llega
   * su fecha de expiración.
   */
  useEffect(() => {
    if (!sesion) {
      return
    }

    const fechaExpiracion = Date.parse(
      sesion.fechaExpiracion,
    )

    const tiempoRestante =
      fechaExpiracion - Date.now()

    if (
      Number.isNaN(fechaExpiracion) ||
      tiempoRestante <= 0
    ) {
      logout()
      return
    }

    const temporizador = window.setTimeout(
      logout,
      tiempoRestante,
    )

    return () => {
      window.clearTimeout(temporizador)
    }
  }, [sesion, logout])

  /*
 * Cierra la sesión si el usuario no
 * realiza ninguna actividad durante
 * dos minutos.
 */
useEffect(() => {
  if (!sesion) {
    return
  }

  let temporizador:
    number | undefined

  const cerrarPorInactividad = () => {
    sessionStorage.setItem(
      'agrihusac_motivo_cierre',
      'inactividad',
    )

    logout()
  }

  const reiniciarTemporizador = () => {
    if (temporizador) {
      window.clearTimeout(temporizador)
    }

    temporizador = window.setTimeout(
      cerrarPorInactividad,
      TIEMPO_INACTIVIDAD_MS,
    )
  }

  reiniciarTemporizador()

  window.addEventListener(
    'pointerdown',
    reiniciarTemporizador,
  )

  window.addEventListener(
    'keydown',
    reiniciarTemporizador,
  )

  window.addEventListener(
    'scroll',
    reiniciarTemporizador,
    { passive: true },
  )

  window.addEventListener(
    'touchstart',
    reiniciarTemporizador,
    { passive: true },
  )

  return () => {
    if (temporizador) {
      window.clearTimeout(temporizador)
    }

    window.removeEventListener(
      'pointerdown',
      reiniciarTemporizador,
    )

    window.removeEventListener(
      'keydown',
      reiniciarTemporizador,
    )

    window.removeEventListener(
      'scroll',
      reiniciarTemporizador,
    )

    window.removeEventListener(
      'touchstart',
      reiniciarTemporizador,
    )
  }
}, [sesion, logout])

  /*
   * Sincroniza el inicio y cierre
   * de sesión entre pestañas.
   */
  useEffect(() => {
    const sincronizarSesion = (
      evento: StorageEvent,
    ) => {
      if (
        evento.key === STORAGE_KEYS.sesion
      ) {
        setSesion(obtenerSesion())
      }
    }

    window.addEventListener(
      'storage',
      sincronizarSesion,
    )

    return () => {
      window.removeEventListener(
        'storage',
        sincronizarSesion,
      )
    }
  }, [])

  const valorContexto =
    useMemo<AuthContextType>(
      () => ({
        sesion,
        login,
        logout,
      }),
      [sesion, login, logout],
    )

  return (
    <AuthContext.Provider
      value={valorContexto}
    >
      {children}
    </AuthContext.Provider>
  )
  
}

export function useAuth(): AuthContextType {
  const contexto = useContext(AuthContext)

  if (!contexto) {
    throw new Error(
      'useAuth debe utilizarse dentro de AuthProvider',
    )
  }

  return contexto
}