export type EstadoIngresoAlmacen =
  | 'REGISTRADO'
  | 'ANULADO'

/**
 * Producto incluido en un ingreso.
 *
 * El tipo, categoría y unidad se obtienen
 * mediante la relación con productoId.
 */
export interface DetalleIngresoAlmacen {
  id: string
  productoId: string
  cantidad: number
  precioUnitario: number
}

/**
 * Datos utilizados para agregar un producto
 * al formulario de ingreso.
 */
export type DetalleIngresoAlmacenFormData =
  Omit<DetalleIngresoAlmacen, 'id'>

/**
 * Registro definitivo de un ingreso.
 *
 * Destino y Parte de equipo se utilizarán
 * posteriormente en el Vale de consumo.
 */
export interface IngresoAlmacenRegistro {
  id: string
  numeroIngreso: string
  fechaIngreso: string
  proveedorId: string
  contactoId: string
  tipoDocumentoId: string
  numeroDocumento: string
  observacion: string
  estado: EstadoIngresoAlmacen
  detalles: DetalleIngresoAlmacen[]
  fechaRegistro: string
}

/**
 * Datos recibidos desde el formulario.
 */
export interface IngresoAlmacenFormData {
  fechaIngreso: string
  proveedorId: string
  contactoId: string
  tipoDocumentoId: string
  numeroDocumento: string
  observacion: string
  detalles: DetalleIngresoAlmacenFormData[]
}

/** Compatibilidad temporal para componentes de la maqueta anterior. */
export interface IngresoAlmacen {
  id: string
  fechaRegistro: string
  numeroIngreso: string
  proveedor: string
  producto: string
  unidadMedida: string
  cantidad: number
  almacen: string
  observacion: string
  estado: boolean
}


