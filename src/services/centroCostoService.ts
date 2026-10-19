import type { CentroCosto, CentroCostoFormData } from '../types/centroCosto'
import {
  CentrosDeCostoApi,
  type CustomPageCentroCostoResponse,
  type MessageResponse,
} from '../api/generated'
import { apiConfiguration } from '../api/client'
import type { CatalogoPaginado } from './catalogoApi'

let centrosEnMemoria: CentroCosto[] = []
const centroCostoApi = new CentrosDeCostoApi(apiConfiguration)
const solicitudesEnCurso = new Map<string, Promise<CatalogoPaginado<CentroCosto>>>()

export interface ListarCentrosCostoParams {
  nombre?: string
  pagina?: number
  tamPagina?: number
}

export function obtenerCentrosCosto(): CentroCosto[] {
  return centrosEnMemoria.map((centro) => ({ ...centro }))
}

function mapearRespuestaCentro(response: CustomPageCentroCostoResponse): CatalogoPaginado<CentroCosto> {
  const resultado: CatalogoPaginado<CentroCosto> = {
    datos: (response.datos ?? []).map((centro) => ({
      id: centro.centroCostoId ?? 0,
      nombre: centro.nombre ?? '',
      descripcion: centro.descripcion ?? '',
      activo: centro.activo ? 1 : 0,
      fechaRegistro: centro.fechaRegistro,
    })),
    paginacion: response.paginacion ?? {},
  }

  centrosEnMemoria = resultado.datos
  return resultado
}

export async function listarCentrosCosto(
  params: ListarCentrosCostoParams = {},
): Promise<CatalogoPaginado<CentroCosto>> {
  const parametros = {
    nombre: params.nombre?.trim() || undefined,
    pagina: params.pagina,
    tamPagina: params.tamPagina,
  }
  const clave = JSON.stringify(parametros)
  const solicitudExistente = solicitudesEnCurso.get(clave)

  if (solicitudExistente) return solicitudExistente

  const solicitud = centroCostoApi
    .listarCentrosCosto(parametros)
    .then(mapearRespuestaCentro)
    .finally(() => solicitudesEnCurso.delete(clave))

  solicitudesEnCurso.set(clave, solicitud)
  return solicitud
}

export const listarCentrosCostoApi = listarCentrosCosto

function validar(datos: CentroCostoFormData): void {
  const nombre = datos.nombre.trim()
  const descripcion = datos.descripcion.trim()
  if (!nombre) throw new Error('El nombre del centro de costo es obligatorio.')
  if (nombre.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.')
  if (nombre.length > 150) throw new Error('El nombre no puede superar los 150 caracteres.')
  if (descripcion.length > 255) throw new Error('La descripción no puede superar los 255 caracteres.')
}

function validarRespuesta(response: MessageResponse): MessageResponse {
  if (response.success === false) {
    throw new Error(response.message ?? 'La operación de centros de costo no fue completada.')
  }
  return response
}

export async function crearCentroCosto(datos: CentroCostoFormData): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await centroCostoApi.registrarCentroCosto({
    centroCostoRequest: {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
    },
  }))
}

export async function actualizarCentroCosto(
  id: number,
  datos: CentroCostoFormData,
): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await centroCostoApi.actualizarCentroCosto({
    id,
    centroCostoRequest: {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
    },
  }))
}

export async function cambiarEstadoCentroCosto(
  id: number,
  activo: boolean,
): Promise<MessageResponse> {
  return validarRespuesta(await centroCostoApi.cambiarEstadoCentroCosto({
    id,
    estadoCatalogoRequest: { activo },
  }))
}

export function eliminarCentroCosto(id: number): Promise<MessageResponse> {
  return cambiarEstadoCentroCosto(id, false)
}

export function reactivarCentroCosto(id: number): Promise<MessageResponse> {
  return cambiarEstadoCentroCosto(id, true)
}
