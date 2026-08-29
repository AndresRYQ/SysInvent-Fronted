export interface UsuarioLogin {
  id: string
  usuario: string
  contrasena: string
  email: string
  nombreCompleto: string
  rol: string
  estado: boolean
}

export interface CredencialesLogin {
    usuario: string
    contrasena: string
}

export interface SesionUsuario {
    id: string
    usuario: string
    nombreCompleto: string
    rol: string
    fechaInicio: string
}

export interface SesionUsuario {
  id: string
  usuario: string
  nombreCompleto: string
  rol: string
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