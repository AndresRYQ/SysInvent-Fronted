import { USUARIOS_INICIALES } from '../data/usuarios'

import type {
  CredencialesLogin,
  EstadoIntentosLogin,
  ResultadoLogin,
  SesionUsuario,
  UsuarioLogin,
} from '../types/auth'

import {
  eliminarStorage,
  guardarStorage,
  obtenerStorage,
  STORAGE_KEYS,
} from './storageService'

const DURACION_SESION_MINUTOS = 5
const MAXIMO_INTENTOS = 3
const DURACION_BLOQUEO_MINUTOS = 5

function inicializarUsuarios(): UsuarioLogin[] {
  const usuariosGuardados =
    obtenerStorage<UsuarioLogin[]>(
      STORAGE_KEYS.usuarios,
      [],
    )

  if (usuariosGuardados.length > 0) {
    return usuariosGuardados
  }

  guardarStorage(
    STORAGE_KEYS.usuarios,
    USUARIOS_INICIALES,
  )

  return USUARIOS_INICIALES
}

function generarTokenSeguro(): string {
  const bytes = new Uint8Array(32)

  crypto.getRandomValues(bytes)

  const textoBinario = Array.from(
    bytes,
    (byte) => String.fromCharCode(byte),
  ).join('')

  return btoa(textoBinario)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function calcularFechaExpiracion(): string {
  const fechaExpiracion = new Date()

  fechaExpiracion.setMinutes(
    fechaExpiracion.getMinutes() +
      DURACION_SESION_MINUTOS,
  )

  return fechaExpiracion.toISOString()
}

function normalizarUsuario(
  usuario: string,
): string {
  return usuario.trim().toLowerCase()
}

function obtenerEstadosIntentos():
  EstadoIntentosLogin[] {
  return obtenerStorage<EstadoIntentosLogin[]>(
    STORAGE_KEYS.intentosLogin,
    [],
  )
}

function obtenerEstadoIntentos(
  usuario: string,
): EstadoIntentosLogin {
  const usuarioNormalizado =
    normalizarUsuario(usuario)

  const estado = obtenerEstadosIntentos().find(
    (registro) =>
      registro.usuario === usuarioNormalizado,
  )

  return (
    estado ?? {
      usuario: usuarioNormalizado,
      intentosFallidos: 0,
      bloqueadoHasta: null,
    }
  )
}

function guardarEstadoIntentos(
  estado: EstadoIntentosLogin,
): void {
  const otrosEstados =
    obtenerEstadosIntentos().filter(
      (registro) =>
        registro.usuario !== estado.usuario,
    )

  const debeGuardar =
    estado.intentosFallidos > 0 ||
    Boolean(estado.bloqueadoHasta)

  guardarStorage(
    STORAGE_KEYS.intentosLogin,
    debeGuardar
      ? [...otrosEstados, estado]
      : otrosEstados,
  )
}

function limpiarIntentos(
  usuario: string,
): void {
  guardarEstadoIntentos({
    usuario: normalizarUsuario(usuario),
    intentosFallidos: 0,
    bloqueadoHasta: null,
  })
}

function calcularBloqueo(): string {
  const fechaBloqueo = new Date()

  fechaBloqueo.setMinutes(
    fechaBloqueo.getMinutes() +
      DURACION_BLOQUEO_MINUTOS,
  )

  return fechaBloqueo.toISOString()
}

function obtenerMinutosRestantes(
  bloqueadoHasta: string,
): number {
  const diferencia =
    Date.parse(bloqueadoHasta) - Date.now()

  return Math.max(
    1,
    Math.ceil(diferencia / 60_000),
  )
}

export function iniciarSesion(
  credenciales: CredencialesLogin,
): ResultadoLogin {
  const usuarioNormalizado =
    normalizarUsuario(credenciales.usuario)

  const estadoIntentos =
    obtenerEstadoIntentos(usuarioNormalizado)

  if (estadoIntentos.bloqueadoHasta) {
    const fechaBloqueo = Date.parse(
      estadoIntentos.bloqueadoHasta,
    )

    const bloqueoVigente =
      !Number.isNaN(fechaBloqueo) &&
      Date.now() < fechaBloqueo

    if (bloqueoVigente) {
      const minutos = obtenerMinutosRestantes(
        estadoIntentos.bloqueadoHasta,
      )

      return {
        exitoso: false,
        sesion: null,
        mensaje:
          `Acceso bloqueado. Intenta nuevamente en ${minutos} minuto(s).`,
        bloqueadoHasta:
          estadoIntentos.bloqueadoHasta,
      }
    }

    limpiarIntentos(usuarioNormalizado)
  }

  const usuarios = inicializarUsuarios()

  const usuarioEncontrado = usuarios.find(
    (usuario) =>
      usuario.usuario.toLowerCase() ===
        usuarioNormalizado &&
      usuario.contrasena ===
        credenciales.contrasena &&
      usuario.estado,
  )

  if (!usuarioEncontrado) {
    const estadoActual =
      obtenerEstadoIntentos(
        usuarioNormalizado,
      )

    const nuevosIntentos =
      estadoActual.intentosFallidos + 1

    if (nuevosIntentos >= MAXIMO_INTENTOS) {
      const bloqueadoHasta =
        calcularBloqueo()

      guardarEstadoIntentos({
        usuario: usuarioNormalizado,
        intentosFallidos: nuevosIntentos,
        bloqueadoHasta,
      })

      return {
        exitoso: false,
        sesion: null,
        mensaje:
          'Demasiados intentos incorrectos. Acceso bloqueado durante 5 minutos.',
        bloqueadoHasta,
      }
    }

    guardarEstadoIntentos({
      usuario: usuarioNormalizado,
      intentosFallidos: nuevosIntentos,
      bloqueadoHasta: null,
    })

    const intentosRestantes =
      MAXIMO_INTENTOS - nuevosIntentos

    return {
      exitoso: false,
      sesion: null,
      mensaje:
        `Usuario o contraseña incorrectos. Te quedan ${intentosRestantes} intento(s).`,
      bloqueadoHasta: null,
    }
  }

  limpiarIntentos(usuarioNormalizado)

  const sesion: SesionUsuario = {
    id: usuarioEncontrado.id,
    usuario: usuarioEncontrado.usuario,
    nombreCompleto:
      usuarioEncontrado.nombreCompleto,
    rol: usuarioEncontrado.rol,
    token: generarTokenSeguro(),
    fechaInicio: new Date().toISOString(),
    fechaExpiracion:
      calcularFechaExpiracion(),
  }

  guardarStorage(
    STORAGE_KEYS.sesion,
    sesion,
  )

  return {
    exitoso: true,
    sesion,
    mensaje: 'Inicio de sesión correcto.',
    bloqueadoHasta: null,
  }
}

export function obtenerSesion():
  SesionUsuario | null {
  const sesion =
    obtenerStorage<SesionUsuario | null>(
      STORAGE_KEYS.sesion,
      null,
    )

  if (!sesion) {
    return null
  }

  if (
    !sesion.token ||
    !sesion.fechaExpiracion
  ) {
    cerrarSesion()
    return null
  }

  // Comentado temporalmente: validaciÃ³n
  // de expiraciÃ³n por tiempo.
  // const fechaExpiracion = Date.parse(
  //   sesion.fechaExpiracion,
  // )
  //
  // const fechaInvalida =
  //   Number.isNaN(fechaExpiracion)
  //
  // const sesionVencida =
  //   Date.now() >= fechaExpiracion
  //
  // if (fechaInvalida || sesionVencida) {
  //   cerrarSesion()
  //   return null
  // }

  return sesion
}

export function cerrarSesion(): void {
  eliminarStorage(STORAGE_KEYS.sesion)
}

export function estaAutenticado(): boolean {
  return obtenerSesion() !== null
}
