import type { ParteEquipo, ParteEquipoFormData } from '../types/parteEquipo'
import {
  PartesDeEquipoApi,
  type CustomPageParteEquipoResponse,
  type MessageResponse,
} from '../api/generated'
import { apiConfiguration } from '../api/client'
import type { CatalogoPaginado } from './catalogoApi'

let partesEnMemoria: ParteEquipo[] = []
const parteEquipoApi = new PartesDeEquipoApi(apiConfiguration)
const solicitudesEnCurso = new Map<string, Promise<CatalogoPaginado<ParteEquipo>>>()

export interface ListarPartesEquipoParams {
  nombre?: string
  pagina?: number
  tamPagina?: number
}

export function obtenerPartesEquipo(): ParteEquipo[] {
  return partesEnMemoria.map((parte) => ({ ...parte }))
}

function mapearRespuestaParte(response: CustomPageParteEquipoResponse): CatalogoPaginado<ParteEquipo> {
  const resultado: CatalogoPaginado<ParteEquipo> = {
    datos: (response.datos ?? []).map((parte) => ({
      id: parte.parteEquipoId ?? 0,
      codigo: parte.codigo ?? '',
      nombre: parte.nombre ?? '',
      descripcion: parte.descripcion ?? '',
      estado: parte.activo ?? false,
      fechaRegistro: parte.fechaRegistro ?? '',
    })),
    paginacion: response.paginacion ?? {},
  }

  partesEnMemoria = resultado.datos
  return resultado
}

export async function listarPartesEquipo(
  params: ListarPartesEquipoParams = {},
): Promise<CatalogoPaginado<ParteEquipo>> {
  const parametros = {
    nombre: params.nombre?.trim() || undefined,
    pagina: params.pagina,
    tamPagina: params.tamPagina,
  }
  const clave = JSON.stringify(parametros)
  const solicitudExistente = solicitudesEnCurso.get(clave)

  if (solicitudExistente) return solicitudExistente

  const solicitud = parteEquipoApi
    .listarPartesEquipo(parametros)
    .then(mapearRespuestaParte)
    .finally(() => solicitudesEnCurso.delete(clave))

  solicitudesEnCurso.set(clave, solicitud)
  return solicitud
}

export const listarPartesEquipoApi = listarPartesEquipo

export function obtenerParteEquipoPorId(id: number): ParteEquipo | null {
  const parte = partesEnMemoria.find((item) => item.id === id)
  return parte ? { ...parte } : null
}

function validar(datos: ParteEquipoFormData): void {
  const codigo = datos.codigo.trim().toUpperCase()
  const nombre = datos.nombre.trim()
  const descripcion = datos.descripcion.trim()
  if (!/^[A-Z0-9-]{3,50}$/.test(codigo)) throw new Error('El código debe tener entre 3 y 50 caracteres y solo puede contener letras, números y guiones.')
  if (!nombre) throw new Error('El nombre de la parte de equipo es obligatorio.')
  if (nombre.length > 150) throw new Error('El nombre no puede superar los 150 caracteres.')
  if (descripcion.length > 255) throw new Error('La descripción no puede superar los 255 caracteres.')
}

function validarRespuesta(response: MessageResponse): MessageResponse {
  if (response.success === false) {
    throw new Error(response.message ?? 'La operación de partes de equipo no fue completada.')
  }
  return response
}

export async function crearParteEquipo(datos: ParteEquipoFormData): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await parteEquipoApi.registrarParteEquipo({
    parteEquipoRequest: {
      codigo: datos.codigo.trim().toUpperCase(),
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
    },
  }))
}

export async function actualizarParteEquipo(id: number, datos: ParteEquipoFormData): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await parteEquipoApi.actualizarParteEquipo({
    id,
    parteEquipoRequest: {
      codigo: datos.codigo.trim().toUpperCase(),
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
    },
  }))
}

export async function cambiarEstadoParteEquipo(id: number, activo: boolean): Promise<MessageResponse> {
  return validarRespuesta(await parteEquipoApi.cambiarEstadoParteEquipo({
    id,
    estadoCatalogoRequest: { activo },
  }))
}

export function eliminarParteEquipo(id: number): Promise<MessageResponse> {
  return cambiarEstadoParteEquipo(id, false)
}

export function reactivarParteEquipo(id: number): Promise<MessageResponse> {
  return cambiarEstadoParteEquipo(id, true)
}
