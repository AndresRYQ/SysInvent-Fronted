import type { Destino, DestinoFormData } from '../types/destino'
import {
  DestinosApi,
  type CustomPageDestinoResponse,
  type MessageResponse,
} from '../api/generated'
import { apiConfiguration } from '../api/client'
import type { CatalogoPaginado } from './catalogoApi'

let destinosEnMemoria: Destino[] = []
const destinoApi = new DestinosApi(apiConfiguration)
const solicitudesEnCurso = new Map<string, Promise<CatalogoPaginado<Destino>>>()

export interface ListarDestinosParams {
  nombre?: string
  estado?: string
  pagina?: number
  tamPagina?: number
}

export function obtenerDestinos(): Destino[] {
  return destinosEnMemoria.map((destino) => ({ ...destino }))
}

function mapearRespuestaDestino(response: CustomPageDestinoResponse): CatalogoPaginado<Destino> {
  const resultado: CatalogoPaginado<Destino> = {
    datos: (response.datos ?? []).map((destino) => ({
      id: destino.destinoId ?? 0,
      nombre: destino.nombre ?? '',
      descripcion: destino.descripcion ?? '',
      activo: destino.activo ? 1 : 0,
      fechaRegistro: destino.fechaRegistro?.toISOString().slice(0, 10),
    })),
    paginacion: response.paginacion ?? {},
  }

  destinosEnMemoria = resultado.datos
  return resultado
}

export async function listarDestinos(
  params: ListarDestinosParams = {},
): Promise<CatalogoPaginado<Destino>> {
  const parametros = {
    nombre: params.nombre?.trim() || undefined,
    estado: params.estado === 'activo'
      ? true
      : params.estado === 'inactivo'
        ? false
        : undefined,
    pagina: params.pagina,
    tamPagina: params.tamPagina,
  }
  const clave = JSON.stringify(parametros)
  const solicitudExistente = solicitudesEnCurso.get(clave)

  if (solicitudExistente) return solicitudExistente

  const solicitud = destinoApi
    .listarDestinos(parametros)
    .then(mapearRespuestaDestino)
    .finally(() => solicitudesEnCurso.delete(clave))

  solicitudesEnCurso.set(clave, solicitud)
  return solicitud
}

export const listarDestinosApi = listarDestinos

function validar(datos: DestinoFormData): void {
  const nombre = datos.nombre.trim()
  const descripcion = datos.descripcion.trim()
  if (!nombre) throw new Error('El nombre del destino es obligatorio.')
  if (nombre.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.')
  if (nombre.length > 100) throw new Error('El nombre no puede superar los 100 caracteres.')
  if (!descripcion) throw new Error('La descripción es obligatoria.')
  if (descripcion.length > 250) throw new Error('La descripción no puede superar los 250 caracteres.')
}

function validarRespuesta(response: MessageResponse): MessageResponse {
  if (response.success === false) {
    throw new Error(response.message ?? 'La operación de destinos no fue completada.')
  }
  return response
}

export async function crearDestino(datos: DestinoFormData): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await destinoApi.registrarDestino({
    destinoRequest: {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
    },
  }))
}

export async function actualizarDestino(
  id: number,
  datos: DestinoFormData,
): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await destinoApi.actualizarDestino({
    id,
    destinoRequest: {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
    },
  }))
}

export async function cambiarEstadoDestino(
  id: number,
  activo: boolean,
): Promise<MessageResponse> {
  return validarRespuesta(await destinoApi.cambiarEstadoDestino({
    id,
    estadoCatalogoRequest: { activo },
  }))
}

export function eliminarDestino(id: number): Promise<MessageResponse> {
  return cambiarEstadoDestino(id, false)
}

export function reactivarDestino(id: number): Promise<MessageResponse> {
  return cambiarEstadoDestino(id, true)
}
