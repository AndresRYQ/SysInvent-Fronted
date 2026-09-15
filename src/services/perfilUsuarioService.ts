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
      'No se encontrÃ³ el usuario de la sesiÃ³n actual.',
    )
  }

  if (!datos.contrasenaActual) {
    throw new Error(
      'Ingresa tu contraseÃ±a actual para guardar los cambios.',
    )
  }

  if (
    datos.contrasenaActual !==
    usuarioActual.contrasena
  ) {
    throw new Error(
      'La contraseÃ±a actual es incorrecta.',
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
        'La nueva contraseÃ±a debe tener al menos 6 caracteres.',
      )
    }

    if (
      datos.nuevaContrasena !==
      datos.confirmarContrasena
    ) {
      throw new Error(
        'La confirmaciÃ³n no coincide con la nueva contraseÃ±a.',
      )
    }

    if (
      datos.nuevaContrasena ===
      datos.contrasenaActual
    ) {
      throw new Error(
        'La nueva contraseÃ±a debe ser diferente de la contraseÃ±a actual.',
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

