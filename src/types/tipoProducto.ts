export interface TipoProducto {
  id: number
  nombre: string
  descripcion: string
  activo: 0 | 1
  /** Compatibilidad con consumidores antiguos. */
  estado?: boolean
}

export interface TipoProductoFormData {
  nombre: string
  descripcion: string
}
