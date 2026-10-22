export interface CentroCosto {
  id: number
  nombre: string
  descripcion: string
  activo: 0 | 1
  fechaRegistro?: string
}

export interface CentroCostoFormData {
  nombre: string
  descripcion: string
}
