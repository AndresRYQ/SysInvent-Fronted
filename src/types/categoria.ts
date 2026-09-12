export interface Categoria {
  id: string
  nombre: string
  descripcion: string
  estado: boolean
  fechaRegistro: string
}

export interface CategoriaFormData {
  nombre: string
  descripcion: string
  estado: boolean
}