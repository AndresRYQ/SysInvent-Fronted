export interface Producto {
  id: number
  codigo: string
  nombre: string
  descripcion: string
  tipoProductoId: number
  categoriaId: number
  unidadMedidaId: number
  proveedorId: number
  stockActual: number
  stockMinimo: number
  precioUnitario: number
  estado: boolean
  fechaRegistro: string
}

export interface ProductoFormData {
  codigo: string
  nombre: string
  descripcion: string
  tipoProductoId: string
  categoriaId: string
  unidadMedidaId: string
  proveedorId: string
  stockMinimo: number
  precioUnitario: number
  estado: boolean
}
