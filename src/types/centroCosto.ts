export interface CentroCosto {
  id: number
  nombre: string
  descripcion: string
  activo: 0 | 1
}

export interface CentroCostoFormData {
  nombre: string
  descripcion: string
}
