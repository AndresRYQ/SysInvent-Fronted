import type { Categoria, CategoriaFormData } from '../types/categoria'
import {
  CategorasApi,
  type CustomPageCategoriaCatalogoResponse,
  type MessageResponse,
} from '../api/generated'
import { apiConfiguration } from '../api/client'
import type { CatalogoPaginado } from './catalogoApi'

let categoriasEnMemoria: Categoria[] = []
const categoriaApi = new CategorasApi(apiConfiguration)
const solicitudesEnCurso = new Map<string, Promise<CatalogoPaginado<Categoria>>>()

export interface ListarCategoriasParams {
  nombre?: string
  pagina?: number
  tamPagina?: number
}

export function obtenerCategorias(): Categoria[] {
  return categoriasEnMemoria.map((categoria) => ({ ...categoria }))
}

function formatearFechaRegistro(fecha?: string | Date): string | undefined {
  if (typeof fecha === 'string') return fecha.trim() || undefined
  if (!fecha || Number.isNaN(fecha.getTime())) return undefined
  return fecha.toISOString().slice(0, 10)
}

function mapearRespuestaCategoria(response: CustomPageCategoriaCatalogoResponse): CatalogoPaginado<Categoria> {
  const resultado: CatalogoPaginado<Categoria> = {
    datos: (response.datos ?? []).map((categoria) => ({
      id: categoria.id ?? 0,
      nombre: categoria.nombre ?? '',
      descripcion: categoria.descripcion ?? '',
      activo: categoria.activo ? 1 : 0,
      fechaRegistro: formatearFechaRegistro(categoria.fechaRegistro),
    })),
    paginacion: response.paginacion ?? {},
  }

  categoriasEnMemoria = resultado.datos
  return resultado
}

export async function listarCategorias(
  params: ListarCategoriasParams = {},
): Promise<CatalogoPaginado<Categoria>> {
  const parametros = {
    nombre: params.nombre?.trim() || undefined,
    pagina: params.pagina,
    tamPagina: params.tamPagina,
  }
  const clave = JSON.stringify(parametros)
  const solicitudExistente = solicitudesEnCurso.get(clave)

  if (solicitudExistente) return solicitudExistente

  const solicitud = categoriaApi
    .listarCategoriasCatalogo(parametros)
    .then(mapearRespuestaCategoria)
    .finally(() => solicitudesEnCurso.delete(clave))

  solicitudesEnCurso.set(clave, solicitud)
  return solicitud
}

export const listarCategoriasApi = listarCategorias

function validar(datos: CategoriaFormData): void {
  const nombre = datos.nombre.trim()
  const descripcion = datos.descripcion.trim()
  if (!nombre) throw new Error('El nombre de la categoría es obligatorio.')
  if (nombre.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.')
  if (nombre.length > 100) throw new Error('El nombre no puede superar los 100 caracteres.')
  if (descripcion.length > 255) throw new Error('La descripción no puede superar los 255 caracteres.')
}

function validarRespuesta(response: MessageResponse): MessageResponse {
  if (response.success === false) {
    throw new Error(response.message ?? 'La operación de categorías no fue completada.')
  }
  return response
}

export async function crearCategoria(datos: CategoriaFormData): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await categoriaApi.registrarCategoria({
    categoriaCatalogoRequest: {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
    },
  }))
}

export async function actualizarCategoria(
  id: number,
  datos: CategoriaFormData,
): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await categoriaApi.actualizarCategoria({
    id,
    categoriaCatalogoRequest: {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
    },
  }))
}

export async function cambiarEstadoCategoria(
  id: number,
  activo: boolean,
): Promise<MessageResponse> {
  return validarRespuesta(await categoriaApi.cambiarEstadoCategoria({
    id,
    estadoCatalogoRequest: { activo },
  }))
}

export function eliminarCategoria(id: number): Promise<MessageResponse> {
  return cambiarEstadoCategoria(id, false)
}

export function reactivarCategoria(id: number): Promise<MessageResponse> {
  return cambiarEstadoCategoria(id, true)
}
