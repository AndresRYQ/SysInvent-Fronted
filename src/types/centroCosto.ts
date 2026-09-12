export interface CentroCosto {
  id: string
  nombre: string
  descripcion: string
  estado: boolean
  fechaRegistro: string
}

export interface CentroCostoFormData {
  nombre: string
  descripcion: string
  estado: boolean
}