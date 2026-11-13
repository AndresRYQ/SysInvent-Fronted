import { obtenerDashboardApi } from './reportesApiService'

export interface MovimientoRecienteDashboard {
  id: string
  fecha: string
  /** Hora del movimiento (HH:mm). */
  hora?: string
  tipo: 'Ingreso' | 'Vale'
  /** Descripción del tipo de movimiento del Kardex (p. ej. "Salida por vale"). */
  descripcion?: string
  documento: string
  producto: string
  cantidad: number
  responsable: string
}

export interface AlertaDashboard {
  id: string
  titulo: string
  detalle: string
  tono: 'warning' | 'danger' | 'info'
}

export interface ResumenDashboard {
  productosActivos: number
  productosStockBajo: number
  productosSinStock: number
  ingresosDelMes: number
  valesDelMes: number
  movimientosHoy: number
  alertas: AlertaDashboard[]
  movimientosRecientes: MovimientoRecienteDashboard[]
}

/**
 * Obtiene los indicadores, alertas y actividad reciente del dashboard
 * desde el backend (GET /api/dashboard).
 */
export function obtenerResumenDashboard(): Promise<ResumenDashboard> {
  return obtenerDashboardApi()
}
