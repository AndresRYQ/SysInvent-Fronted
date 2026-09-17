import type {
  UsuarioLogin,
} from '../types/auth'

import type {
  PerfilUsuarioFormData,
} from '../types/usuario'

import {
  actualizarUsuario,
  obtenerUsuarios,
} from './usuarioService'

export function obtenerPerfilUsuario(
  usuarioId: string,
): UsuarioLogin | null {
  const usuario =
    obtenerUsuarios().find(
      (item) =>
        item.id === usuarioId,
    )

  return usuario
    ? {
        ...usuario,
      }
    : null
}

export function actualizarPerfilUsuario(
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
        datos.nombreCompleto,
      email: datos.email,
      contrasena:
        deseaCambiarContrasena
          ? datos.nuevaContrasena
          : '',
      rol: usuarioActual.rol,
      estado: usuarioActual.estado,
    },
  )
}