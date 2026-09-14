export type EstadoVale = 'Atendido' | 'Pendiente' | 'Anulado'

export interface ReporteVale {
  id: string
  fecha: string
  solicitante: string
  centroCosto: string
  destino: string
  productos: number
  unidades: number
  estado: EstadoVale
}