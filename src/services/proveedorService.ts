import type { Proveedor, ProveedorFormData } from '../types/proveedor'
import {
  ProveedoresApi,
  type CustomPageProveedorResponse,
  type MessageResponse,
} from '../api/generated'
import { apiConfiguration } from '../api/client'
import type { CatalogoPaginado } from './catalogoApi'

let proveedoresEnMemoria: Proveedor[] = []
const proveedoresApi = new ProveedoresApi(apiConfiguration)
const solicitudesEnCurso = new Map<string, Promise<CatalogoPaginado<Proveedor>>>()

export interface ListarProveedoresParams {
  nombre?: string
  pagina?: number
  tamPagina?: number
}

export function obtenerProveedores(): Proveedor[] {
  return proveedoresEnMemoria.map((proveedor) => ({ ...proveedor }))
}

export function obtenerProveedorPorId(id: number | string): Proveedor | null {
  const numericId = typeof id === 'number' ? id : Number(String(id).replace(/^PROV-/, ''))
  const proveedor = proveedoresEnMemoria.find((item) => item.id === numericId)
  return proveedor ? { ...proveedor } : null
}

function formatearFechaRegistro(fecha?: string | Date): string {
  if (typeof fecha === 'string') return fecha.trim()
  if (!fecha || Number.isNaN(fecha.getTime())) return ''
  return fecha.toISOString().slice(0, 10)
}

function mapearProveedor(proveedor: NonNullable<CustomPageProveedorResponse['datos']>[number]): Proveedor {
  return {
    id: proveedor.proveedorId ?? 0,
    ruc: proveedor.ruc ?? '',
    razonSocial: proveedor.razonSocial ?? '',
    correo: proveedor.correo ?? '',
    telefono: proveedor.telefono ?? '',
    direccion: proveedor.direccion ?? '',
    activo: proveedor.activo ? 1 : 0,
    fechaRegistro: formatearFechaRegistro(proveedor.fechaRegistro),
  }
}

function mapearRespuesta(response: CustomPageProveedorResponse): CatalogoPaginado<Proveedor> {
  const resultado: CatalogoPaginado<Proveedor> = {
    datos: (response.datos ?? []).map(mapearProveedor),
    paginacion: response.paginacion ?? {},
  }
  proveedoresEnMemoria = resultado.datos
  return resultado
}

export async function listarProveedores(
  params: ListarProveedoresParams = {},
): Promise<CatalogoPaginado<Proveedor>> {
  const parametros = {
    nombre: params.nombre?.trim() || undefined,
    pagina: params.pagina,
    tamPagina: params.tamPagina,
  }
  const clave = JSON.stringify(parametros)
  const solicitudExistente = solicitudesEnCurso.get(clave)
  if (solicitudExistente) return solicitudExistente

  const solicitud = proveedoresApi
    .listarProveedores(parametros)
    .then(mapearRespuesta)
    .finally(() => solicitudesEnCurso.delete(clave))
  solicitudesEnCurso.set(clave, solicitud)
  return solicitud
}

export const listarProveedoresApi = listarProveedores

function validar(datos: ProveedorFormData): void {
  if (!/^\d{11}$/.test(datos.ruc.trim())) throw new Error('El RUC debe contener exactamente 11 números.')
  const razonSocial = datos.razonSocial.trim()
  if (razonSocial.length < 2) throw new Error('La razón social debe tener al menos 2 caracteres.')
  if (razonSocial.length > 120) throw new Error('La razón social no puede superar los 120 caracteres.')
  if (datos.correo.trim() && !/^\S+@\S+\.\S+$/.test(datos.correo.trim())) throw new Error('Ingresa un correo electrónico válido.')
  const telefono = datos.telefono.replace(/\D/g, '')
  if (datos.telefono.trim() && (telefono.length < 7 || telefono.length > 15)) throw new Error('Ingresa un teléfono válido.')
  if (datos.direccion.trim().length < 5) throw new Error('La dirección debe tener al menos 5 caracteres.')
  if (datos.direccion.trim().length > 200) throw new Error('La dirección no puede superar los 200 caracteres.')
}

function validarRespuesta(response: MessageResponse): MessageResponse {
  if (response.success === false) throw new Error(response.message ?? 'La operación de proveedores no fue completada.')
  return response
}

function construirRequest(datos: ProveedorFormData) {
  return {
    ruc: datos.ruc.trim(),
    razonSocial: datos.razonSocial.trim(),
    correo: datos.correo.trim().toLowerCase() || undefined,
    telefono: datos.telefono.trim() || undefined,
    direccion: datos.direccion.trim() || undefined,
  }
}

export async function crearProveedor(datos: ProveedorFormData): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await proveedoresApi.registrarProveedor({ proveedorRequest: construirRequest(datos) }))
}

export async function actualizarProveedor(id: number | string, datos: ProveedorFormData): Promise<MessageResponse> {
  validar(datos)
  const numericId = typeof id === 'number' ? id : Number(String(id).replace(/^PROV-/, ''))
  return validarRespuesta(await proveedoresApi.actualizarProveedor({ id: numericId, proveedorRequest: construirRequest(datos) }))
}

export async function cambiarEstadoProveedor(id: number | string, activo: boolean): Promise<MessageResponse> {
  const numericId = typeof id === 'number' ? id : Number(String(id).replace(/^PROV-/, ''))
  return validarRespuesta(await proveedoresApi.cambiarEstadoProveedor({ id: numericId, estadoCatalogoRequest: { activo } }))
}

export function eliminarProveedor(id: number | string): Promise<MessageResponse> {
  return cambiarEstadoProveedor(id, false)
}

export function reactivarProveedor(id: number | string): Promise<MessageResponse> {
  return cambiarEstadoProveedor(id, true)
}
