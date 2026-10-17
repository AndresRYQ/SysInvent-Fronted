import type { UnidadMedida, UnidadMedidaFormData } from '../types/unidadMedida'
import {
  UnidadesDeMedidaApi,
  type CustomPageUnidadMedidaResponse,
  type MessageResponse,
} from '../api/generated'
import { apiConfiguration } from '../api/client'
import type { CatalogoPaginado } from './catalogoApi'

let unidadesEnMemoria: UnidadMedida[] = []
const unidadMedidaApi = new UnidadesDeMedidaApi(apiConfiguration)
const solicitudesEnCurso = new Map<string, Promise<CatalogoPaginado<UnidadMedida>>>()

export interface ListarUnidadesMedidaParams {
  nombre?: string
  pagina?: number
  tamPagina?: number
}

export function obtenerUnidadesMedida(): UnidadMedida[] {
  return unidadesEnMemoria.map((unidad) => ({ ...unidad }))
}

function formatearFechaRegistro(fecha?: string): string | undefined {
  return fecha?.trim() || undefined
}

function mapearRespuestaUnidad(response: CustomPageUnidadMedidaResponse): CatalogoPaginado<UnidadMedida> {
  const resultado: CatalogoPaginado<UnidadMedida> = {
    datos: (response.datos ?? []).map((unidad) => ({
      id: unidad.unidadMedidaId ?? 0,
      nombre: unidad.nombre ?? '',
      descripcion: unidad.descripcion ?? '',
      activo: unidad.activo ? 1 : 0,
      fechaRegistro: formatearFechaRegistro(unidad.fechaRegistro),
    })),
    paginacion: response.paginacion ?? {},
  }

  unidadesEnMemoria = resultado.datos
  return resultado
}

export async function listarUnidadesMedida(
  params: ListarUnidadesMedidaParams = {},
): Promise<CatalogoPaginado<UnidadMedida>> {
  const parametros = {
    nombre: params.nombre?.trim() || undefined,
    pagina: params.pagina,
    tamPagina: params.tamPagina,
  }
  const clave = JSON.stringify(parametros)
  const solicitudExistente = solicitudesEnCurso.get(clave)

  if (solicitudExistente) return solicitudExistente

  const solicitud = unidadMedidaApi
    .listarUnidadesMedida(parametros)
    .then(mapearRespuestaUnidad)
    .finally(() => solicitudesEnCurso.delete(clave))

  solicitudesEnCurso.set(clave, solicitud)
  return solicitud
}

export const listarUnidadesMedidaApi = listarUnidadesMedida

function validar(datos: UnidadMedidaFormData): void {
  const nombre = datos.nombre.trim()
  const descripcion = datos.descripcion.trim()
  if (!nombre) throw new Error('El nombre de la unidad de medida es obligatorio.')
  if (nombre.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.')
  if (nombre.length > 100) throw new Error('El nombre no puede superar los 100 caracteres.')
  if (descripcion.length > 255) throw new Error('La descripción no puede superar los 255 caracteres.')
}

function validarRespuesta(response: MessageResponse): MessageResponse {
  if (response.success === false) {
    throw new Error(response.message ?? 'La operación de unidades de medida no fue completada.')
  }
  return response
}

export async function crearUnidadMedida(datos: UnidadMedidaFormData): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await unidadMedidaApi.registrarUnidadMedida({
    unidadMedidaRequest: {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
    },
  }))
}

export async function actualizarUnidadMedida(
  id: number,
  datos: UnidadMedidaFormData,
): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await unidadMedidaApi.actualizarUnidadMedida({
    id,
    unidadMedidaRequest: {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
    },
  }))
}

export async function cambiarEstadoUnidadMedida(
  id: number,
  activo: boolean,
): Promise<MessageResponse> {
  return validarRespuesta(await unidadMedidaApi.cambiarEstadoUnidadMedida({
    id,
    estadoCatalogoRequest: { activo },
  }))
}

export function eliminarUnidadMedida(id: number): Promise<MessageResponse> {
  return cambiarEstadoUnidadMedida(id, false)
}

export function reactivarUnidadMedida(id: number): Promise<MessageResponse> {
  return cambiarEstadoUnidadMedida(id, true)
}
