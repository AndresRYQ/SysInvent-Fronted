import type { TipoDocumento, TipoDocumentoFormData } from '../types/tipoDocumento'
import {
  TiposDeDocumentoApi,
  type CustomPageTipoDocumentoResponse,
  type MessageResponse,
} from '../api/generated'
import { apiConfiguration } from '../api/client'
import type { CatalogoPaginado } from './catalogoApi'

let tiposDocumentoEnMemoria: TipoDocumento[] = []
const tipoDocumentoApi = new TiposDeDocumentoApi(apiConfiguration)
const solicitudesEnCurso = new Map<string, Promise<CatalogoPaginado<TipoDocumento>>>()

export interface ListarTiposDocumentoParams {
  nombre?: string
  pagina?: number
  tamPagina?: number
}

export function obtenerTiposDocumento(): TipoDocumento[] {
  return tiposDocumentoEnMemoria.map((tipo) => ({ ...tipo }))
}

function mapearRespuestaTipoDocumento(response: CustomPageTipoDocumentoResponse): CatalogoPaginado<TipoDocumento> {
  const resultado: CatalogoPaginado<TipoDocumento> = {
    datos: (response.datos ?? []).map((tipo) => ({
      id: tipo.tipoDocumentoId ?? 0,
      nombre: tipo.nombre ?? '',
      descripcion: tipo.descripcion ?? '',
      activo: tipo.activo ? 1 : 0,
      fechaRegistro: tipo.fechaRegistro,
    })),
    paginacion: response.paginacion ?? {},
  }

  tiposDocumentoEnMemoria = resultado.datos
  return resultado
}

export async function listarTiposDocumento(
  params: ListarTiposDocumentoParams = {},
): Promise<CatalogoPaginado<TipoDocumento>> {
  const parametros = {
    nombre: params.nombre?.trim() || undefined,
    pagina: params.pagina,
    tamPagina: params.tamPagina,
  }
  const clave = JSON.stringify(parametros)
  const solicitudExistente = solicitudesEnCurso.get(clave)

  if (solicitudExistente) return solicitudExistente

  const solicitud = tipoDocumentoApi
    .listarTiposDocumento(parametros)
    .then(mapearRespuestaTipoDocumento)
    .finally(() => solicitudesEnCurso.delete(clave))

  solicitudesEnCurso.set(clave, solicitud)
  return solicitud
}

export const listarTiposDocumentoApi = listarTiposDocumento

function validar(datos: TipoDocumentoFormData): void {
  const nombre = datos.nombre.trim()
  const descripcion = datos.descripcion.trim()
  if (!nombre) throw new Error('El nombre del tipo de documento es obligatorio.')
  if (nombre.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.')
  if (nombre.length > 100) throw new Error('El nombre no puede superar los 100 caracteres.')
  if (descripcion.length > 255) throw new Error('La descripción no puede superar los 255 caracteres.')
}

function validarRespuesta(response: MessageResponse): MessageResponse {
  if (response.success === false) {
    throw new Error(response.message ?? 'La operación de tipos de documento no fue completada.')
  }
  return response
}

export async function crearTipoDocumento(datos: TipoDocumentoFormData): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await tipoDocumentoApi.registrarTipoDocumento({
    tipoDocumentoRequest: {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
    },
  }))
}

export async function actualizarTipoDocumento(
  id: number,
  datos: TipoDocumentoFormData,
): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await tipoDocumentoApi.actualizarTipoDocumento({
    id,
    tipoDocumentoRequest: {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
    },
  }))
}

export async function cambiarEstadoTipoDocumento(
  id: number,
  activo: boolean,
): Promise<MessageResponse> {
  return validarRespuesta(await tipoDocumentoApi.cambiarEstadoTipoDocumento({
    id,
    estadoCatalogoRequest: { activo },
  }))
}

export function eliminarTipoDocumento(id: number): Promise<MessageResponse> {
  return cambiarEstadoTipoDocumento(id, false)
}

export function reactivarTipoDocumento(id: number): Promise<MessageResponse> {
  return cambiarEstadoTipoDocumento(id, true)
}
