import type {
  ControlAlmacenProducto,
  MovimientoAlmacen,
} from '../types/kardex'
import {
  ControlAlmacenControllerApi,
  type ControlAlmacenListadoResponse,
} from '../api/generated'
import { apiConfiguration } from '../api/client'

const controlAlmacenApi = new ControlAlmacenControllerApi(apiConfiguration)
type ResultadoControlAlmacen = {
  datos: ControlAlmacenProducto[]
  totalElementos: number
}
const solicitudesControlEnCurso = new Map<string, Promise<ResultadoControlAlmacen>>()
type ResultadoDetalleControl = {
  movimientos: MovimientoAlmacen[]
  totalElementos: number
}
const solicitudesDetalleEnCurso = new Map<string, Promise<ResultadoDetalleControl>>()

export interface ListarControlAlmacenParams {
  busqueda?: string
  tipoProductoId?: number
  categoriaId?: number
  estado?: string
  fechaDesde?: Date
  fechaHasta?: Date
  pagina?: number
  tamPagina?: number
}

function mapearControlListado(
  producto: ControlAlmacenListadoResponse,
): ControlAlmacenProducto {
  return {
    productoId: producto.productoId ?? 0,
    codigo: producto.codigo ?? '',
    nombre: producto.producto ?? '',
    tipoProductoId: 0,
    categoriaId: 0,
    unidadMedidaId: 0,
    proveedorId: 0,
    totalEntradas: Number(producto.entradas ?? 0),
    totalSalidas: Number(producto.salidas ?? 0),
    stockDisponible: Number(producto.stock ?? 0),
    estadoStock: producto.estado === 'CON_STOCK' ? 'CON_STOCK' : 'SIN_STOCK',
    movimientos: [],
    tipoProductoNombre: producto.tipo,
    categoriaNombre: producto.categoria,
    unidadMedidaNombre: producto.unidadMedida,
    proveedorNombre: producto.proveedor,
  }
}

export async function listarControlAlmacen(
  params: ListarControlAlmacenParams = {},
): Promise<ResultadoControlAlmacen> {
  const clave = JSON.stringify(params)
  const solicitudExistente = solicitudesControlEnCurso.get(clave)

  if (solicitudExistente) return solicitudExistente

  const solicitud = controlAlmacenApi
    .listar6(params)
    .then((respuesta) => ({
      datos: (respuesta.datos ?? []).map(mapearControlListado),
      totalElementos: respuesta.paginacion?.totalElementos ?? 0,
    }))
    .finally(() => solicitudesControlEnCurso.delete(clave))

  solicitudesControlEnCurso.set(clave, solicitud)
  return solicitud
}

export async function listarDetalleControlAlmacen(
  productoId: number,
  pagina = 1,
  tamPagina = 10,
): Promise<ResultadoDetalleControl> {
  const clave = JSON.stringify({ productoId, pagina, tamPagina })
  const solicitudExistente = solicitudesDetalleEnCurso.get(clave)
  if (solicitudExistente) return solicitudExistente

  const solicitud = controlAlmacenApi.detalle({
    productoId,
    pagina,
    tamPagina,
  }).then((respuesta) => {
    const movimientos = (respuesta.datos ?? []).map((movimiento, indice) => ({
      id: `MOV-${productoId}-${indice}`,
      tipo: movimiento.movimiento?.toUpperCase().includes('SAL') ? 'SALIDA' as const : 'ENTRADA' as const,
      origen: movimiento.movimiento?.toUpperCase().includes('SAL') ? 'VALE' as const : 'INGRESO' as const,
      documentoId: movimiento.documento ?? '',
      numeroDocumento: movimiento.documento ?? '',
      fecha: movimiento.fecha?.toISOString().slice(0, 10) ?? '',
      productoId,
      cantidad: Number(movimiento.cantidad ?? 0),
      precioUnitario: 0,
      destinoId: movimiento.destino ?? null,
      parteEquipoId: movimiento.parteEquipo ?? null,
      centroCostoId: movimiento.centroCosto ?? null,
      responsable: movimiento.responsable ?? '',
      estadoDocumento: movimiento.estado === 'ANULADO' ? 'ANULADO' as const : 'REGISTRADO' as const,
      afectaStock: movimiento.estado !== 'ANULADO',
    }))

    return {
      movimientos,
      totalElementos: respuesta.paginacion?.totalElementos ?? movimientos.length,
    }
  }).finally(() => solicitudesDetalleEnCurso.delete(clave))

  solicitudesDetalleEnCurso.set(clave, solicitud)
  return solicitud
}
