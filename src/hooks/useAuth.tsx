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
  sincronizarSesionUsuario,
} from '../services/authService'

import {
  STORAGE_KEYS,
} from '../services/storageService'

import type {
  CredencialesLogin,
  ResultadoLogin,
  SesionUsuario,
  UsuarioLogin,
} from '../types/auth'

interface AuthContextType {
  sesion: SesionUsuario | null

  login: (
    credenciales: CredencialesLogin,
  ) => ResultadoLogin

  logout: () => void

  actualizarSesionUsuario: (
    usuario: UsuarioLogin,
  ) => void
}

interface AuthProviderProps {
  children: ReactNode
}

type MotivoCierre =
  | 'inactividad'
  | 'vencimiento'

const TIEMPO_INACTIVIDAD_MS =
  2 * 60 * 1000

const MOTIVO_CIERRE_KEY =
  'agrihusac_motivo_cierre'

const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined)

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [sesion, setSesion] =
    useState<SesionUsuario | null>(
      () => obtenerSesion(),
    )

  const finalizarSesion = useCallback(
    (motivo?: MotivoCierre) => {
      if (motivo) {
        sessionStorage.setItem(
          MOTIVO_CIERRE_KEY,
          motivo,
        )
      }

      const detalle =
        motivo === 'inactividad'
          ? 'La sesiÃ³n se cerrÃ³ despuÃ©s de 2 minutos de inactividad.'
          : motivo === 'vencimiento'
            ? 'La sesiÃ³n se cerrÃ³ al alcanzar el tiempo mÃ¡ximo de 5 minutos.'
            : 'El usuario cerrÃ³ la sesiÃ³n manualmente.'

      cerrarSesion(detalle)
      setSesion(null)
    },
    [],
  )

  const login = useCallback(
    (
      credenciales:
        CredencialesLogin,
    ): ResultadoLogin => {
      const resultado =
        iniciarSesion(credenciales)

      if (
        resultado.exitoso &&
        resultado.sesion
      ) {
        sessionStorage.removeItem(
          MOTIVO_CIERRE_KEY,
        )

        setSesion(resultado.sesion)
      }

      return resultado
    },
    [],
  )

  const logout = useCallback(() => {
    sessionStorage.removeItem(
      MOTIVO_CIERRE_KEY,
    )

    finalizarSesion()
  }, [finalizarSesion])

  const actualizarSesionUsuario =
    useCallback(
      (usuario: UsuarioLogin) => {
        const sesionActualizada =
          sincronizarSesionUsuario(
            usuario,
          )

        setSesion(sesionActualizada)
      },
      [],
    )

  /*
   * Cierra automÃ¡ticamente la sesiÃ³n
   * cuando se cumplen los 5 minutos.
   */
  useEffect(() => {
    if (!sesion) {
      return
    }

    const fechaExpiracion =
      Date.parse(
        sesion.fechaExpiracion,
      )

    const tiempoRestante =
      fechaExpiracion - Date.now()

    if (
      Number.isNaN(fechaExpiracion) ||
      tiempoRestante <= 0
    ) {
      finalizarSesion('vencimiento')
      return
    }

    const temporizador =
      window.setTimeout(
        () => {
          finalizarSesion(
            'vencimiento',
          )
        },
        tiempoRestante,
      )

    return () => {
      window.clearTimeout(
        temporizador,
      )
    }
  }, [
    sesion,
    finalizarSesion,
  ])

  /*
   * Cierra la sesiÃ³n despuÃ©s de
   * 2 minutos sin actividad.
   */
  useEffect(() => {
    if (!sesion) {
      return
    }

    let temporizador:
      number | undefined

    const cerrarPorInactividad =
      () => {
        finalizarSesion(
          'inactividad',
        )
      }

    const reiniciarTemporizador =
      () => {
        if (
          temporizador !== undefined
        ) {
          window.clearTimeout(
            temporizador,
          )
        }

        temporizador =
          window.setTimeout(
            cerrarPorInactividad,
            TIEMPO_INACTIVIDAD_MS,
          )
      }

    const eventosActividad: Array<
      keyof WindowEventMap
    > = [
      'pointerdown',
      'keydown',
      'scroll',
      'touchstart',
    ]

    reiniciarTemporizador()

    eventosActividad.forEach(
      (evento) => {
        window.addEventListener(
          evento,
          reiniciarTemporizador,
          {
            passive: true,
          },
        )
      },
    )

    return () => {
      if (
        temporizador !== undefined
      ) {
        window.clearTimeout(
          temporizador,
        )
      }

      eventosActividad.forEach(
        (evento) => {
          window.removeEventListener(
            evento,
            reiniciarTemporizador,
          )
        },
      )
    }
  }, [
    sesion,
    finalizarSesion,
  ])

  /*
   * Sincroniza inicio, cierre y actualizaciÃ³n
   * de sesiÃ³n entre las pestaÃ±as.
   */
  useEffect(() => {
    const sincronizarSesion = (
      evento: StorageEvent,
    ) => {
      if (
        evento.key ===
        STORAGE_KEYS.sesion
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
        actualizarSesionUsuario,
      }),
      [
        sesion,
        login,
        logout,
        actualizarSesionUsuario,
      ],
    )

  return (
    <AuthContext.Provider
      value={valorContexto}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth():
  AuthContextType {
  const contexto =
    useContext(AuthContext)

  if (!contexto) {
    throw new Error(
      'useAuth debe utilizarse dentro de AuthProvider',
    )
  }

  return contexto
}

