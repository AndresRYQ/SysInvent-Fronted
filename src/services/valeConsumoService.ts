import type {
  DetalleValeConsumo,
  ValeConsumo,
  ValeConsumoFormData,
} from '../types/valeConsumo'
import { toApiError } from './api'
import { obtenerProductos } from './productoService'
import {
  ValeConsumoControllerApi,
  type ValeConsumoRequest,
} from '../api/generated'
import { apiConfiguration } from '../api/client'

interface ApiResponse<T> {
  success: boolean
  message: string
  status: number
  data: T
}

interface ValeDistribucionResponse {
  id?: number | string
  destinoId: number | string
  parteEquipoId: number | string | null
  cantidad: number
}

interface ValeDetalleResponse {
  id?: number | string
  productoId: number
  precioUnitario?: number
  distribuciones: ValeDistribucionResponse[]
}

export interface ValeConsumoResponse {
  id: number | string
  numeroVale: string
  fechaVale: string
  centroCostoId: number | string
  centroCosto: string
  solicitante: string
  motivo: string
  estado: 'REGISTRADO' | 'ANULADO'
  fechaRegistro: string
  cantidadTotal: number
  total: number
  detalles: ValeDetalleResponse[]
  movimientosKardex: unknown[]
}

function mapearVale(response: ValeConsumoResponse): ValeConsumo {
  return {
    id: String(response.id),
    numeroVale: response.numeroVale,
    fechaVale: response.fechaVale,
    centroCostoId: String(response.centroCostoId),
    solicitante: response.solicitante,
    motivo: response.motivo,
    estado: response.estado,
    fechaRegistro: response.fechaRegistro,
    cantidadTotal: response.cantidadTotal,
    total: response.total,
    centroCosto: response.centroCosto,
    movimientosKardex: response.movimientosKardex,
    detalles: response.detalles.map((detalle, detalleIndex) => ({
      id: String(detalle.id ?? `${response.id}-DET-${detalleIndex + 1}`),
      productoId: Number(detalle.productoId),
      precioUnitario:
        detalle.precioUnitario ??
        obtenerProductos().find(
          (producto) => producto.id === Number(detalle.productoId),
        )?.precioUnitario ??
        0,
      distribuciones: detalle.distribuciones.map(
        (distribucion, distribucionIndex) => ({
          id: String(
            distribucion.id ??
              `${response.id}-DET-${detalleIndex + 1}-DIS-${distribucionIndex + 1}`,
          ),
          destinoId: String(distribucion.destinoId),
          parteEquipoId:
            distribucion.parteEquipoId == null
              ? null
              : String(distribucion.parteEquipoId),
          cantidad: Number(distribucion.cantidad),
        }),
      ),
    })),
  }
}

function serializarVale(datos: ValeConsumoFormData): ValeConsumoRequest {
  return {
    fechaVale: new Date(`${datos.fechaVale}T00:00:00Z`),
    centroCostoId: Number(datos.centroCostoId),
    solicitante: datos.solicitante.trim(),
    motivo: datos.motivo.trim(),
    detalles: datos.detalles.map((detalle) => ({
      productoId: Number(detalle.productoId),
      distribuciones: detalle.distribuciones.map((distribucion) => ({
        destinoId: Number(distribucion.destinoId),
        parteEquipoId:
          distribucion.parteEquipoId == null ||
          distribucion.parteEquipoId === ''
            ? undefined
            : Number(distribucion.parteEquipoId),
        cantidad: Number(distribucion.cantidad),
      })),
    })),
  }
}

const valeApi = new ValeConsumoControllerApi(apiConfiguration)

export function calcularCantidadDetalle(
  detalle: DetalleValeConsumo,
): number {
  return Number(
    detalle.distribuciones
      .reduce(
        (total, distribucion) => total + distribucion.cantidad,
        0,
      )
      .toFixed(3),
  )
}

export function calcularTotalVale(vale: ValeConsumo): number {
  return Number(vale.total)
}

export async function listarVales(): Promise<ValeConsumo[]> {
  const response = (await valeApi.listar()) as ApiResponse<
    ValeConsumoResponse[]
  >
  return response.data.map(mapearVale)
}

export async function obtenerValePorId(
  id: string,
): Promise<ValeConsumo> {
  const response = (await valeApi.obtener({ id: Number(id) })) as ApiResponse<
    ValeConsumoResponse
  >
  return mapearVale(response.data)
}

export async function crearVale(
  datos: ValeConsumoFormData,
): Promise<ValeConsumo> {
  const response = (await valeApi.crear({
    valeConsumoRequest: serializarVale(datos),
  })) as ApiResponse<ValeConsumoResponse>
  return mapearVale(response.data)
}

export async function actualizarVale(
  id: string,
  datos: ValeConsumoFormData,
): Promise<ValeConsumo> {
  const response = (await valeApi.actualizar({
    id: Number(id),
    valeConsumoRequest: serializarVale(datos),
  })) as ApiResponse<ValeConsumoResponse>
  return mapearVale(response.data)
}

export async function anularVale(
  id: string,
): Promise<ValeConsumo> {
  const response = (await valeApi.anular({
    id: Number(id),
  })) as ApiResponse<ValeConsumoResponse>
  return mapearVale(response.data)
}

function obtenerMensajeErrorDetalle(error: unknown): string[] {
  const data = toApiError(error).data
  if (!data || typeof data !== 'object') {
    return []
  }

  const record = data as Record<string, unknown>
  const errores = record.errores
  if (!Array.isArray(errores)) {
    return []
  }

  return errores
    .map((item) => {
      if (typeof item === 'string') {
        return item
      }
      if (item && typeof item === 'object') {
        const error = item as Record<string, unknown>
        return String(error.mensaje ?? error.message ?? '')
      }
      return ''
    })
    .filter(Boolean)
}

function obtenerProductosConStockInsuficiente(
  error: unknown,
): string[] {
  const payload = toApiError(error).data
  if (!payload || typeof payload !== 'object') {
    return []
  }

  const data = (payload as Record<string, unknown>).data
  if (!data || typeof data !== 'object') {
    return []
  }

  const productos = (data as Record<string, unknown>).productos
  if (!Array.isArray(productos)) {
    return []
  }

  const catalogo = obtenerProductos()
  return productos.map((item) => {
    if (typeof item === 'string') {
      return item
    }
    if (!item || typeof item !== 'object') {
      return ''
    }

    const producto = item as Record<string, unknown>
    const nombre =
      producto.nombre ??
      producto.producto ??
      producto.nombreProducto ??
      producto.productoNombre ??
      producto.codigoProducto
    if (typeof nombre === 'string' && nombre.trim()) {
      return nombre
    }

    const productoAnidado = producto.producto
    const id = Number(
      producto.productoId ??
        producto.id ??
        (productoAnidado && typeof productoAnidado === 'object'
          ? (productoAnidado as Record<string, unknown>).id
          : undefined),
    )
    return (
      catalogo.find((registro) => registro.id === id)?.nombre ??
      (Number.isFinite(id) ? `Producto ${id}` : '')
    )
  }).filter(Boolean)
}

export function obtenerMensajeErrorVale(error: unknown): string {
  const apiError = toApiError(error)
  const status = apiError?.status
  const message =
    error instanceof Error && error.message
      ? error.message
      : 'Ocurrió un error inesperado.'

  if (status === 400) {
    const errores = obtenerMensajeErrorDetalle(error)
    return errores.length > 0
      ? errores.join(' ')
      : message
  }

  if (status === 404) {
    return message || 'No se encontró el vale solicitado.'
  }

  if (status === 409) {
    const payload = apiError?.data
    const body =
      payload && typeof payload === 'object'
        ? (payload as Record<string, unknown>).data
        : null
    const code =
      body && typeof body === 'object'
        ? (body as Record<string, unknown>).code
        : null

    if (code === 'STOCK_INSUFFICIENT') {
      const productos = obtenerProductosConStockInsuficiente(error)
      return productos.length > 0
        ? `${message} Productos afectados: ${productos.join(', ')}.`
        : message
    }

    return message
  }

  if (status === 500) {
    return /^(500|internal server error)$/i.test(message)
      ? 'Ocurrió un error en el servidor. Inténtalo nuevamente.'
      : message
  }

  return message
}
