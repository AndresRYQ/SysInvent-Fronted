export interface Contacto {
  id: number
  proveedorId: string
  nombreCompleto: string
  cargo: string
  telefono: string
  correo: string
  activo: 0 | 1
  estado?: boolean
  fechaRegistro: string
}

export interface ContactoFormData {
  proveedorId: string
  nombreCompleto: string
  cargo: string
  telefono: string
  correo: string
}
