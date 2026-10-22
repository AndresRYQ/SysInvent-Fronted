export interface UsuarioFormData {
  usuario: string
  nombreCompleto: string
  email: string
  contrasena: string
  rol: string
  estado: boolean
  dni?: string
  nombres?: string
  apePaterno?: string
  apeMaterno?: string
  rolId?: number | null
}

export interface PerfilUsuarioFormData {
  usuario: string
  nombreCompleto: string
  email: string
  contrasenaActual: string
  nuevaContrasena: string
  confirmarContrasena: string
}

