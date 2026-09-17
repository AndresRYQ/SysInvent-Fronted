export type TipoMovimientoAlmacen =
  | 'ENTRADA'
  | 'SALIDA'

export type OrigenMovimientoAlmacen =
  | 'INGRESO'
  | 'VALE'

export type EstadoDocumentoMovimiento =
  | 'REGISTRADO'
  | 'ANULADO'

export type EstadoStockProducto =
  | 'CON_STOCK'
  | 'SIN_STOCK'

/**
 * Movimiento individual de un producto.
 *
 * Las entradas proceden de Ingresos.
 * Las salidas proceden de las distribuciones
 * registradas en Vales de consumo.
 */
export interface MovimientoAlmacen {
  id: string
  tipo: TipoMovimientoAlmacen
  origen: OrigenMovimientoAlmacen
  documentoId: string
  numeroDocumento: string
  fecha: string
  productoId: number
  cantidad: number
  precioUnitario: number
  destinoId: string | null
  parteEquipoId: string | null
  centroCostoId: string | null
  responsable: string
  estadoDocumento:
    EstadoDocumentoMovimiento
  afectaStock: boolean
}

/**
 * Resumen calculado de cada producto.
 *
 * No se guarda directamente en localStorage.
 * Se genera usando Ingresos y Vales.
 */
export interface ControlAlmacenProducto {
  productoId: number
  codigo: string
  nombre: string
  tipoProductoId: number
  categoriaId: number
  unidadMedidaId: number
  proveedorId: number
  totalEntradas: number
  totalSalidas: number
  stockDisponible: number
  estadoStock: EstadoStockProducto
  movimientos: MovimientoAlmacen[]
}

/**
 * Filtros utilizados por la pantalla
 * de Control de almacén.
 */
export interface FiltrosControlAlmacen {
  busqueda: string
  tipoProductoId: string
  categoriaId: string
  estadoStock: string
  fechaDesde: string
  fechaHasta: string
}



