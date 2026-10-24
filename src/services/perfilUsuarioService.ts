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

/* Legacy local profile update removed: profile changes now use the backend endpoint. */
/* export function actualizarPerfilUsuario(
  usuarioId: string,
  datos: PerfilUsuarioFormData,
): UsuarioLogin {
  const usuarioActual =
    obtenerUsuarios().find(
      (item) =>
        item.id === usuarioId,
    )

  if (!usuarioActual) {
    throw new Error(
      'No se encontró el usuario de la sesión actual.',
    )
  }

  if (!datos.contrasenaActual) {
    throw new Error(
      'Ingresa tu contraseña actual para guardar los cambios.',
    )
  }

  if (
    datos.contrasenaActual !==
    usuarioActual.contrasena
  ) {
    throw new Error(
      'La contraseña actual es incorrecta.',
    )
  }

  const deseaCambiarContrasena =
    Boolean(datos.nuevaContrasena) ||
    Boolean(datos.confirmarContrasena)

  if (deseaCambiarContrasena) {
    if (
      datos.nuevaContrasena.length < 6
    ) {
      throw new Error(
        'La nueva contraseña debe tener al menos 6 caracteres.',
      )
    }

    if (
      datos.nuevaContrasena !==
      datos.confirmarContrasena
    ) {
      throw new Error(
        'La confirmación no coincide con la nueva contraseña.',
      )
    }

    if (
      datos.nuevaContrasena ===
      datos.contrasenaActual
    ) {
      throw new Error(
        'La nueva contraseña debe ser diferente de la contraseña actual.',
      )
    }
  }

  return actualizarUsuario(
    usuarioActual.id,
    {
      usuario: datos.usuario,
      nombreCompleto:
        datos.nombres,
      email: datos.email,
      contrasena:
        deseaCambiarContrasena
          ? datos.nuevaContrasena
          : '',
      rol: usuarioActual.rol,
      estado: usuarioActual.estado,
    },
  )
} */

