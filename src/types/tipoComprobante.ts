export interface TipoComprobante {
  id: string
  nombre: string
  descripcion: string
  estado: boolean
  fechaRegistro: string
}

export interface TipoComprobanteFormData {
  nombre: string
  descripcion: string
  estado: boolean
}