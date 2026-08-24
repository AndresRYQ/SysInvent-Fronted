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