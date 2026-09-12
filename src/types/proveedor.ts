export interface Proveedor {
  id: string
  ruc: string
  razonSocial: string
  correo: string
  telefono: string
  direccion: string
  estado: boolean
  fechaRegistro: string
}

export interface ProveedorFormData {
  ruc: string
  razonSocial: string
  correo: string
  telefono: string
  direccion: string
  estado: boolean
}