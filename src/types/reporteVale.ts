import type {
  EstadoValeConsumo,
} from './valeConsumo'

export interface FiltrosReporteVales {
  busqueda: string
  fechaDesde: string
  fechaHasta: string
  centroCostoId: string
  destinoId: string
  parteEquipoId: string
  tipoProductoId: string
  productoId: string
  estado: string
}

export interface FilaReporteVale {
  valeId: string
  detalleId: string
  distribucionId: string
  numeroVale: string
  fechaVale: string
  estado: EstadoValeConsumo
  centroCostoId: string
  centroCosto: string
  solicitante: string
  motivo: string
  tipoProductoId: string
  tipoProducto: string
  productoId: string
  codigoProducto: string
  producto: string
  categoria: string
  unidadMedida: string
  destinoId: string
  destino: string
  parteEquipoId: string
  codigoParteEquipo: string
  parteEquipo: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface ResumenReporteVales {
  totalVales: number
  valesRegistrados: number
  valesAnulados: number
  totalDistribuciones: number
  cantidadTotal: number
  totalValorizado: number
}