import { obtenerDashboardApi } from './reportesApiService'

export interface MovimientoRecienteDashboard {
  id: string
  fecha: string
  tipo: 'Ingreso' | 'Vale'
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

export async function obtenerResumenDashboard():
  Promise<ResumenDashboard> {
  return obtenerDashboardApi()
}