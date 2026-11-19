import type {
  UsuarioLogin,
} from '../types/auth'

import type {
  PerfilUsuarioFormData,
} from '../types/usuario'

import { apiFetch } from './api'

interface PerfilUsuarioBackend {
  codigo?: string
  usuario?: string
  dni?: string
  nombres?: string
  apePaterno?: string
  apeMaterno?: string
  nombreCompleto?: string
  correo?: string
  nombreRol?: string
  estado?: boolean
}

export async function actualizarPerfilUsuarioBackend(
  datos: PerfilUsuarioFormData,
): Promise<void> {
  const respuesta = await apiFetch<{ success?: boolean; message?: string }>(
    '/api/usuarios/perfil',
    {
      method: 'PUT',
      body: JSON.stringify({
        nombres: datos.nombres,
        apePaterno: datos.apePaterno,
        apeMaterno: datos.apeMaterno,
        email: datos.email,
      }),
    },
  )

  if (respuesta.success === false) {
    throw new Error(respuesta.message ?? 'No se pudo actualizar el perfil.')
  }
}

export async function obtenerPerfilUsuarioBackend(): Promise<UsuarioLogin> {
  const respuesta = await apiFetch<PerfilUsuarioBackend>(
    '/api/usuarios/perfil',
  )

  return {
    id: '',
    codigo: respuesta.codigo ?? '',
    usuario: respuesta.usuario ?? '',
    dni: respuesta.dni ?? '',
    nombres: respuesta.nombres ?? '',
    apePaterno: respuesta.apePaterno ?? '',
    apeMaterno: respuesta.apeMaterno ?? '',
    nombreCompleto:
      respuesta.nombreCompleto ??
      [respuesta.nombres, respuesta.apePaterno, respuesta.apeMaterno]
        .filter(Boolean)
        .join(' '),
    email: respuesta.correo ?? '',
    contrasena: '',
    rol: respuesta.nombreRol ?? '',
    estado: respuesta.estado ?? false,
  }
}
