import type {
  Rol,
  RolFormData,
} from '../types/rol'

import {
  guardarStorage,
  obtenerStorage,
} from './storageService'

const STORAGE_KEY = 'agrihusac_roles'

export const MODULOS_SISTEMA = [
  { id: 'roles', nombre: 'Roles' },
  { id: 'usuarios', nombre: 'Usuarios' },
  {
    id: 'tipos-producto',
    nombre: 'Tipos de producto',
  },
  { id: 'proveedores', nombre: 'Proveedores' },
  {
    id: 'tipos-documento',
    nombre: 'Tipos de documento',
  },
  { id: 'destinos', nombre: 'Destinos' },
  { id: 'productos', nombre: 'Productos' },
  {
    id: 'unidades-medida',
    nombre: 'Unidades de medida',
  },
  { id: 'categorias', nombre: 'Categorías' },
  {
    id: 'centros-costo',
    nombre: 'Centros de costo',
  },
  { id: 'bitacora', nombre: 'Bitácora' },
  {
    id: 'reporte-ingresos',
    nombre: 'Reporte de ingresos',
  },
  {
    id: 'reporte-vales',
    nombre: 'Reporte de vales',
  },
  {
    id: 'reporte-productos',
    nombre: 'Productos más pedidos',
  },
  { id: 'contactos', nombre: 'Contactos' },
  {
    id: 'partes-equipo',
    nombre: 'Partes de equipo',
  },
  {
    id: 'control-almacen',
    nombre: 'Control de almacén',
  },
  {
    id: 'vales-consumo',
    nombre: 'Vales de consumo',
  },
  {
    id: 'ingresos-almacen',
    nombre: 'Ingresos de almacén',
  },
  {
    id: 'perfil-usuario',
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
    return copiarRoles(guardados)
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