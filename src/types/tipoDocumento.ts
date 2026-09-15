export interface TipoDocumento {
  id: number
  nombre: string
  descripcion: string
  activo: 0 | 1
  estado?: boolean
  fechaRegistro?: string
}

export interface TipoDocumentoFormData {
  nombre: string
  descripcion: string
}
