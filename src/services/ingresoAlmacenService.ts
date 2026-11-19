import type {
  IngresoAlmacenDetalle,
  IngresoAlmacenFormData,
  IngresoAlmacenListado,
} from '../types/ingresoAlmacen'
import {
  IngresoAlmacenControllerApi,
  type Listar4Request,
  type IngresoAlmacenRequest,
  type MessageResponse,
} from '../api/generated'
import type { DetalleIngresoAlmacenResponse } from '../api/generated/models/DetalleIngresoAlmacenResponse'
import type { IngresoAlmacenResponse } from '../api/generated/models/IngresoAlmacenResponse'
import { apiConfiguration } from '../api/client'

const ingresoAlmacenApi =
  new IngresoAlmacenControllerApi(apiConfiguration)

function convertirIdIngreso(valor: string | number): number {
  const id = Number(String(valor).replace(/^[A-Z]+-0*/i, ''))
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('El identificador del ingreso no es válido.')
  }
  return id
}

function construirRequestIngreso(
  datos: IngresoAlmacenFormData,
): IngresoAlmacenRequest {
  return {
    proveedorId: convertirIdIngreso(datos.proveedorId),
    contactoId: convertirIdIngreso(datos.contactoId),
    tipoDocumentoId: convertirIdIngreso(datos.tipoDocumentoId),
    numeroDocumento: datos.numeroDocumento.trim().toUpperCase(),
    fechaIngreso: datos.fechaIngreso
      ? new Date(`${datos.fechaIngreso}T00:00:00Z`)
      : undefined,
    observacion: datos.observacion.trim() || undefined,
    detalles: datos.detalles.map((detalle) => ({
      productoId: convertirIdIngreso(detalle.productoId),
      cantidad: Number(detalle.cantidad),
      precioUnitario: Number(detalle.precioUnitario),
    })),
  }
}

export async function registrarIngresoAlmacen(
  datos: IngresoAlmacenFormData,
): Promise<MessageResponse> {
  const response = await ingresoAlmacenApi.crear1({
    ingresoAlmacenRequest: construirRequestIngreso(datos),
  }) as MessageResponse

  if (response.success === false) {
    throw new Error(response.message ?? 'No se pudo registrar el ingreso.')
  }

  return response
}

export async function actualizarIngresoAlmacen(
  id: string | number,
  datos: IngresoAlmacenFormData,
): Promise<MessageResponse> {
  const response =
    await ingresoAlmacenApi.actualizar1({
      id: convertirIdIngreso(id),
      ingresoAlmacenRequest:
        construirRequestIngreso(datos),
    }) as MessageResponse

  if (response.success === false) {
    throw new Error(
      response.message ??
        'No se pudo actualizar el ingreso.',
    )
  }

  return response
}

export async function listarIngresosAlmacen(
  parametros: Listar4Request = {},
): Promise<{
  datos: IngresoAlmacenListado[]
  totalElementos: number
}> {
  const response = await ingresoAlmacenApi.listar4(parametros)

  return {
    datos: (response.datos ?? []).map((ingreso) => ({
      id: ingreso.ingresoAlmacenId ?? 0,
      numeroIngreso: ingreso.numeroIngreso ?? '',
      fechaIngreso: ingreso.fechaIngreso ?? '',
      proveedor: ingreso.proveedor ?? '',
      contacto: ingreso.contacto ?? '',
      documento: ingreso.documento ?? '',
      productos: ingreso.productos ?? 0,
      cantidadIngresada: ingreso.cantidadIngresada ?? '0',
      total: Number(ingreso.total ?? 0),
      estado: ingreso.estado === 'ANULADO'
        ? 'ANULADO'
        : 'REGISTRADO',
    })),
    totalElementos: Number(response.paginacion?.totalElementos ?? 0),
  }
}

type RespuestaIngresoDetalle = {
  success?: boolean
  message?: string
  data?: IngresoAlmacenResponse
}

function convertirFechaIngreso(valor: unknown): string {
  if (valor instanceof Date) {
    return valor.toISOString()
  }

  return typeof valor === 'string' ? valor : ''
}

export async function consultarIngresoAlmacenPorId(
  id: string | number,
): Promise<IngresoAlmacenDetalle> {
  const ingresoId = convertirIdIngreso(id)

  const response = await ingresoAlmacenApi.obtener2({
    id: ingresoId,
  }) as RespuestaIngresoDetalle

  if (response.success === false || !response.data) {
    throw new Error(
      response.message ?? 'No se pudo consultar el ingreso.',
    )
  }

  const ingreso = response.data

  return {
    id:
      ingreso.ingresoAlmacenId ??
      ingreso.id ??
      ingresoId,
    numeroIngreso: ingreso.numeroIngreso ?? '',
    fechaIngreso: convertirFechaIngreso(
      ingreso.fechaIngreso,
    ),
    fechaRegistro: convertirFechaIngreso(
      ingreso.fechaRegistro,
    ),
    proveedorId: ingreso.proveedorId ?? 0,
    proveedor: ingreso.proveedor ?? '',
    contactoId: ingreso.contactoId ?? 0,
    contacto: ingreso.contacto ?? '',
    tipoDocumentoId: ingreso.tipoDocumentoId ?? 0,
    tipoDocumento: ingreso.tipoDocumento ?? '',
    numeroDocumento: ingreso.numeroDocumento ?? '',
    observacion: ingreso.observacion ?? '',
    estado:
      ingreso.estado === 'ANULADO'
        ? 'ANULADO'
        : 'REGISTRADO',
    total: Number(ingreso.total ?? 0),
    detalles: (ingreso.detalles ?? []).map(
  (detalle: DetalleIngresoAlmacenResponse) => ({
        id: detalle.detalleIngresoAlmacenId ?? 0,
        productoId: detalle.productoId ?? 0,
        codigoProducto: detalle.codigoProducto ?? '',
        nombreProducto: detalle.nombreProducto ?? '',
        unidadMedida: detalle.unidadMedida ?? '',
        cantidad: Number(detalle.cantidad ?? 0),
        precioUnitario: Number(
          detalle.precioUnitario ?? 0,
        ),
        subtotal: Number(detalle.subtotal ?? 0),
        stockResultante: Number(
          detalle.stockResultante ?? 0,
        ),
      }),
    ),
  }
}
