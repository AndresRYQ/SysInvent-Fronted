export interface TipoProducto {
  id: string
  nombre: string
  descripcion: string
  estado: boolean
  fechaRegistro: string
}

export interface TipoProductoFormData {
  nombre: string
  descripcion: string
  estado: boolean
}