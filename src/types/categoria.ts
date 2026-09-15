export interface Categoria {
  id: number
  nombre: string
  descripcion: string
  activo: 0 | 1
  /** Compatibilidad temporal con registros antiguos. */
  estado?: boolean
  fechaRegistro?: string
}

export interface CategoriaFormData {
  nombre: string
  descripcion: string
  /** Compatibilidad temporal del formulario anterior. */
  estado?: boolean
}
