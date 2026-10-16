import {
  CentroCostoControllerApi,
  DestinoControllerApi,
  ParteEquipoControllerApi,
  ProveedorControllerApi,
  TipoDocumentoControllerApi,
  TipoProductoControllerApi,
  UnidadMedidaControllerApi,
} from '../api/generated'
import { apiConfiguration } from '../api/client'
import { apiFetch } from './api'

export interface CatalogoPaginado<T> {
  datos: T[]
  paginacion: Record<string, unknown>
}

type RegistroApi = Record<string, unknown>

const catalogoApis = {
  '/api/v1/catalogos/centros-costo': () =>
    new CentroCostoControllerApi(apiConfiguration).listar8(),
  '/api/v1/catalogos/destinos': () =>
    new DestinoControllerApi(apiConfiguration).listar6(),
  '/api/v1/catalogos/partes-equipo': () =>
    new ParteEquipoControllerApi(apiConfiguration).listar5(),
  '/api/v1/catalogos/proveedores': () =>
    new ProveedorControllerApi(apiConfiguration).listar4(),
  '/api/v1/catalogos/tipos-documento': () =>
    new TipoDocumentoControllerApi(apiConfiguration).listar3(),
  '/api/v1/catalogos/tipos-producto': () =>
    new TipoProductoControllerApi(apiConfiguration).listar2(),
  '/api/v1/catalogos/unidades-medida': () =>
    new UnidadMedidaControllerApi(apiConfiguration).listar1(),
} as const

export async function listarCatalogo<T>(
  endpoint: string,
  mapear: (registro: RegistroApi) => T,
): Promise<CatalogoPaginado<T>> {
  const diagnostico = import.meta.env.DEV
    ? (response: {
        status: number
        statusText: string
        headers: Record<string, string>
        body: unknown
      }) => {
        console.debug(`[Catálogo ${endpoint}] respuesta HTTP completa`, response)
      }
    : undefined

  const listar = Object.prototype.hasOwnProperty.call(catalogoApis, endpoint)
    ? catalogoApis[endpoint as keyof typeof catalogoApis]
    : undefined

  const response = listar
    ? ((await listar()) as {
        datos?: unknown
        paginacion?: unknown
      })
    : await apiFetch<{
        datos?: unknown
        paginacion?: unknown
      }>(endpoint, {}, diagnostico)

  if (listar) {
    diagnostico?.({
      status: 200,
      statusText: 'OK',
      headers: {},
      body: response,
    })
  }

  if (!Array.isArray(response.datos)) {
    throw new Error(
      `La respuesta del catálogo ${endpoint} no contiene una lista válida en "datos".`,
    )
  }

  if (
    !response.paginacion ||
    typeof response.paginacion !== 'object' ||
    Array.isArray(response.paginacion)
  ) {
    throw new Error(
      `La respuesta del catálogo ${endpoint} no contiene metadatos válidos en "paginacion".`,
    )
  }

  if (import.meta.env.DEV) {
    console.debug(`[Catálogo ${endpoint}] datos recibidos`, response.datos)
    console.debug(
      `[Catálogo ${endpoint}] paginación recibida`,
      response.paginacion,
    )
  }

  const datos = response.datos.map((registro) => {
      if (
        !registro ||
        typeof registro !== 'object' ||
        Array.isArray(registro)
      ) {
        throw new Error(
          `La respuesta del catálogo ${endpoint} contiene un registro inválido.`,
        )
      }

      return mapear(registro as RegistroApi)
    })

  if (import.meta.env.DEV) {
    console.debug(`[Catálogo ${endpoint}] datos después del mapeo`, datos)
  }

  return {
    datos,
    paginacion: response.paginacion as Record<string, unknown>,
  }
}

export function obtenerIdCatalogo(
  registro: RegistroApi,
  ...campos: string[]
): number {
  const valor = campos
    .map((campo) => registro[campo])
    .find((campo) => campo !== undefined && campo !== null)
  const id = Number(valor)

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('El registro del catálogo no contiene un identificador válido.')
  }

  return id
}

export function obtenerEstadoActivo(
  registro: RegistroApi,
  predeterminado = true,
): boolean {
  const estado = registro.activo ?? registro.estado

  if (estado === undefined || estado === null) {
    return predeterminado
  }

  if (typeof estado === 'string') {
    return ['1', 'true', 'activo', 'active'].includes(
      estado.trim().toLowerCase(),
    )
  }

  return estado === true || estado === 1
}
