import type { TipoProducto, TipoProductoFormData } from '../types/tipoProducto'
import {
  TiposDeProductoApi,
  type CustomPageTipoProductoResponse,
  type MessageResponse,
} from '../api/generated'
import { apiConfiguration } from '../api/client'
import type { CatalogoPaginado } from './catalogoApi'

let tiposProductoEnMemoria: TipoProducto[] = []
const tipoProductoApi = new TiposDeProductoApi(apiConfiguration)
const solicitudesEnCurso = new Map<string, Promise<CatalogoPaginado<TipoProducto>>>()

export interface ListarTiposProductoParams {
  nombre?: string
  pagina?: number
  tamPagina?: number
}

export function obtenerTiposProducto(): TipoProducto[] {
  return tiposProductoEnMemoria.map((tipo) => ({ ...tipo }))
}

function mapearRespuestaTipoProducto(response: CustomPageTipoProductoResponse): CatalogoPaginado<TipoProducto> {
  const resultado: CatalogoPaginado<TipoProducto> = {
    datos: (response.datos ?? []).map((tipo) => ({
      id: tipo.tipoProductoId ?? 0,
      nombre: tipo.nombre ?? '',
      descripcion: tipo.descripcion ?? '',
      activo: tipo.activo ? 1 : 0,
      fechaRegistro: tipo.fechaRegistro,
    })),
    paginacion: response.paginacion ?? {},
  }

  tiposProductoEnMemoria = resultado.datos
  return resultado
}

export async function listarTiposProducto(
  params: ListarTiposProductoParams = {},
): Promise<CatalogoPaginado<TipoProducto>> {
  const parametros = {
    nombre: params.nombre?.trim() || undefined,
    pagina: params.pagina,
    tamPagina: params.tamPagina,
  }
  const clave = JSON.stringify(parametros)
  const solicitudExistente = solicitudesEnCurso.get(clave)

  if (solicitudExistente) return solicitudExistente

  const solicitud = tipoProductoApi
    .listarTiposProducto(parametros)
    .then(mapearRespuestaTipoProducto)
    .finally(() => solicitudesEnCurso.delete(clave))

  solicitudesEnCurso.set(clave, solicitud)
  return solicitud
}

export const listarTiposProductoApi = listarTiposProducto

function validar(datos: TipoProductoFormData): void {
  const nombre = datos.nombre.trim()
  const descripcion = datos.descripcion.trim()
  if (!nombre) throw new Error('El nombre del tipo de producto es obligatorio.')
  if (nombre.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.')
  if (nombre.length > 100) throw new Error('El nombre no puede superar los 100 caracteres.')
  if (descripcion.length > 255) throw new Error('La descripción no puede superar los 255 caracteres.')
}

function validarRespuesta(response: MessageResponse): MessageResponse {
  if (response.success === false) {
    throw new Error(response.message ?? 'La operación de tipos de producto no fue completada.')
  }
  return response
}

export async function crearTipoProducto(datos: TipoProductoFormData): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await tipoProductoApi.registrarTipoProducto({
    tipoProductoRequest: {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
    },
  }))
}

export async function actualizarTipoProducto(
  id: number,
  datos: TipoProductoFormData,
): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await tipoProductoApi.actualizarTipoProducto({
    id,
    tipoProductoRequest: {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
    },
  }))
}

export async function cambiarEstadoTipoProducto(
  id: number,
  activo: boolean,
): Promise<MessageResponse> {
  return validarRespuesta(await tipoProductoApi.cambiarEstadoTipoProducto({
    id,
    estadoCatalogoRequest: { activo },
  }))
}

export function eliminarTipoProducto(id: number): Promise<MessageResponse> {
  return cambiarEstadoTipoProducto(id, false)
}

export function reactivarTipoProducto(id: number): Promise<MessageResponse> {
  return cambiarEstadoTipoProducto(id, true)
}
