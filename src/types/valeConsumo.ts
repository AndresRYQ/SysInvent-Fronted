export type EstadoValeConsumo =
  | 'REGISTRADO'
  | 'ANULADO'

/**
 * Distribución de una cantidad del producto.
 *
 * destinoId es obligatorio.
 * parteEquipoId es opcional porque no todas
 * las entregas pertenecen a un equipo.
 */
export interface DistribucionValeConsumo {
  id: string
  destinoId: string
  parteEquipoId: string | null
  cantidad: number
}

/**
 * Datos de distribución recibidos
 * desde el formulario.
 */
export type DistribucionValeConsumoFormData =
  Omit<DistribucionValeConsumo, 'id'>

/**
 * Producto incluido dentro del vale.
 *
 * Un producto puede contener varias
 * distribuciones hacia diferentes destinos
 * y partes de equipo.
 */
export interface DetalleValeConsumo {
  id: string
  productoId: string
  precioUnitario: number
  distribuciones:
    DistribucionValeConsumo[]
}

/**
 * Datos de un producto recibidos
 * desde el formulario.
 */
export interface DetalleValeConsumoFormData {
  productoId: string
  precioUnitario: number
  distribuciones:
    DistribucionValeConsumoFormData[]
}

/**
 * Registro definitivo del Vale de consumo.
 */
export interface ValeConsumo {
  id: string
  numeroVale: string
  fechaVale: string
  centroCostoId: string
  solicitante: string
  motivo: string
  estado: EstadoValeConsumo
  detalles: DetalleValeConsumo[]
  fechaRegistro: string
}

/**
 * Información recibida desde el formulario.
 *
 * El número, estado, identificadores y fecha
 * de registro se generarán automáticamente.
 */
export interface ValeConsumoFormData {
  fechaVale: string
  centroCostoId: string
  solicitante: string
  motivo: string
  detalles: DetalleValeConsumoFormData[]
}
