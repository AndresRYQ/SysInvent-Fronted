export interface UnidadMedida {
  id: string
  nombre: string
  descripcion: string
  estado: boolean
  fechaRegistro: string
}

export interface UnidadMedidaFormData {
  nombre: string
  descripcion: string
  estado: boolean
}