import type { EstadoIngresoAlmacen } from './ingresoAlmacen'

export interface FiltrosReporteIngresos {
  busqueda: string
  fechaDesde: string
  fechaHasta: string
  proveedorId: string
  tipoProductoId: string
  productoId: string
  estado: string
}

export interface FilaReporteIngreso {
  ingresoId: string
  numeroIngreso: string
  fechaIngreso: string
  estado: EstadoIngresoAlmacen
  tipoDocumento: string
  numeroDocumento: string
  proveedorId: string
  proveedor: string
  contacto: string
  tipoProductoId: string
  tipoProducto: string
  productoId: string
  codigoProducto: string
  producto: string
  categoria: string
  unidadMedida: string
  cantidad: number
  precioUnitario: number
  subtotal: number
  observacion: string
}

export interface ResumenReporteIngresos {
  totalIngresos: number
  ingresosRegistrados: number
  ingresosAnulados: number
  lineasProductos: number
  totalValorizado: number
}