export interface Rol {
  id: string
  nombre: string
  descripcion: string
  estado: boolean
  usuarios: number
  modulos: string[]
}

export interface RolFormData {
  nombre: string
  descripcion: string
  estado: boolean
  modulos: string[]
}