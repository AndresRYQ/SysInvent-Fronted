export interface ParteEquipo {
  id: number
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
  estado?: boolean
}
