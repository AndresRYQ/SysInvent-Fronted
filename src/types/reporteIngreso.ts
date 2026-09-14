export type EstadoReporteIngreso = 'Registrado' | 'Anulado'

export interface ReporteIngreso {
  id: string
  numeroDocumento: string
  fecha: string
  proveedor: string
  tipoComprobante: string
  totalItems: number
  unidades: number
  responsable: string
  estado: EstadoReporteIngreso
}