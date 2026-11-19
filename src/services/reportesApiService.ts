import {
  DashboardControllerApi,
  ReporteIngresoControllerApi,
  ReporteProductoMasPedidoControllerApi,
  ReporteValeControllerApi,
  ReportesApi,
} from '../api/generated'
import { apiConfiguration } from '../api/client'
import type { FilaReporteIngreso } from '../types/reporteIngreso'
import type { FilaReporteVale } from '../types/reporteVale'
import type { FilaProductoMasPedido } from '../types/reporteProductoMasPedido'
import type { ResumenDashboard } from './dashboardService'

const reportesApi = new ReportesApi(apiConfiguration)
const dashboardApi = new DashboardControllerApi(apiConfiguration)
const reporteIngresoApi = new ReporteIngresoControllerApi(apiConfiguration)
const reporteValeApi = new ReporteValeControllerApi(apiConfiguration)
const reporteProductoApi = new ReporteProductoMasPedidoControllerApi(apiConfiguration)
const solicitudesReportesEnCurso = new Map<string, Promise<unknown>>()

function ejecutarUnaVez<T>(
  clave: string,
  ejecutar: () => Promise<T>,
): Promise<T> {
  const solicitudExistente = solicitudesReportesEnCurso.get(clave) as
    | Promise<T>
    | undefined

  if (solicitudExistente) return solicitudExistente

  const solicitud = ejecutar().finally(() => {
    solicitudesReportesEnCurso.delete(clave)
  })

  solicitudesReportesEnCurso.set(clave, solicitud)
  return solicitud
}

function idOpcional(valor: string): number | undefined {
  if (!valor) return undefined
  const id = Number(valor.replace(/^[A-Z]+-0*/i, ''))
  return Number.isInteger(id) && id > 0 ? id : undefined
}

function fechaOpcional(valor: string): Date | undefined {
  return valor ? new Date(`${valor}T00:00:00Z`) : undefined
}

function fechaComoTexto(
  valor?: string | Date,
): string {
  if (!valor) return ''

  return valor instanceof Date
    ? valor.toISOString()
    : valor
}

function paginacionTotal(paginacion?: { totalElementos?: number }): number {
  return Number(paginacion?.totalElementos ?? 0)
}

export async function obtenerDashboardApi(): Promise<ResumenDashboard> {
  const response = await dashboardApi.obtener3()
  return {
    productosActivos: Number(response.cards?.productosActivos ?? 0),
    productosStockBajo: Number(response.cards?.stockCritico ?? 0),
    productosSinStock: Number(response.cards?.productosSinStock ?? 0),
    ingresosDelMes: Number(response.cards?.ingresosMes ?? 0),
    valesDelMes: Number(response.cards?.valesMes ?? 0),
    movimientosHoy: Number(response.cards?.movimientosHoy ?? 0),
    alertas: (response.seguimiento ?? []).map((alerta, index) => ({
      id: `alerta-${index + 1}`,
      titulo: alerta.titulo ?? 'Alerta de inventario',
      detalle: alerta.descripcion ?? '',
      tono: alerta.tipo === 'danger' || alerta.tipo === 'warning' ? alerta.tipo : 'info',
    })),
    movimientosRecientes: (response.actividadReciente ?? []).map((movimiento, index) => ({
      id: `actividad-${index + 1}`,
      fecha: fechaComoTexto(movimiento.fecha),
      tipo: movimiento.tipo?.toUpperCase().includes('INGRES') ? 'Ingreso' as const : 'Vale' as const,
      documento: movimiento.documento ?? '',
      producto: movimiento.producto ?? '',
      cantidad: Number(movimiento.cantidad ?? 0),
      responsable: movimiento.responsable ?? '',
    })),
  }
}

export interface ReporteFiltrosApi {
  busqueda?: string
  proveedorId?: string
  centroCostoId?: string
  destinoId?: string
  parteEquipoId?: string
  tipoProductoId?: string
  productoId?: string
  categoriaId?: string
  estado?: string
  fechaDesde?: string
  fechaHasta?: string
  pagina: number
  tamPagina: number
}

export async function listarReporteValesApi(filtros: ReporteFiltrosApi) {
  const parametros = {
    busqueda: filtros.busqueda || undefined,
    centroCostoId: idOpcional(filtros.centroCostoId ?? ''),
    destinoId: idOpcional(filtros.destinoId ?? ''),
    parteEquipoId: idOpcional(filtros.parteEquipoId ?? ''),
    tipoProductoId: idOpcional(filtros.tipoProductoId ?? ''),
    productoId: idOpcional(filtros.productoId ?? ''),
    estado: filtros.estado || undefined,
    fechaDesde: fechaOpcional(filtros.fechaDesde ?? ''),
    fechaHasta: fechaOpcional(filtros.fechaHasta ?? ''),
    pagina: filtros.pagina,
    tamPagina: filtros.tamPagina,
  }
  const response = await ejecutarUnaVez(
    `reporte-vales:${JSON.stringify(parametros)}`,
    () => reporteValeApi.listar1(parametros),
  )

  const datos: FilaReporteVale[] = (response.datos ?? []).map((item, index) => ({
    valeId: String(item.valeConsumoId ?? `VALE-${index + 1}`),
    detalleId: `DET-${item.valeConsumoId ?? index}-${index}`,
    distribucionId: `DIS-${item.valeConsumoId ?? index}-${index}`,
    numeroVale: item.numeroVale ?? '',
    fechaVale:
    fechaComoTexto(item.fechaVale).slice(0, 10),
    estado: item.estado === 'ANULADO' ? 'ANULADO' : 'REGISTRADO',
    centroCostoId: '',
    centroCosto: item.centroCosto ?? '',
    solicitante: item.solicitante ?? '',
    motivo: '',
    tipoProductoId: '',
    tipoProducto: '',
    productoId: 0,
    codigoProducto: item.codigoProducto ?? '',
    producto: item.producto ?? '',
    categoria: '',
    unidadMedida: item.unidadMedida ?? '',
    destinoId: '',
    destino: item.destino ?? '',
    parteEquipoId: '',
    codigoParteEquipo: '',
    parteEquipo: item.parteEquipo ?? 'No aplica',
    cantidad: Number(item.cantidad ?? 0),
    precioUnitario: Number(item.precio ?? 0),
    subtotal: Number(item.subtotal ?? 0),
  }))
  return { datos, totalElementos: paginacionTotal(response.paginacion) }
}

export async function listarReporteIngresosApi(filtros: ReporteFiltrosApi) {
  const parametros = {
    busqueda: filtros.busqueda || undefined,
    proveedorId: idOpcional(filtros.proveedorId ?? ''),
    tipoProductoId: idOpcional(filtros.tipoProductoId ?? ''),
    productoId: idOpcional(filtros.productoId ?? ''),
    estado: filtros.estado || undefined,
    fechaDesde: fechaOpcional(filtros.fechaDesde ?? ''),
    fechaHasta: fechaOpcional(filtros.fechaHasta ?? ''),
    pagina: filtros.pagina,
    tamPagina: filtros.tamPagina,
  }
  const response = await ejecutarUnaVez(
    `reporte-ingresos:${JSON.stringify(parametros)}`,
    () => reporteIngresoApi.listar3(parametros),
  )

  const datos: FilaReporteIngreso[] = (response.datos ?? []).map((item, index) => ({
    ingresoId: String(item.ingresoAlmacenId ?? `ING-${index + 1}`),
    numeroIngreso: item.numeroIngreso ?? '',
    fechaIngreso:
    fechaComoTexto(item.fechaIngreso).slice(0, 10),
    estado: item.estado === 'ANULADO' ? 'ANULADO' : 'REGISTRADO',
    tipoDocumento: '',
    numeroDocumento: item.documento ?? '',
    proveedorId: '',
    proveedor: item.proveedor ?? '',
    contacto: '',
    tipoProductoId: '',
    tipoProducto: item.tipoProducto ?? '',
    productoId: 0,
    codigoProducto: '',
    producto: item.producto ?? '',
    categoria: '',
    unidadMedida: item.unidadMedida ?? '',
    cantidad: Number(item.cantidad ?? 0),
    precioUnitario: Number(item.precioUnitario ?? 0),
    subtotal: Number(item.subtotal ?? 0),
    observacion: '',
  }))
  return { datos, totalElementos: paginacionTotal(response.paginacion) }
}

export async function listarReporteProductosApi(filtros: ReporteFiltrosApi) {
  const parametros = {
    busqueda: filtros.busqueda || undefined,
    tipoProductoId: idOpcional(filtros.tipoProductoId ?? ''),
    categoriaId: idOpcional(filtros.categoriaId ?? ''),
    destinoId: idOpcional(filtros.destinoId ?? ''),
    fechaDesde: fechaOpcional(filtros.fechaDesde ?? ''),
    fechaHasta: fechaOpcional(filtros.fechaHasta ?? ''),
    pagina: filtros.pagina,
    tamPagina: filtros.tamPagina,
  }
  const response = await ejecutarUnaVez(
    `reporte-productos:${JSON.stringify(parametros)}`,
    () => reporteProductoApi.listar2(parametros),
  )
  const datos: FilaProductoMasPedido[] = (response.datos ?? []).map((item, index) => ({
    posicion: Number(item.posicion ?? index + 1),
    productoId: Number(item.productoId ?? 0),
    codigoProducto: item.codigoProducto ?? '',
    producto: item.producto ?? '',
    tipoProductoId: '',
    tipoProducto: item.tipoProducto ?? '',
    categoriaId: '',
    categoria: item.categoria ?? '',
    unidadMedida: item.unidadMedida ?? '',
    cantidadSolicitada: Number(item.cantidad ?? 0),
    numeroVales: Number(item.vales ?? 0),
    numeroDistribuciones: Number(item.distribuciones ?? 0),
    destinosAtendidos: Number(item.destinos ?? 0),
    totalValorizado: Number(item.valorizado ?? 0),
    participacion: Number(item.participacion ?? 0),
  }))
  return { datos, totalElementos: paginacionTotal(response.paginacion) }
}

interface MovimientoKardexApi {
  id?: number
  productoId?: number
  codigoProducto?: string
  nombreProducto?: string
  tipoMovimiento?: string
  fechaMovimiento?: string
  cantidad?: number
  saldoNuevo?: number
  usuarioResponsable?: string
  numeroDocumento?: string
}

interface RespuestaKardexApi {
  success?: boolean
  message?: string
  data?: MovimientoKardexApi[]
}

export interface FiltrosReporteKardexApi {
  productoId?: string
  tipoMovimiento?: string
  fechaDesde?: string
  fechaHasta?: string
}

export interface FilaReporteKardex {
  id: string
  productoId: number
  codigoProducto: string
  producto: string
  fecha: string
  tipo: 'Entrada' | 'Salida'
  ingreso: number
  salida: number
  stock: number
  responsable: string
  numeroDocumento: string
}

export async function listarReporteKardexApi(
  filtros: FiltrosReporteKardexApi,
): Promise<FilaReporteKardex[]> {
  const parametros = {
    productoId: idOpcional(filtros.productoId ?? ''),
    desde: fechaOpcional(filtros.fechaDesde ?? ''),
    hasta: fechaOpcional(filtros.fechaHasta ?? ''),
    tipoMovimiento:
      filtros.tipoMovimiento || undefined,
  }
  const response = await ejecutarUnaVez(
    `reporte-kardex:${JSON.stringify(parametros)}`,
    () => reportesApi.obtener1(parametros),
  ) as RespuestaKardexApi

  if (response.success === false) {
    throw new Error(
      response.message ??
        'No se pudo cargar el reporte Kardex.',
    )
  }

  const movimientos = Array.isArray(response.data)
    ? response.data
    : []

  return movimientos.map((movimiento, indice) => {
    const tipoMovimiento =
      movimiento.tipoMovimiento?.toUpperCase() ?? ''

    const esEntrada =
      tipoMovimiento.includes('ENTRADA')

    const cantidad = Number(
      movimiento.cantidad ?? 0,
    )

    return {
      id: String(
        movimiento.id ??
          `MOV-${indice + 1}`,
      ),
      productoId: Number(
        movimiento.productoId ?? 0,
      ),
      codigoProducto:
        movimiento.codigoProducto ?? '',
      producto:
        movimiento.nombreProducto ??
        'Producto no encontrado',
      fecha:
        movimiento.fechaMovimiento?.slice(0, 10) ??
        '',
      tipo:
        esEntrada
          ? 'Entrada' as const
          : 'Salida' as const,
      ingreso: esEntrada ? cantidad : 0,
      salida: esEntrada ? 0 : cantidad,
      stock: Number(
        movimiento.saldoNuevo ?? 0,
      ),
      responsable:
        movimiento.usuarioResponsable ??
        'Sin responsable',
      numeroDocumento:
        movimiento.numeroDocumento ?? '',
    }
  })
}
