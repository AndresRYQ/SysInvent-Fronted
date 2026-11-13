import {
  DashboardControllerApi,
  ReporteIngresoControllerApi,
  ReporteProductoMasPedidoControllerApi,
  ReporteValeControllerApi,
} from '../api/generated'
import { AUTH_TOKEN_KEY, apiConfiguration } from '../api/client'
import { apiFetch } from './api'
import type { FilaReporteIngreso } from '../types/reporteIngreso'
import type { FilaReporteVale } from '../types/reporteVale'
import type { FilaProductoMasPedido } from '../types/reporteProductoMasPedido'
import type { ResumenDashboard } from './dashboardService'

const dashboardApi = new DashboardControllerApi(apiConfiguration)
const reporteIngresoApi = new ReporteIngresoControllerApi(apiConfiguration)
const reporteValeApi = new ReporteValeControllerApi(apiConfiguration)
const reporteProductoApi = new ReporteProductoMasPedidoControllerApi(apiConfiguration)

function idOpcional(valor: string): number | undefined {
  if (!valor) return undefined
  const id = Number(valor.replace(/^[A-Z]+-0*/i, ''))
  return Number.isInteger(id) && id > 0 ? id : undefined
}

function fechaOpcional(valor: string): Date | undefined {
  return valor ? new Date(`${valor}T00:00:00Z`) : undefined
}

function paginacionTotal(paginacion?: { totalElementos?: number }): number {
  return Number(paginacion?.totalElementos ?? 0)
}

type TonoAlerta = 'warning' | 'danger' | 'info'

function tonoAlerta(tipo?: string): TonoAlerta {
  const valor = (tipo ?? '').toLowerCase()
  return valor === 'danger' || valor === 'warning' ? valor : 'info'
}

interface CardsDashboardApi {
  productosActivos?: number
  stockCritico?: number
  stockBajo?: number
  productosSinStock?: number
  ingresosMes?: number
  valesMes?: number
  movimientosHoy?: number
}

interface ActividadDashboardApi {
  fecha?: string
  hora?: string
  tipo?: string
  tipoMovimiento?: string
  movimiento?: string
  documento?: string
  producto?: string
  cantidad?: number
  responsable?: string
}

export async function obtenerDashboardApi(): Promise<ResumenDashboard> {
  const response = await dashboardApi.obtener3()
  // El cliente generado aún no incluye los campos nuevos del backend
  // (stockBajo, productosSinStock, hora, movimiento); se leen de forma tipada.
  const cards = (response.cards ?? {}) as CardsDashboardApi
  const actividades = (response.actividadReciente ?? []) as ActividadDashboardApi[]
  const productosSinStock = Number(cards.productosSinStock ?? 0)
  const stockCritico = Number(cards.stockCritico ?? 0)

  return {
    productosActivos: Number(cards.productosActivos ?? 0),
    productosStockBajo: Number(cards.stockBajo ?? Math.max(stockCritico - productosSinStock, 0)),
    productosSinStock,
    ingresosDelMes: Number(cards.ingresosMes ?? 0),
    valesDelMes: Number(cards.valesMes ?? 0),
    movimientosHoy: Number(cards.movimientosHoy ?? 0),
    alertas: (response.seguimiento ?? []).map((alerta, index) => ({
      id: `alerta-${index + 1}`,
      titulo: alerta.titulo ?? 'Alerta de inventario',
      detalle: alerta.descripcion ?? '',
      tono: tonoAlerta(alerta.tipo),
    })),
    movimientosRecientes: actividades.map((movimiento, index) => ({
      id: `actividad-${index + 1}`,
      fecha: movimiento.fecha ?? '',
      hora: movimiento.hora ?? '',
      tipo: movimiento.tipo?.toUpperCase().includes('INGRES') ? 'Ingreso' as const : 'Vale' as const,
      descripcion: movimiento.movimiento ?? movimiento.tipo ?? '',
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
  const response = await reporteValeApi.listar1({
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
  })
  const datos: FilaReporteVale[] = (response.datos ?? []).map((item, index) => ({
    valeId: String(item.valeConsumoId ?? `VALE-${index + 1}`),
    detalleId: `DET-${item.valeConsumoId ?? index}-${index}`,
    distribucionId: `DIS-${item.valeConsumoId ?? index}-${index}`,
    numeroVale: item.numeroVale ?? '',
    fechaVale: item.fechaVale ?? '',
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
  const response = await reporteIngresoApi.listar3({
    busqueda: filtros.busqueda || undefined,
    proveedorId: idOpcional(filtros.proveedorId ?? ''),
    tipoProductoId: idOpcional(filtros.tipoProductoId ?? ''),
    productoId: idOpcional(filtros.productoId ?? ''),
    estado: filtros.estado || undefined,
    fechaDesde: fechaOpcional(filtros.fechaDesde ?? ''),
    fechaHasta: fechaOpcional(filtros.fechaHasta ?? ''),
    pagina: filtros.pagina,
    tamPagina: filtros.tamPagina,
  })
  const datos: FilaReporteIngreso[] = (response.datos ?? []).map((item, index) => ({
    ingresoId: String(item.ingresoAlmacenId ?? `ING-${index + 1}`),
    numeroIngreso: item.numeroIngreso ?? '',
    fechaIngreso: item.fechaIngreso ?? '',
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
  const response = await reporteProductoApi.listar2({
    busqueda: filtros.busqueda || undefined,
    tipoProductoId: idOpcional(filtros.tipoProductoId ?? ''),
    categoriaId: idOpcional(filtros.categoriaId ?? ''),
    destinoId: idOpcional(filtros.destinoId ?? ''),
    fechaDesde: fechaOpcional(filtros.fechaDesde ?? ''),
    fechaHasta: fechaOpcional(filtros.fechaHasta ?? ''),
    pagina: filtros.pagina,
    tamPagina: filtros.tamPagina,
  })
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

/* ============================================================
   Catálogos para filtros de reportes (GET /api/reportes/filtros)
   ============================================================ */

export interface OpcionFiltroReporte {
  id: string
  codigo: string
  nombre: string
}

export interface ProductoFiltroReporte extends OpcionFiltroReporte {
  tipoProductoId: string
  categoriaId: string
  unidadMedida: string
}

export interface FiltrosReporteCatalogos {
  proveedores: OpcionFiltroReporte[]
  centrosCosto: OpcionFiltroReporte[]
  destinos: OpcionFiltroReporte[]
  partesEquipo: OpcionFiltroReporte[]
  tiposProducto: OpcionFiltroReporte[]
  categorias: OpcionFiltroReporte[]
  productos: ProductoFiltroReporte[]
}

interface OpcionApi {
  id?: number
  codigo?: string | null
  nombre?: string | null
}

interface ProductoOpcionApi extends OpcionApi {
  tipoProductoId?: number
  categoriaId?: number
  unidadMedida?: string | null
}

type FiltrosReporteApiResponse = Partial<Record<
  'proveedores' | 'centrosCosto' | 'destinos' | 'partesEquipo' | 'tiposProducto' | 'categorias',
  OpcionApi[]
>> & { productos?: ProductoOpcionApi[] }

function cabecerasAutorizacion(): HeadersInit {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)?.replace(/["']+/g, '')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function mapearOpciones(opciones?: OpcionApi[]): OpcionFiltroReporte[] {
  return (opciones ?? [])
    .filter((opcion) => opcion.id != null)
    .map((opcion) => ({
      id: String(opcion.id),
      codigo: opcion.codigo ?? '',
      nombre: opcion.nombre ?? '',
    }))
}

let filtrosEnCurso: Promise<FiltrosReporteCatalogos> | null = null

/** Obtiene los catálogos de los filtros (se reutiliza la misma solicitud). */
export function obtenerFiltrosReporteApi(): Promise<FiltrosReporteCatalogos> {
  if (!filtrosEnCurso) {
    filtrosEnCurso = apiFetch<FiltrosReporteApiResponse>('/api/reportes/filtros', {
      headers: cabecerasAutorizacion(),
    })
      .then((respuesta) => ({
        proveedores: mapearOpciones(respuesta.proveedores),
        centrosCosto: mapearOpciones(respuesta.centrosCosto),
        destinos: mapearOpciones(respuesta.destinos),
        partesEquipo: mapearOpciones(respuesta.partesEquipo),
        tiposProducto: mapearOpciones(respuesta.tiposProducto),
        categorias: mapearOpciones(respuesta.categorias),
        productos: (respuesta.productos ?? [])
          .filter((producto) => producto.id != null)
          .map((producto) => ({
            id: String(producto.id),
            codigo: producto.codigo ?? '',
            nombre: producto.nombre ?? '',
            tipoProductoId: String(producto.tipoProductoId ?? ''),
            categoriaId: String(producto.categoriaId ?? ''),
            unidadMedida: producto.unidadMedida ?? '',
          })),
      }))
      .finally(() => {
        // Los catálogos pueden cambiar; la siguiente visita vuelve a consultarlos.
        filtrosEnCurso = null
      })
  }
  return filtrosEnCurso
}

/* ============================================================
   Reporte de Kardex (GET /api/reportes/kardex)
   ============================================================ */

export type NaturalezaMovimiento = 'ENTRADA' | 'SALIDA'

export interface MovimientoKardexReporte {
  id: number
  productoId: number
  codigoProducto: string
  producto: string
  unidadMedida: string
  fecha: string
  hora: string
  tipoMovimiento: string
  descripcionMovimiento: string
  naturaleza: NaturalezaMovimiento
  entrada: number
  salida: number
  saldoAnterior: number
  saldoNuevo: number
  precioUnitario: number
  numeroDocumento: string
  responsable: string
}

export interface StockKardexReporte {
  productoId: number
  codigo: string
  nombre: string
  unidadMedida: string
  stockActual: number
  stockMinimo: number
  requiereReposicion: boolean
}

export interface ReporteKardex {
  mensaje: string
  resumen: {
    totalMovimientos: number
    movimientosEntrada: number
    movimientosSalida: number
    cantidadEntrada: number
    cantidadSalida: number
  }
  movimientos: MovimientoKardexReporte[]
  stock: StockKardexReporte[]
}

export interface FiltrosKardexApi {
  productoId?: string
  tipoMovimiento?: string
  desde?: string
  hasta?: string
}

interface ReporteKardexApiResponse {
  message?: string
  data?: {
    resumen?: Partial<Record<keyof ReporteKardex['resumen'], unknown>>
    movimientos?: Array<Partial<Record<keyof MovimientoKardexReporte, unknown>>>
    stock?: Array<Partial<Record<keyof StockKardexReporte, unknown>>>
  }
}

const texto = (valor: unknown): string => (valor == null ? '' : String(valor))
const numero = (valor: unknown): number => Number(valor ?? 0) || 0

export async function obtenerReporteKardexApi(filtros: FiltrosKardexApi): Promise<ReporteKardex> {
  const parametros = new URLSearchParams()
  const productoId = idOpcional(filtros.productoId ?? '')
  if (productoId) parametros.set('productoId', String(productoId))
  if (filtros.tipoMovimiento) parametros.set('tipoMovimiento', filtros.tipoMovimiento)
  if (filtros.desde) parametros.set('desde', filtros.desde)
  if (filtros.hasta) parametros.set('hasta', filtros.hasta)
  const consulta = parametros.toString()

  const respuesta = await apiFetch<ReporteKardexApiResponse>(
    `/api/reportes/kardex${consulta ? `?${consulta}` : ''}`,
    { headers: cabecerasAutorizacion() },
  )
  const data = respuesta.data ?? {}

  return {
    mensaje: respuesta.message ?? '',
    resumen: {
      totalMovimientos: numero(data.resumen?.totalMovimientos),
      movimientosEntrada: numero(data.resumen?.movimientosEntrada),
      movimientosSalida: numero(data.resumen?.movimientosSalida),
      cantidadEntrada: numero(data.resumen?.cantidadEntrada),
      cantidadSalida: numero(data.resumen?.cantidadSalida),
    },
    movimientos: (data.movimientos ?? []).map((movimiento) => ({
      id: numero(movimiento.id),
      productoId: numero(movimiento.productoId),
      codigoProducto: texto(movimiento.codigoProducto),
      producto: texto(movimiento.producto),
      unidadMedida: texto(movimiento.unidadMedida),
      fecha: texto(movimiento.fecha),
      hora: texto(movimiento.hora),
      tipoMovimiento: texto(movimiento.tipoMovimiento),
      descripcionMovimiento: texto(movimiento.descripcionMovimiento),
      naturaleza: movimiento.naturaleza === 'ENTRADA' ? 'ENTRADA' : 'SALIDA',
      entrada: numero(movimiento.entrada),
      salida: numero(movimiento.salida),
      saldoAnterior: numero(movimiento.saldoAnterior),
      saldoNuevo: numero(movimiento.saldoNuevo),
      precioUnitario: numero(movimiento.precioUnitario),
      numeroDocumento: texto(movimiento.numeroDocumento),
      responsable: texto(movimiento.responsable),
    })),
    stock: (data.stock ?? []).map((producto) => ({
      productoId: numero(producto.productoId),
      codigo: texto(producto.codigo),
      nombre: texto(producto.nombre),
      unidadMedida: texto(producto.unidadMedida),
      stockActual: numero(producto.stockActual),
      stockMinimo: numero(producto.stockMinimo),
      requiereReposicion: producto.requiereReposicion === true,
    })),
  }
}
