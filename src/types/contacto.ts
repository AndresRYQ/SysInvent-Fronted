export interface Contacto {
  id: string
  proveedorId: string
  nombreCompleto: string
  cargo: string
  telefono: string
  correo: string
  estado: boolean
  fechaRegistro: string
}

export interface ContactoFormData {
  proveedorId: string
  nombreCompleto: string
  cargo: string
  telefono: string
  correo: string
  estado: boolean
}