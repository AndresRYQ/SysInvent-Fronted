export interface UsuarioFormData {
  usuario: string
  nombreCompleto: string
  dni?: string
  nombres?: string
  apePaterno?: string
  apeMaterno?: string
  email: string
  contrasena: string
  rol: string
  rolId?: number | null
  estado: boolean
}

export interface PerfilUsuarioFormData {
  usuario: string
  nombres: string
  apePaterno: string
  apeMaterno: string
  email: string
  contrasenaActual: string
  nuevaContrasena: string
  confirmarContrasena: string
}

