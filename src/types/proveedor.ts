export interface Proveedor {
  id: number
  ruc: string
  razonSocial: string
  correo: string
  telefono: string
  direccion: string
  activo: 0 | 1
  estado?: boolean
  fechaRegistro: string
}

export interface ProveedorFormData {
  ruc: string
  razonSocial: string
  correo: string
  telefono: string
  direccion: string
  estado?: boolean
}
