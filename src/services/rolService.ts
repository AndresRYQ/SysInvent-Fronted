import { ModuloCodigo } from '../constants/modulos'
import type { Rol, RolFormData } from '../types/rol'
import { apiFetch } from './api'

export const MODULOS_SISTEMA = [
  { id: ModuloCodigo.ROLES, backendId: 1, nombre: 'Roles' },
  { id: ModuloCodigo.USUARIOS, backendId: 2, nombre: 'Usuarios' },
  { id: ModuloCodigo.TIPOS_PRODUCTO, backendId: 3, nombre: 'Tipos de producto' },
  { id: ModuloCodigo.PROVEEDORES, backendId: 4, nombre: 'Proveedores' },
  { id: ModuloCodigo.TIPOS_DOCUMENTO, backendId: 5, nombre: 'Tipos de documento' },
  { id: ModuloCodigo.DESTINOS, backendId: 6, nombre: 'Destinos' },
  { id: ModuloCodigo.PRODUCTOS, backendId: 7, nombre: 'Productos' },
  { id: ModuloCodigo.UNIDADES_MEDIDA, backendId: 8, nombre: 'Unidades de medida' },
  { id: ModuloCodigo.CATEGORIAS, backendId: 9, nombre: 'Categorías' },
  { id: ModuloCodigo.CENTROS_COSTO, backendId: 10, nombre: 'Centros de costo' },
  { id: ModuloCodigo.BITACORA, backendId: 11, nombre: 'Bitácora' },
  { id: ModuloCodigo.REPORTE_INGRESOS, backendId: 12, nombre: 'Reporte de ingresos' },
  { id: ModuloCodigo.REPORTE_VALES, backendId: 13, nombre: 'Reporte de vales' },
  { id: ModuloCodigo.REPORTE_PRODUCTOS, backendId: 14, nombre: 'Productos más pedidos' },
  { id: ModuloCodigo.CONTACTOS, backendId: 15, nombre: 'Contactos' },
  { id: ModuloCodigo.PARTES_EQUIPO, backendId: 16, nombre: 'Partes de equipo' },
  { id: ModuloCodigo.CONTROL_ALMACEN, backendId: 17, nombre: 'Control de almacén' },
  { id: ModuloCodigo.VALES_CONSUMO, backendId: 18, nombre: 'Vales de consumo' },
  { id: ModuloCodigo.INGRESOS_ALMACEN, backendId: 19, nombre: 'Ingresos de almacén' },
  { id: ModuloCodigo.PERFIL_USUARIO, backendId: 20, nombre: 'Perfil de usuario' },
] as const

interface PaginaRolesBackend {
  datos?: Array<{
    rolId?: number
    nombre?: string
    descripcion?: string
    activo?: boolean
    usuarios?: number
    modulos?: number[]
  }>
}

interface MensajeBackend {
  success?: boolean
  message?: string
}

function codigoModulo(backendId: number): string | undefined {
  return MODULOS_SISTEMA.find(
    (modulo) => modulo.backendId === backendId,
  )?.id
}

function idModulo(codigo: string): number | undefined {
  return MODULOS_SISTEMA.find(
    (modulo) => modulo.id === codigo,
  )?.backendId
}

function convertirRol(
  rol: NonNullable<PaginaRolesBackend['datos']>[number],
): Rol {
  return {
    id: String(rol.rolId ?? ''),
    nombre: rol.nombre ?? '',
    descripcion: rol.descripcion ?? '',
    estado: rol.activo ?? false,
    usuarios: rol.usuarios ?? 0,
    modulos: (rol.modulos ?? [])
      .map(codigoModulo)
      .filter((modulo): modulo is string => Boolean(modulo)),
  }
}

function obtenerIdsModulos(modulos: string[]): number[] {
  return modulos
    .map(idModulo)
    .filter((modulo): modulo is number => modulo !== undefined)
}

export async function obtenerRolesBackend(): Promise<Rol[]> {
  const respuesta = await apiFetch<PaginaRolesBackend>(
    '/api/roles?pagina=1&tamPagina=100',
  )

  return (respuesta.datos ?? []).map(convertirRol)
}

export async function crearRolBackend(
  datos: RolFormData,
): Promise<void> {
  const respuesta = await apiFetch<MensajeBackend>('/api/roles', {
    method: 'POST',
    body: JSON.stringify({
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
      modulos: obtenerIdsModulos(datos.modulos),
    }),
  })

  if (respuesta.success === false) {
    throw new Error(respuesta.message ?? 'No se pudo crear el rol.')
  }
}

export async function actualizarRolBackend(
  id: string,
  datos: RolFormData,
): Promise<void> {
  const respuesta = await apiFetch<MensajeBackend>('/api/roles', {
    method: 'PUT',
    body: JSON.stringify({
      rolId: Number(id),
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
      modulos: obtenerIdsModulos(datos.modulos),
    }),
  })

  if (respuesta.success === false) {
    throw new Error(respuesta.message ?? 'No se pudo actualizar el rol.')
  }

  if (!datos.estado) {
    await eliminarRolBackend(id)
  }
}

export async function eliminarRolBackend(id: string): Promise<void> {
  const respuesta = await apiFetch<MensajeBackend>(
    `/api/roles?rolId=${encodeURIComponent(id)}&activo=false`,
    { method: 'DELETE' },
  )

  if (respuesta.success === false) {
    throw new Error(respuesta.message ?? 'No se pudo desactivar el rol.')
  }
}
