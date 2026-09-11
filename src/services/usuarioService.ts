import { USUARIOS_INICIALES } from '../data/usuarios'

import type {
  UsuarioLogin,
} from '../types/auth'

import type {
  UsuarioFormData,
} from '../types/usuario'

import {
  obtenerRoles,
  sincronizarConteoUsuarios,
} from './rolService'

import {
  guardarStorage,
  obtenerStorage,
  STORAGE_KEYS,
} from './storageService'

function copiarUsuarios(
  usuarios: UsuarioLogin[],
): UsuarioLogin[] {
  return usuarios.map((usuario) => ({
    ...usuario,
  }))
}

export function obtenerUsuarios():
  UsuarioLogin[] {
  const guardados =
    obtenerStorage<UsuarioLogin[]>(
      STORAGE_KEYS.usuarios,
      [],
    )

  const usuarios =
    guardados.length > 0
      ? guardados
      : USUARIOS_INICIALES

  if (guardados.length === 0) {
    guardarStorage(
      STORAGE_KEYS.usuarios,
      usuarios,
    )
  }

  sincronizarConteoUsuarios(usuarios)

  return copiarUsuarios(usuarios)
}

function guardarUsuarios(
  usuarios: UsuarioLogin[],
): void {
  guardarStorage(
    STORAGE_KEYS.usuarios,
    usuarios,
  )

  sincronizarConteoUsuarios(usuarios)
}

function normalizar(
  valor?: string | null,
): string {
  return (valor ?? '')
    .trim()
    .toLowerCase()
}

function validarDatos(
  datos: UsuarioFormData,
  idActual?: string,
): void {
  if (!datos.usuario.trim()) {
    throw new Error(
      'El nombre de usuario es obligatorio.',
    )
  }

  if (
    !/^[a-zA-Z0-9._-]+$/.test(
      datos.usuario.trim(),
    )
  ) {
    throw new Error(
      'El usuario solo puede contener letras, números, puntos, guiones y guion bajo.',
    )
  }

  if (!datos.nombreCompleto.trim()) {
    throw new Error(
      'El nombre completo es obligatorio.',
    )
  }

  if (!datos.email.trim()) {
    throw new Error(
      'El correo es obligatorio.',
    )
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      datos.email.trim(),
    )
  ) {
    throw new Error(
      'Ingresa un correo válido.',
    )
  }

  if (!datos.rol) {
    throw new Error(
      'Selecciona un rol.',
    )
  }

  const rolExiste = obtenerRoles().some(
    (rol) => rol.nombre === datos.rol,
  )

  if (!rolExiste) {
    throw new Error(
      'El rol seleccionado no existe.',
    )
  }

  const usuarios = obtenerUsuarios()

  const usuarioRepetido = usuarios.some(
    (usuario) =>
      usuario.id !== idActual &&
      normalizar(usuario.usuario) ===
        normalizar(datos.usuario),
  )

  if (usuarioRepetido) {
    throw new Error(
      'El nombre de usuario ya está registrado.',
    )
  }

  const correoRepetido = usuarios.some(
    (usuario) =>
      usuario.id !== idActual &&
      normalizar(usuario.email) ===
        normalizar(datos.email),
  )

  if (correoRepetido) {
    throw new Error(
      'El correo ya está registrado.',
    )
  }
}

function generarId(
  usuarios: UsuarioLogin[],
): string {
  const mayor = usuarios.reduce(
    (resultado, usuario) => {
      const numero = Number(
        usuario.id.replace('USR-', ''),
      )

      return Number.isNaN(numero)
        ? resultado
        : Math.max(resultado, numero)
    },
    0,
  )

  return `USR-${String(mayor + 1).padStart(
    3,
    '0',
  )}`
}

export function crearUsuario(
  datos: UsuarioFormData,
): UsuarioLogin {
  if (datos.contrasena.length < 6) {
    throw new Error(
      'La contraseña debe tener al menos 6 caracteres.',
    )
  }

  validarDatos(datos)

  const usuarios = obtenerUsuarios()

  const nuevo: UsuarioLogin = {
    id: generarId(usuarios),
    usuario: datos.usuario.trim(),
    nombreCompleto:
      datos.nombreCompleto.trim(),
    email: datos.email.trim().toLowerCase(),
    contrasena: datos.contrasena,
    rol: datos.rol,
    estado: datos.estado,
  }

  guardarUsuarios([...usuarios, nuevo])

  return nuevo
}

export function actualizarUsuario(
  id: string,
  datos: UsuarioFormData,
): UsuarioLogin {
  validarDatos(datos, id)

  const usuarios = obtenerUsuarios()

  const actual = usuarios.find(
    (usuario) => usuario.id === id,
  )

  if (!actual) {
    throw new Error(
      'El usuario seleccionado no existe.',
    )
  }

  if (
    datos.contrasena &&
    datos.contrasena.length < 6
  ) {
    throw new Error(
      'La contraseña debe tener al menos 6 caracteres.',
    )
  }

  const actualizado: UsuarioLogin = {
    ...actual,
    usuario: datos.usuario.trim(),
    nombreCompleto:
      datos.nombreCompleto.trim(),
    email: datos.email.trim().toLowerCase(),
    contrasena:
      datos.contrasena ||
      actual.contrasena,
    rol: datos.rol,
    estado: datos.estado,
  }

  guardarUsuarios(
    usuarios.map((usuario) =>
      usuario.id === id
        ? actualizado
        : usuario,
    ),
  )

  return actualizado
}

export function eliminarUsuario(
  id: string,
  usuarioActualId?: string,
): void {
  if (id === usuarioActualId) {
    throw new Error(
      'No puedes eliminar tu propio usuario.',
    )
  }

  const usuarios = obtenerUsuarios()

  const seleccionado = usuarios.find(
    (usuario) => usuario.id === id,
  )

  if (!seleccionado) {
    throw new Error(
      'El usuario seleccionado no existe.',
    )
  }

  const esAdministradorActivo =
    seleccionado.estado &&
    normalizar(seleccionado.rol) ===
      'administrador'

  if (esAdministradorActivo) {
    const administradoresActivos =
      usuarios.filter(
        (usuario) =>
          usuario.estado &&
          normalizar(usuario.rol) ===
            'administrador',
      )

    if (
      administradoresActivos.length <= 1
    ) {
      throw new Error(
        'Debe existir al menos un administrador activo.',
      )
    }
  }

  guardarUsuarios(
    usuarios.filter(
      (usuario) => usuario.id !== id,
    ),
  )
}