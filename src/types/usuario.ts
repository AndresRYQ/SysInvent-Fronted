export interface UsuarioFormData {
  usuario: string
  nombreCompleto: string
  email: string
  contrasena: string
  rol: string
  estado: boolean
}

export interface PerfilUsuarioFormData {
  usuario: string
  nombreCompleto: string
  email: string
  contrasenaActual: string
  nuevaContrasena: string
  confirmarContrasena: string
}

