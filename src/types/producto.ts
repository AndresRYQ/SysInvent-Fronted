export interface Producto {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  tipoProductoId: string
  categoriaId: string
  unidadMedidaId: string
  proveedorId: string
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
  estado?: boolean
}
