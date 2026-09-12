export interface Destino {
  id: string
  nombre: string
  descripcion: string
  estado: boolean
  fechaRegistro: string
}

export interface DestinoFormData {
  nombre: string
  descripcion: string
  estado: boolean
}