export interface UsuarioLogin {
  id: string
  usuario: string
  contrasena: string
  email: string
  nombreCompleto: string
  rol: string
  estado: boolean
  dni?: string
  nombres?: string
  apePaterno?: string
  apeMaterno?: string
  rolId?: number | null
}

export interface CredencialesLogin {
  usuario: string
  contrasena: string
}

export interface SesionUsuario {
  id: string
  usuario: string
  nombreCompleto: string
  email: string
  rolId: number | null
  rol: string
  modulos: string[]
  token: string
  fechaInicio: string
  fechaExpiracion: string
}

export interface EstadoIntentosLogin {
  usuario: string
  intentosFallidos: number
  bloqueadoHasta: string | null
}

export interface ResultadoLogin {
  exitoso: boolean
  sesion: SesionUsuario | null
  mensaje: string
  bloqueadoHasta: string | null
}