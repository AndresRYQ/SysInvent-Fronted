import type {
  Rol,
  RolFormData,
} from '../types/rol'
import type {
  SesionUsuario,
} from '../types/auth'
import {
  guardarStorage,
  obtenerStorage,
} from './storageService'
import { registrarEventoBitacora } from './bitacoraService'
import { API_URL } from './api'
import { getToken } from './authService'

const STORAGE_KEY = 'agrihusac_roles'

export const MODULOS_SISTEMA = [
  {
    id: 'roles',
    backendId: 1,
    nombre: 'Roles',
  },
  {
    id: 'usuarios',
    backendId: 2,
    nombre: 'Usuarios',
  },
  {
    id: 'tipos-producto',
    backendId: 3,
    nombre: 'Tipos de producto',
  },
  {
    id: 'proveedores',
    backendId: 4,
    nombre: 'Proveedores',
  },
  {
    id: 'tipos-documento',
    backendId: 5,
    nombre: 'Tipos de documento',
  },
  {
    id: 'destinos',
    backendId: 6,
    nombre: 'Destinos',
  },
  {
    id: 'productos',
    backendId: 7,
    nombre: 'Productos',
  },
  {
    id: 'unidades-medida',
    backendId: 8,
    nombre: 'Unidades de medida',
  },
  {
    id: 'categorias',
    backendId: 9,
    nombre: 'Categorías',
  },
  {
    id: 'centros-costo',
    backendId: 10,
    nombre: 'Centros de costo',
  },
  {
    id: 'bitacora',
    backendId: 11,
    nombre: 'Bitácora',
  },
  {
    id: 'reporte-ingresos',
    backendId: 12,
    nombre: 'Reporte de ingresos',
  },
  {
    id: 'reporte-vales',
    backendId: 13,
    nombre: 'Reporte de vales',
  },
  {
    id: 'reporte-productos',
    backendId: 14,
    nombre: 'Productos más pedidos',
  },
  {
    id: 'contactos',
    backendId: 15,
    nombre: 'Contactos',
  },
  {
    id: 'partes-equipo',
    backendId: 16,
    nombre: 'Partes de equipo',
  },
  {
    id: 'control-almacen',
    backendId: 17,
    nombre: 'Control de almacén',
  },
  {
    id: 'vales-consumo',
    backendId: 18,
    nombre: 'Vales de consumo',
  },
  {
    id: 'ingresos-almacen',
    backendId: 19,
    nombre: 'Ingresos de almacén',
  },
  {
    id: 'perfil-usuario',
    backendId: 20,
    nombre: 'Perfil de usuario',
  },
] as const

const TODOS_LOS_MODULOS =
  MODULOS_SISTEMA.map((modulo) => modulo.id)

const ROLES_INICIALES: Rol[] = [
  {
    id: 'ROL-001',
    nombre: 'Administrador',
    descripcion:
      'Control total del sistema.',
    estado: true,
    usuarios: 1,
    modulos: [...TODOS_LOS_MODULOS],
  },
  {
    id: 'ROL-002',
    nombre: 'Almacenero',
    descripcion:
      'Gestión operativa del almacén.',
    estado: true,
    usuarios: 1,
    modulos: [
      'productos',
      'control-almacen',
      'vales-consumo',
      'ingresos-almacen',
      'perfil-usuario',
    ],
  },
  {
    id: 'ROL-003',
    nombre: 'Supervisor',
    descripcion:
      'Supervisión y consulta de operaciones.',
    estado: true,
    usuarios: 0,
    modulos: [
      'bitacora',
      'control-almacen',
      'reporte-ingresos',
      'reporte-vales',
      'reporte-kardex',
      'reporte-productos',
      'perfil-usuario',
    ],
  },
]

function copiarRoles(roles: Rol[]): Rol[] {
  return roles.map((rol) => ({
    ...rol,
    modulos: Array.isArray(rol.modulos)
  ? [...rol.modulos]
  : [],
  }))
}

export function obtenerRoles(): Rol[] {
  const guardados = obtenerStorage<Rol[]>(
    STORAGE_KEY,
    [],
  )

  if (guardados.length > 0) {
    const rolesActualizados = guardados.map((rol) => {
      const nombre = rol.nombre.trim().toLowerCase()
      const debeTenerKardex =
        nombre === 'administrador' ||
        nombre === 'supervisor'
      const modulos = Array.isArray(rol.modulos)
        ? rol.modulos
        : []

      if (!debeTenerKardex || modulos.includes('reporte-kardex')) {
        return rol
      }

      return {
        ...rol,
        modulos: [...modulos, 'reporte-kardex'],
      }
    })

    if (rolesActualizados.some((rol, index) => rol !== guardados[index])) {
      guardarStorage(STORAGE_KEY, rolesActualizados)
    }

    return copiarRoles(rolesActualizados)
  }

  guardarStorage(
    STORAGE_KEY,
    ROLES_INICIALES,
  )

  return copiarRoles(ROLES_INICIALES)
}

function guardarRoles(roles: Rol[]): void {
  guardarStorage(STORAGE_KEY, roles)
}

function validarNombre(
  nombre: string,
  idActual?: string,
): void {
  const normalizado =
    nombre.trim().toLowerCase()

  const repetido = obtenerRoles().some(
    (rol) =>
      rol.id !== idActual &&
      rol.nombre.trim().toLowerCase() ===
        normalizado,
  )

  if (repetido) {
    throw new Error(
      'Ya existe un rol con ese nombre.',
    )
  }
}

function generarId(roles: Rol[]): string {
  const mayor = roles.reduce(
    (resultado, rol) => {
      const numero = Number(
        rol.id.replace('ROL-', ''),
      )

      return Number.isNaN(numero)
        ? resultado
        : Math.max(resultado, numero)
    },
    0,
  )

  return `ROL-${String(mayor + 1).padStart(
    3,
    '0',
  )}`
}

export function crearRol(
  datos: RolFormData,
): Rol {
  validarNombre(datos.nombre)

  const roles = obtenerRoles()

  const nuevo: Rol = {
    id: generarId(roles),
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    estado: datos.estado,
    usuarios: 0,
    modulos: [...datos.modulos],
  }

  guardarRoles([...roles, nuevo])

  registrarEventoBitacora({
    modulo: 'Roles',
    accion: 'CREAR',
    detalle: `Se creó el rol "${nuevo.nombre}".`,
    registroId: nuevo.id,
  })

  return nuevo
}

export function actualizarRol(
  id: string,
  datos: RolFormData,
): Rol {
  validarNombre(datos.nombre, id)

  const roles = obtenerRoles()
  const actual = roles.find(
    (rol) => rol.id === id,
  )

  if (!actual) {
    throw new Error(
      'El rol seleccionado no existe.',
    )
  }

  const actualizado: Rol = {
    ...actual,
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    estado: datos.estado,
    modulos: [...datos.modulos],
  }

  guardarRoles(
    roles.map((rol) =>
      rol.id === id ? actualizado : rol,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Roles',
    accion: 'EDITAR',
    detalle: `Se actualizó el rol "${actualizado.nombre}".`,
    registroId: actualizado.id,
  })

  return actualizado
}

export function eliminarRol(id: string): void {
  const roles = obtenerRoles()
  const rol = roles.find(
    (item) => item.id === id,
  )

  if (!rol) {
    throw new Error(
      'El rol seleccionado no existe.',
    )
  }

  if (
    rol.nombre.trim().toLowerCase() ===
    'administrador'
  ) {
    throw new Error(
      'El rol Administrador no puede eliminarse.',
    )
  }

  if (rol.usuarios > 0) {
    throw new Error(
      'No puedes eliminar un rol asignado a usuarios.',
    )
  }

  guardarRoles(
    roles.filter((item) => item.id !== id),
  )

  registrarEventoBitacora({
    modulo: 'Roles',
    accion: 'ELIMINAR',
    detalle: `Se eliminó el rol "${rol.nombre}".`,
    registroId: rol.id,
  })
}

export function sincronizarConteoUsuarios(
  usuarios: Array<{ rol: string }>,
): void {
  const roles = obtenerRoles()

  const actualizados = roles.map((rol) => ({
    ...rol,
    usuarios: usuarios.filter(
  (usuario) =>
    (usuario.rol ?? '')
      .trim()
      .toLowerCase() ===
    (rol.nombre ?? '')
      .trim()
      .toLowerCase(),
).length,
  }))

  guardarRoles(actualizados)
}

export function tienePermisoModulo(
  nombreRol: string | null | undefined,
  moduloId: string,
): boolean {
  if (!nombreRol) {
    return false
  }

  const nombreNormalizado =
    nombreRol.trim().toLowerCase()

  const rol = obtenerRoles().find(
    (item) =>
      item.nombre.trim().toLowerCase() ===
      nombreNormalizado,
  )

  if (!rol || !rol.estado) {
    return false
  }

  return Array.isArray(rol.modulos) &&
    rol.modulos.includes(moduloId)
}

export function tienePermisoSesion(
  sesion:
    | SesionUsuario
    | null
    | undefined,
  moduloId: string,
): boolean {
  if (!sesion) {
    return false
  }

  const nombreRol =
    sesion.rol.trim().toUpperCase()

  const esAdministrador =
    sesion.rolId === 1 ||
    nombreRol === 'ADMIN' ||
    nombreRol === 'ADMINISTRADOR'

  if (esAdministrador) {
    return true
  }

  return Array.isArray(
    sesion.modulos,
  ) && sesion.modulos.includes(moduloId)

  
}

export interface ResultadoRolesBackend {
  roles: Rol[]
  totalItems: number
}

interface RolBackend {
  rolId?: number
  nombre?: string
  descripcion?: string
  activo?: boolean
  usuarios?: number
  modulos?: number[]
}

interface PaginaRolesBackend {
  datos?: RolBackend[]
  paginacion?: {
    numeroPagina?: number
    tamanioPagina?: number
    totalElementos?: number
  }
}

interface MensajeBackend {
  success?: boolean
  message?: string
  status?: number
  data?: unknown
}

function moduloBackendAFrontend(
  backendId: number,
): string | null {
  return (
    MODULOS_SISTEMA.find(
      (modulo) =>
        modulo.backendId === backendId,
    )?.id ?? null
  )
}

function modulosFrontendABackend(
  modulos: string[],
): number[] {
  return modulos.reduce<number[]>(
    (resultado, moduloId) => {
      const modulo =
        MODULOS_SISTEMA.find(
          (item) =>
            item.id === moduloId,
        )

      if (modulo) {
        resultado.push(
          modulo.backendId,
        )
      }

      return resultado
    },
    [],
  )
}

function relanzarError(
  error: unknown,
  mensajePredeterminado: string,
): never {
  if (
    error instanceof Error &&
    error.message
  ) {
    throw error
  }

  throw new Error(mensajePredeterminado)
}

function validarRolId(id: string): number {
  const rolId = Number(id)

  if (
    !Number.isInteger(rolId) ||
    rolId <= 0
  ) {
    throw new Error(
      'El identificador del rol no es válido.',
    )
  }

  return rolId
}

async function rolesApiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()
    ?.trim()
    .replace(/^Bearer\s+/i, '')
    .replace(/^["']|["']$/g, '')

  if (!token) {
    throw new Error(
      'La sesión no contiene un token de acceso. Vuelva a iniciar sesión.',
    )
  }

  const headers = new Headers(
    options.headers,
  )

  headers.set(
    'Authorization',
    `Bearer ${token}`,
  )

  if (
    options.body &&
    !headers.has('Content-Type')
  ) {
    headers.set(
      'Content-Type',
      'application/json',
    )
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    },
  )

  const contentType =
    response.headers.get(
      'content-type',
    ) ?? ''

  const data = contentType.includes(
    'application/json',
  )
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data
        ? String(data.message)
        : `Error HTTP ${response.status}`

    throw new Error(message)
  }

  return data as T
}

export async function obtenerRolesBackend(
  nombre = '',
  pagina = 1,
  tamPagina = 100,
): Promise<ResultadoRolesBackend> {
  try {
    const parametros =
      new URLSearchParams({
        pagina: String(pagina),
        tamPagina: String(tamPagina),
      })

    if (nombre.trim()) {
      parametros.set(
        'nombre',
        nombre.trim(),
      )
    }

    const respuesta =
      await rolesApiFetch<PaginaRolesBackend>(
        `/api/roles?${parametros.toString()}`,
      )

    const roles = (
      respuesta.datos ?? []
    )
      .filter(
        (item) =>
          item.rolId !== undefined,
      )
      .map((item): Rol => ({
        id: String(item.rolId),
        nombre: item.nombre ?? '',
        descripcion:
          item.descripcion ?? '',
        estado: item.activo ?? false,
        usuarios: item.usuarios ?? 0,
        modulos: (
          item.modulos ?? []
        )
          .map(moduloBackendAFrontend)
          .filter(
            (
              moduloId,
            ): moduloId is string =>
              moduloId !== null,
          ),
      }))

    return {
      roles,
      totalItems:
        respuesta.paginacion
          ?.totalElementos ??
        roles.length,
    }
  } catch (error) {
    relanzarError(
      error,
      'No se pudieron cargar los roles.',
    )
  }
}

export async function crearRolBackend(
  datos: RolFormData,
): Promise<void> {
  try {
    const respuesta =
      await rolesApiFetch<MensajeBackend>(
        '/api/roles',
        {
          method: 'POST',
          body: JSON.stringify({
          nombre: datos.nombre.trim(),
          descripcion:
            datos.descripcion.trim(),
          modulos:
            modulosFrontendABackend(
              datos.modulos,
            ),
          }),
        },
      )

    if (respuesta.success === false) {
      throw new Error(
        respuesta.message ??
          'No se pudo registrar el rol.',
      )
    }
  } catch (error) {
    relanzarError(
      error,
      'No se pudo registrar el rol.',
    )
  }
}

export async function actualizarRolBackend(
  id: string,
  datos: RolFormData,
): Promise<void> {
  const rolId = validarRolId(id)

  try {
    const respuesta =
      await rolesApiFetch<MensajeBackend>(
        '/api/roles',
        {
          method: 'PUT',
          body: JSON.stringify({
          rolId,
          nombre: datos.nombre.trim(),
          descripcion:
            datos.descripcion.trim(),
          modulos:
            modulosFrontendABackend(
              datos.modulos,
            ),
          }),
        },
      )

    if (respuesta.success === false) {
      throw new Error(
        respuesta.message ??
          'No se pudo actualizar el rol.',
      )
    }

    const respuestaEstado =
      await rolesApiFetch<MensajeBackend>(
        `/api/roles?rolId=${rolId}&activo=${datos.estado}`,
        {
          method: 'DELETE',
        },
      )

    if (
      respuestaEstado.success === false
    ) {
      throw new Error(
        respuestaEstado.message ??
          'No se pudo actualizar el estado del rol.',
      )
    }
  } catch (error) {
    relanzarError(
      error,
      'No se pudo actualizar el rol.',
    )
  }
}

export async function desactivarRolBackend(
  id: string,
): Promise<void> {
  const rolId = validarRolId(id)

  try {
    const respuesta =
      await rolesApiFetch<MensajeBackend>(
        `/api/roles?rolId=${rolId}&activo=false`,
        {
          method: 'DELETE',
        },
      )

    if (respuesta.success === false) {
      throw new Error(
        respuesta.message ??
          'No se pudo desactivar el rol.',
      )
    }
  } catch (error) {
    relanzarError(
      error,
      'No se pudo desactivar el rol.',
    )
  }
}
