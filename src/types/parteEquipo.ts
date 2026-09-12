export interface ParteEquipo {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  estado: boolean
  fechaRegistro: string
}

export interface ParteEquipoFormData {
  codigo: string
  nombre: string
  descripcion: string
  estado: boolean
}