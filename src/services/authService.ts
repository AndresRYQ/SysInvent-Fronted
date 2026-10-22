import { toApiError } from './api'
import {
  LoginApi,
  type LoginRequest,
  type LoginResponse,
} from '../api/generated'
import { apiConfiguration } from '../api/client'

import type {
  CredencialesLogin,
  ResultadoLogin,
  SesionUsuario,
  UsuarioLogin,
} from '../types/auth'

export const AUTH_TOKEN_KEY = 'sysinvent_token'

interface JwtModulo {
  moduloId?: number
  nombre?: string
  ruta?: string
}

interface JwtRol {
  rolId?: number
  nombre?: string
  modulos?: JwtModulo[]
}

interface JwtPayload {
  sub?: string
  usuarioId?: number
  usuario?: string
  username?: string
  nombreCompleto?: string
  nombre?: string
  email?: string
  rolId?: number
  rol?: string
  role?: string
  roles?: JwtRol[]
  modulos?: JwtModulo[]
  exp?: number
  iat?: number
}

const loginApi = new LoginApi(apiConfiguration)

async function requestLogin(
  usuario: string,
  contrasena: string,
): Promise<LoginResponse> {
  const request: LoginRequest = { usuario, contrasena }
  return await loginApi.login({ loginRequest: request })
}

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    '=',
  )

  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((character) =>
        `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`,
      )
      .join(''),
  )
}

function obtenerPayloadJwt(token: string): JwtPayload | null {
  const [, payload] = token.split('.')

  if (!payload) {
    return null
  }

  try {
    return JSON.parse(decodeBase64Url(payload)) as JwtPayload
  } catch {
    return null
  }
}

function convertirRutaAModuloId(
  ruta?: string,
): string | null {
  if (!ruta) {
    return null
  }

  const rutaNormalizada =
    ruta.trim().replace(/\/+$/, '')

  const equivalencias:
    Record<string, string> = {
      '/roles': 'roles',
      '/usuarios': 'usuarios',
      '/tipos-producto': 'tipos-producto',
      '/proveedores': 'proveedores',
      '/tipos-documento': 'tipos-documento',
      '/destinos': 'destinos',
      '/productos': 'productos',
      '/unidades-medida': 'unidades-medida',
      '/categorias': 'categorias',
      '/centros-costos': 'centros-costo',
      '/bitacora': 'bitacora',
      '/reportes/ingresos':
        'reporte-ingresos',
      '/reportes/vales': 'reporte-vales',
      '/reportes/productos-mas-pedidos':
        'reporte-productos',
      '/contactos': 'contactos',
      '/partes-equipo': 'partes-equipo',
      '/control-almacen':
        'control-almacen',
      '/vales-consumo': 'vales-consumo',
      '/ingresos-almacen':
        'ingresos-almacen',
      '/perfil': 'perfil-usuario',
    }

  return equivalencias[rutaNormalizada] ?? null
}

function crearSesionDesdeToken(
  token: string,
): SesionUsuario {
  const payload = obtenerPayloadJwt(token)

  const usuario =
    payload?.usuario ??
    payload?.username ??
    payload?.sub ??
    'usuario'

  const rolPrincipal =
    payload?.roles?.[0]

  const rol =
    rolPrincipal?.nombre ??
    payload?.rol ??
    payload?.role ??
    'Sin rol'

  const rolId =
    rolPrincipal?.rolId ??
    payload?.rolId ??
    null

  const modulosToken =
    payload?.modulos?.length
      ? payload.modulos
      : rolPrincipal?.modulos ?? []

  const modulos = Array.from(
    new Set(
      modulosToken
        .map((modulo) =>
          convertirRutaAModuloId(
            modulo.ruta,
          ),
        )
        .filter(
          (moduloId):
            moduloId is string =>
              Boolean(moduloId),
        ),
    ),
  )

  const nombreCompleto =
    payload?.nombreCompleto ??
    payload?.nombre ??
    usuario

  const fechaInicio = payload?.iat
    ? new Date(
        payload.iat * 1000,
      ).toISOString()
    : new Date().toISOString()

  const fechaExpiracion = payload?.exp
    ? new Date(
        payload.exp * 1000,
      ).toISOString()
    : new Date(
        Date.now() + 5 * 60 * 1000,
      ).toISOString()

  return {
    id: String(
      payload?.usuarioId ?? usuario,
    ),
    usuario,
    nombreCompleto,
    email: payload?.email ?? '',
    rolId,
    rol,
    modulos,
    token,
    fechaInicio,
    fechaExpiracion,
  }
}

export async function login(
  usuario: string,
  contrasena: string,
): Promise<ResultadoLogin> {
  try {
    const response = await requestLogin(usuario, contrasena)

    if (response.success === true && typeof response.data === 'string') {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data)

      return {
        exitoso: true,
        sesion: crearSesionDesdeToken(response.data),
        mensaje: response.message || 'Inicio de sesion correcto',
        bloqueadoHasta: null,
      }
    }

    return {
      exitoso: false,
      sesion: null,
      mensaje: response.message || 'Usuario o contraseña incorrectos',
      bloqueadoHasta: null,
    }
  } catch (error) {
    const apiError = toApiError(error)

    return {
      exitoso: false,
      sesion: null,
      mensaje:
        apiError.status === 401
          ? 'Usuario o contraseña incorrectos'
          : 'No se pudo conectar con el servidor',
      bloqueadoHasta: null,
    }
  }
}

export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getAuthHeaders(): HeadersInit {
  const token = getToken()

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}
}

export function isAuthenticated(): boolean {
  return getToken() !== null
}

export const iniciarSesion = (credenciales: CredencialesLogin) =>
  login(credenciales.usuario, credenciales.contrasena)

export function obtenerSesion(): SesionUsuario | null {
  const token = getToken()

  return token ? crearSesionDesdeToken(token) : null
}

export function cerrarSesion(): void {
  logout()
}

export function estaAutenticado(): boolean {
  return isAuthenticated()
}

export function sincronizarSesionUsuario(
  usuario: UsuarioLogin,
): SesionUsuario | null {
  const sesionActual = obtenerSesion()

  if (!sesionActual) {
    return null
  }

  return {
  ...sesionActual,
  id: usuario.id,
  usuario: usuario.usuario,
  nombreCompleto:
    usuario.nombreCompleto,
  email: usuario.email,
  rol: usuario.rol,
  }
}
